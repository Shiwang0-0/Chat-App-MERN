import { ALERT, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { customError, tryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { User } from "../models/user.js";
import { emitEvent } from "../utils/eventEmitter.js";

const createGroup=tryCatch(async(req,res,next)=>{
    const {name, members,groupAvatar}=req.body;

    if(members.length<2)
        return next(new customError("Group should have more than 2 members",400))

    const allMembers=[...members,req.user];

    await Chat.create({
        name,
        groupChat:true,
        groupAvatar,
        members:allMembers,
        creator:req.user
    })

    emitEvent(req,ALERT,allMembers,`Welcome to ${name} group`)
    emitEvent(req,REFETCH_CHATS,members);

    return res.status(201).json({
        success:true,
        message:"Group Creted"
    })
})


const getMyChats=tryCatch(async(req,res,next)=>{
    const chats=await Chat.find({members:req.user}).populate("members","name avatar")

    const transformedChats=chats.map(({_id,name,members,groupChat,groupAvatar})=>{

        const otherMember=getOtherMember(members,_id);
        return {
            _id,
            groupChat,
            groupAvatar:groupChat?groupAvatar.url:[otherMember.avatar.url],
            name:groupChat?name:[otherMember.name],
            members:members.reduce((prev,curr)=>{
                if(curr._id.toString()!==req.user._id.toString())
                    {
                        prev.push(curr._id);
                    }
                return prev;
            },[]),
        }
    })

    return res.status(200).json({
        success:true,
        chats:transformedChats
    })
})


const getMyGroups=tryCatch(async(req,res,next)=>{
    const chats= await Chat.find({
        members:req.user,
        groupChat:true,
        creator:req.user
    }).populate("members", "name avatar");

    const transformedGroups=chats.map(({name,_id,groupChat,groupAvatar})=>({
        _id,
        groupChat,
        name,
        groupAvatar
    }))
    return res.status(200).json({
        success:true,
        chats:transformedGroups
    })
})


const addMembers=tryCatch(async (req,res,next) => {

    const {chatId,newMembers}=req.body;

    if(newMembers.length===0)
        return next(new customError("please provide new members",400));

    const chat=await Chat.findById(chatId);

    if(!chat)
        return next(new customError("Chat not found",400));
    if(!chat.groupChat)
        return next(new customError("This is not a group Chat",400));
    if(chat.creator.toString()!==req.user._id.toString())
        return next(new customError("You are not allowed to add members",403));

    const allMemberPromise=newMembers.map(
        (i)=>User.findById(i,"name")
    )
    const allNewMembers= await Promise.all(allMemberPromise);

    if(allNewMembers.length===0)
        return next(new customError("Cant find the User",400))

    const uniqueMembers = allNewMembers.filter(i => !chat.members.includes(i._id.toString())).map((i)=>i._id);
    console.log(uniqueMembers)
    if(uniqueMembers.length===0)
            return next(new customError("Already in the group",400))

    chat.members.push(...uniqueMembers.map(member => member._id));

    if(chat.members.length > 50)
        return next(new customError("Max limit of group is reached",403));

    await chat.save();

    const allUsernamesAdded=allNewMembers.map((i)=>i.name).join(",");

    emitEvent(req,ALERT,chat.members,`${allUsernamesAdded} added to the group`)
    emitEvent(req,REFETCH_CHATS,chat.members)

    res.status(200).json({
        success:true,
        message:"members added succesfully"
    })

})


const removeMembers=tryCatch(async (req,res,next) => {

    const {chatId,removeMembers}=req.body;

    if(removeMembers.length===0)
        return next(new customError("please provide members to be removed",400));

    const chat=await Chat.findById(chatId);

    if(!chat)
        return next(new customError("Chat not found",400));
    if(!chat.groupChat)
        return next(new customError("This is not a group Chat",400));
    if(chat.creator.toString()!==req.user._id.toString())
        return next(new customError("You are not allowed to add members",403));
    
    const allMemberPromise=removeMembers.map(
        (i)=>User.findById(i,"name")
    )
    const allremovedMembers= await Promise.all(allMemberPromise);

    if(allremovedMembers.length===0)
        return next(new customError("Cant find the User",400))

    console.log(chat.members)

    chat.members=chat.members.filter(((i)=>!allremovedMembers.some(j=>j._id.toString()===i._id.toString())));

    console.log(chat.members)

    if(chat.members.length <= 3)
        return next(new customError("Group should atleast have 3 members",400));

    await chat.save();

    const allUsernamesRemoved=allremovedMembers.map((i)=>i.name).join(",");

    emitEvent(req,ALERT,chat.members,`${allUsernamesRemoved} removed from the group`)
    emitEvent(req,REFETCH_CHATS,chat.members)

    res.status(200).json({
        success:true,
        message:"members removed succesfully"
    })

})



const leaveGroup=tryCatch(async (req,res,next) => {

    const chatId=req.params.id;

    const chat=await Chat.findById(chatId);

    if(!chat)
        return next(new customError("Chat not found",400));
    if(!chat.groupChat)
        return next(new customError("This is not a group Chat",400));


    console.log(chat.members)
    const remainingMembers=chat.members.filter(i=>i.toString()!==req.user._id.toString());
    console.log(remainingMembers)

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


    emitEvent(req,ALERT,chat.members,`someone left the group`)
    emitEvent(req,REFETCH_CHATS,chat.members)

    res.status(200).json({
        success:true,
        message:"User left the group"
    })

})

export { addMembers, createGroup, getMyChats, getMyGroups, removeMembers, leaveGroup };
