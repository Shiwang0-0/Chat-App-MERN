import { compare } from "bcrypt";
import { redis } from "../app.js";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { customError, tryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { Request } from "../models/request.js";
import { User } from "../models/user.js";
import { uploadFilesToCloudinary } from "../utils/cloudinary.js";
import { emitEvent } from "../utils/eventEmitter.js";
import { cookieOption, sendtoken } from "../utils/token.js";

const newUser=tryCatch(async(req,res)=>{
    const { name, username, password} = req.body;
    const file = req.file;
    let avatar=null;
    if(file)
        {
            const uploadedFile=await uploadFilesToCloudinary([file])
             avatar={
                public_id:uploadedFile[0].public_id,
                url:uploadedFile[0].url
            }
        }
    const user= await User.create({name,username,password,avatar});
    if(!user)
        {
            return next(new customError("Error, Please try again",500));
        }
    sendtoken(res,user,201,"User created")
})

const login = tryCatch(async(req,res,next)=>{
    
        const {username,password}=req.body;
        const user=await User.findOne({username}).select("+password");
    
        if(!user)
            return next(new customError("Invalid Credentials",401));
    
        const isPassword=await compare(password,user.password);
    
        if(!isPassword)
            return next(new customError("Invalid Credentials",401));
    
        sendtoken(res,user,201,"User Logged in")   
})


const myProfile=async(req,res,next)=>{
    const userId=req.user._id;


    const myProfileKey=`my_profile:${userId}`

    const cachedProfile=await redis.get(myProfileKey);

    let user;

    if(cachedProfile){
        user=await JSON.parse(cachedProfile);
    }
    else{
        user=await User.findById(userId);
    }
    
    if(!user)
        return next(new customError("Cannot find user",403));

    await redis.setex(myProfileKey,100,JSON.stringify(user));

    return res.status(200).json({
        success:true,
        user:user
    })
}


const logout=async(req,res)=>{
    
    return res.status(200).cookie("val-token","",{...cookieOption,maxAge:0}).json({
        success:true,
        message:"Logout Successful"
    })
}


const searchUser=tryCatch(async(req,res,next)=>{

    const searchKey=`search_user:${req.user._id}`
    const cachedSearch=await redis.get(searchKey);

    const { name="" }=req.query;

    if(cachedSearch){
        const users=await JSON.parse(cachedSearch);
        return res.status(200).json({
            success:true,
            users
        })
    }

    const myChats=await Chat.find({groupChat:false, members:req.user._id});


    const allUserInMyChat = myChats.flatMap((chat) => chat.members);
    
    const allOtherUsersFromMyChat=await User.find({
        _id:{$nin:[...allUserInMyChat,req.user._id]},
        name:{$regex:name, $options:"i"}
    })


    const users=allOtherUsersFromMyChat.map(({_id,name,avatar})=>({
        _id,name,avatar:avatar.url
    }))

    await redis.setex(searchKey,800,JSON.stringify(users));
    
    return res.status(200).json({
        success:true,
        users
    })
})


const sendFriendRequest=tryCatch(async(req,res,next)=>{
    const {userId}=req.body;
    const searchKey=`search_user:${req.user._id}`

    const isRequestAlreadySent=await Request.findOne({
            $or:[
                {sender:req.user._id,receiver:userId},
                {sender:userId,receiver:req.user._id},
        ]})
    
    if(isRequestAlreadySent){
        next(new customError("Request already sent",400))
        return;
    }

    const isAlreadyAFriend = await Chat.findOne({
        members: { $all: [req.user._id, userId] },
        groupChat: false,
    });

    if (isAlreadyAFriend) {
        next(new customError("User is already a friend", 400));
        return;
    }
    await Request.create({
        sender:req.user._id,
        receiver:userId
    })

    emitEvent(req,NEW_REQUEST,[userId])
    await redis.del(searchKey);
    return res.status(200).json({
        success:true,
        message:"Request sent successfully"
    })
})


const acceptFriendRequest=tryCatch(async(req,res,next)=>{
    const {requestId, accept}=req.body;

    const request= await Request.findById(requestId).populate("sender","name").populate("receiver","name")
    
    if(!request)
        return next(new customError("Request not found",400))

    if(request.receiver._id.toString() != req.user._id.toString())
        return next(new customError("You are not authorized to accept the request",401));

    const receiverId = request.receiver._id.toString();
    const senderId = request.sender._id.toString();

    const receiverRequestsKey = `friend_requests:${receiverId}`;
    const senderRequestsKey = `friend_requests:${senderId}`;
    const receiverChatsKey = `my_chats:${receiverId}`;
    const senderChatsKey = `my_chats:${senderId}`;


    if(!accept)
        {
            await request.deleteOne();
            await Promise.all([
                redis.del(receiverRequestsKey),
                redis.del(senderRequestsKey)
            ]);
            return res.status(200).json({
                success: false,
                message: "Friend request rejected"
            });
        }

    const members=[request.sender._id, request.receiver._id]

    await Promise.all([
        Chat.create({members,name:`${request.sender.name}-${request.receiver.name}`}), 
        request.deleteOne()
    ])

    const [receiverChats, senderChats] = await Promise.all([
        Chat.find({ members: receiverId }).populate("members", "name avatar"),
        Chat.find({ members: senderId }).populate("members", "name avatar")
    ]);

    await Promise.all([
        redis.del(receiverRequestsKey, senderRequestsKey),
        redis.setex(receiverChatsKey, 800, JSON.stringify(receiverChats)),
        redis.setex(senderChatsKey, 800, JSON.stringify(senderChats))
    ]);


    emitEvent(req,REFETCH_CHATS, [senderId, receiverId]);

    return res.status(200).json({
        success:true,
        message:"request accepted",
        senderId:request.sender._id
    })
})


const notifications=tryCatch(async(req,res,next)=>{
    const request= await Request.find({receiver:req.user._id}).populate("sender","name avatar")

    if(!request)
        next(new customError("No request found",401));

    const allRequests=request.map(({_id,sender})=>({
        _id,
        sender:{
            _id:sender._id,
            name:sender.name,
            avatar:sender.avatar.url
        }
    }));

    return res.status(200).json({
        success:true,
        allRequests
    })
})


const availableFriends=tryCatch(async(req,res,next)=>{

    const chatId=req.query.chatId;

    const friendsKeyPattern = `friends:${req.user._id}-*`;
    const keysToInvalidate = await redis.keys(friendsKeyPattern);
    await Promise.all(keysToInvalidate.map((key) => redis.del(key)));

    const cachedFriends=await redis.get(friendsKeyPattern);

    if(cachedFriends){
        const friends=await JSON.parse(cachedFriends);
        return res.status(200).json({
            success:true,
            friends
        })
    }

    const chats=await Chat.find({
        members:req.user,
        groupChat:false
    }).populate("members", "name avatar")


    const friends=chats.map(({members})=>{
        const otherUsers=getOtherMember(members,req.user)
        return {
            _id:otherUsers._id,
            name:otherUsers.name,
            avatar:otherUsers.avatar.url
        }   
    })  

    if(chatId)
        {
            const chat=await Chat.findById(chatId);
            const availFriends=friends.filter((i)=>!chat.members.includes(i._id))

            await redis.setex(friendsKeyPattern,100,JSON.stringify(availFriends))

            return res.status(200).json({
                success:true,
                friends:availFriends
            })
        }
    else
        {
            await redis.setex(friendsKeyPattern,100,JSON.stringify(friends))
            return res.status(200).json({
                success:true,
                friends
            }) 
        }

})


export { acceptFriendRequest, availableFriends, login, logout, myProfile, newUser, notifications, searchUser, sendFriendRequest };

