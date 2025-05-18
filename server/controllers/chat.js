import { redis } from "../app.js";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { customError, tryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import { deleteFilesFromCloudinary, uploadFilesToCloudinary } from "../utils/cloudinary.js";
import { emitEvent } from "../utils/eventEmitter.js";

const createGroup=tryCatch(async(req,res,next)=>{
    const {name, members,avatar}=req.body;

    const allMembers=[...members,req.user];
    let groupAvatar=null;
    if(avatar)
        {
            const uploadedFile=await uploadFilesToCloudinary([avatar])
             groupAvatar={
                public_id:uploadedFile[0].public_id,
                url:uploadedFile[0].url
            }
        }
    
    await Chat.create({
        name,
        groupChat:true,
        groupAvatar,
        members:allMembers,
        creator:req.user
    })


    emitEvent(req,REFETCH_CHATS,members);

    return res.status(201).json({
        success:true,
        message:"Group Creted"
    })
})


const getMyChats=tryCatch(async(req,res,next)=>{
    const myChatKey=`my_chats:${req.user._id}`

    const cachedChat=await redis.get(myChatKey);

    let chats;

    if (cachedChat) {
        chats=await JSON.parse(cachedChat)
    }
    else{
        chats=await Chat.find({members:req.user}).populate("members","name avatar")
    }

    const transformedChats=chats?.map(({_id,name,members,groupChat,groupAvatar})=>{console.log({_id,name,members,groupChat,groupAvatar})
        const otherMember=getOtherMember(members,req.user);
        return {
            _id,
            groupChat,
            groupAvatar:groupChat?[groupAvatar?.url]:[otherMember?.avatar?.url],
            name:groupChat?name:otherMember.name,
            members:members.reduce((prev,curr)=>{
                if(curr._id.toString()!==req.user._id.toString())
                    {
                        prev.push(curr._id);
                    }
                return prev;
            },[]),
        }
    })

    await redis.setex(myChatKey, 400, JSON.stringify(chats));

    return res.status(200).json({
        success:true,
        chats:transformedChats
    })
})


const getMyGroups=tryCatch(async(req,res,next)=>{

    const myGroupKey=`my_group:${req.user._id}`;

    const cachedGroups=await redis.get(myGroupKey)

    let groups;

    if(cachedGroups){
        groups=await JSON.parse(cachedGroups)
    }
    else{
        groups=await Chat.find({
            members:req.user,
            groupChat:true,
            creator:req.user
        }).populate("members", "name avatar");
    }
     
    const transformedGroups=groups.map(({name,_id,groupChat,groupAvatar})=>({
        _id,
        groupChat,
        name,
        groupAvatar
    }))

    await redis.setex(myGroupKey, 120, JSON.stringify(groups))

    return res.status(200).json({
        success:true,
        groups:transformedGroups
    })
})


const addMembers=tryCatch(async (req,res,next) => {

    const myGroupKey=`my_group:${req.user._id}`;

    await redis.del(myGroupKey);

    const {chatId,members}=req.body;

    const chat=await Chat.findById(chatId);

    if(!chat)
        return next(new customError("Chat not found",404));
    if(!chat.groupChat)
        return next(new customError("This is not a group Chat",403));
    if(chat.creator.toString()!==req.user._id.toString())
        return next(new customError("You are not allowed to add members",403));

    const allMemberPromise=members.map(
        (i)=>User.findById(i,"name")
    )
    const allNewMembers= await Promise.all(allMemberPromise);

    if(allNewMembers.length===0)
        return next(new customError("Cant find the User",404))

    const uniqueMembers = allNewMembers.filter(i => !chat.members.includes(i._id.toString())).map((i)=>i._id);
    if(uniqueMembers.length===0)
            return next(new customError("Already in the group",400))

    chat.members.push(...uniqueMembers.map(member => member._id));

    if(chat.members.length > 50)
        return next(new customError("Max limit of group is reached",403));

    await chat.save();

    const allUsernamesAdded=allNewMembers.map((i)=>i.name).join(",");

    emitEvent(req,REFETCH_CHATS,chat.members)

    res.status(200).json({
        success:true,
        message:"members added succesfully"
    })

})


const removeMembers=tryCatch(async (req,res,next) => {

    const myGroupKey=`my_group:${req.user._id}`;

    await redis.del(myGroupKey);

    const {chatId,userId}=req.body;

    const [chat,usersToBeRemoved]=await Promise.all([
        Chat.findById(chatId),
        User.findById(userId)
    ])

    if(!chat)
        return next(new customError("Chat not found",404));
    if(!chat.groupChat)
        return next(new customError("This is not a group Chat",403));

    if(chat.creator.toString()!==req.user._id.toString())
        return next(new customError("You are not allowed to remove members",403));


    if(chat.members.length <= 3)
        return next(new customError("Group should atleast have 3 members",400));

    const allChatMembers = chat.members.map((i) => i.toString());

    chat.members = chat.members.filter(
        (member) => member.toString() !== userId.toString()
    );

    await chat.save();


    emitEvent(req,REFETCH_CHATS,allChatMembers)

    res.status(200).json({
        success:true,
        message:"member removed succesfully"
    })

})


const leaveGroup=tryCatch(async (req,res,next) => {

    const myGroupKey=`my_group:${req.user._id}`;

    await redis.del(myGroupKey);

    const chatId=req.params.id;

    const chat=await Chat.findById(chatId);

    const user=await User.findById(req.user._id);
    const userName=user.name;

    if(!chat)
        return next(new customError("Chat not found",404));
    if(!chat.groupChat)
        return next(new customError("This is not a group Chat",400));

    const remainingMembers=chat.members.filter(i=>i.toString()!==req.user._id.toString());

    if(remainingMembers.length < 3)
        return next(new customError("Group must have atleast 3 members",400));

    if(chat.creator.toString()===req.user._id.toString())
        {
            const randomNum=Math.floor(Math.random()*remainingMembers.length)
            const newCreator=remainingMembers[randomNum];
            chat.creator=newCreator;
        }
    
    chat.members=remainingMembers

    await chat.save();


    emitEvent(req,REFETCH_CHATS,chat.members)

    res.status(200).json({
        success:true,
        message:"Group Leaved Successfully"
    })

})


const sendAttachment=tryCatch(async (req,res,next) => {

    const {chatId}=req.body;

    const files=req.files || [];

    if(files.length < 1)
        return next(new customError("Please upload attachments",400));
    if(files.length > 5)
        return next(new customError("5 files can be uploaded at max",400));

    const chat=await Chat.findById(chatId);

    const user=await User.findById(req.user._id);
    const userName=user.name;

    if(!chat)
        return next(new customError("Chat not found",404));


    const attachments=await uploadFilesToCloudinary(files)

    
    const messageDatabase={
        content:"",
        attachments,
        sender:req.user._id,
        chat:chatId   
    }   

    const messageRealTime={
        ...messageDatabase,
        sender:{
            _id:req.user._id,
            name:userName
        },
    }

    const message=await Message.create(messageDatabase)

    emitEvent(req, NEW_MESSAGE, chat.members, {
        message: messageRealTime,
        chatId,
      });
    
    emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });

    res.status(200).json({
        success:true,
        message
    })

})



const getChatDetail=tryCatch(async (req,res,next) => {

    if(req.query.populate === "true")
        {
            const chat=await Chat.findById(req.params.id).populate("members","name avatar").lean();
            if(!chat)
                return next(new customError("Chat not found",404));

            chat.members=chat.members.map(({_id,name,avatar})=>(
                {
                    _id,
                    name,
                    avatar:avatar?.url
                }
            ))
            res.status(200).json({
                success:true,
                chat
            })
        }
    else
    {
        const chat=await Chat.findById(req.params.id)
            if(!chat)
                return next(new customError("Chat not found",404));
            res.status(200).json({
                success:true,
                chat
            })
    }  

})


const renameGroup=tryCatch(async (req,res,next) => {

    const myGroupKey=`my_group:${req.user._id}`;

    await redis.del(myGroupKey);

    const chatId=req.params.id;
    const {name}=req.body

    const chat=await Chat.findById(chatId);

    if(!chat)
        return next(new customError("Chat not found",404));
    if(!chat.groupChat)
        return next(new customError("This is not a group Chat",403));

    if(chat.creator.toString()!=req.user._id.toString())
        return next(new customError("You are not the admin",403));

    chat.name=name; 

    await chat.save();

    emitEvent(req,REFETCH_CHATS,chat.members,"Group name changed")

    res.status(200).json({
        success:true,
        message:"Group name changed"
    })
})



const deleteChats=tryCatch(async (req,res,next) => {

    const chatId=req.params.id;

    const chat=await Chat.findById(chatId);

    if(!chat)
        return next(new customError("Chat not found",404));
    

    if(chat.groupChat && chat.creator.toString()!==req.user._id.toString())
        return next(new customError("you are not allowed to delete the group",403))

    if(!chat.groupChat && !chat.members.includes(req.user._id.toString()))
    {
        return next(new customError("you are not allowed to delete the chat",403))
    }

    const messages=await Message.find({chat:chatId,attachments:{$exists:true,$ne:[]}})

    const publicFileIds=[];

    messages.forEach(({attachments})=>{attachments.forEach(({public_id})=>publicFileIds.push(public_id))})


    await Promise.all([
        deleteFilesFromCloudinary(publicFileIds),
        chat.deleteOne(),
        Message.deleteMany({chat:chatId}),
    ]);

    const cacheKeys = chat.members.flatMap(memberId => [
        `my_group:${memberId}`,
        `my_chats:${memberId}`
    ]);
    await redis.del(...cacheKeys);

    emitEvent(req,REFETCH_CHATS,chat.members)

    res.status(200).json({
        success:true,
        message:"Chat deleted"
    })
})


const chatMessages=tryCatch(async (req,res,next) => {
    const chatId=req.params.id;
    const {page=1}=req.query;
    const chatMsgKey=`chat_msg:${req.user._id}-${chatId}-${page}`
    const cachedChatMsg=await redis.get(chatMsgKey);

    if(cachedChatMsg){
        const {messages, totalPages}=await JSON.parse(cachedChatMsg);

        return res.status(200).json({
            success:true,
            messages:messages.reverse(),
            totalPages
        })
    }

    const chat=await Chat.findById(chatId);

    if(!chat)
        return next(new customError("Chat not found",400));
    if(!chat.members.includes(req.user._id.toString()))
        return next(new customError("You are not allowed to access this chat",403))

    const messagePerPage=20;
    const skip=(page-1)*messagePerPage;

    const [messages,totalCount]=await Promise.all([
        Message.find({chat:chatId})
        .sort({createdAt:-1})
        .skip(skip)
        .limit(messagePerPage)
        .populate("sender","name")
        .lean(),
        Message.countDocuments({chat:chatId})
    ])

    const totalPages=Math.ceil(totalCount/messagePerPage) || 0;

    await redis.setex(chatMsgKey, 150, JSON.stringify({
        messages: messages,
        totalPages
    }));

    res.status(200).json({
        success:true,
        messages:messages.reverse(),
        totalPages
    })
})


export { addMembers, chatMessages, createGroup, deleteChats, getChatDetail, getMyChats, getMyGroups, leaveGroup, removeMembers, renameGroup, sendAttachment };

