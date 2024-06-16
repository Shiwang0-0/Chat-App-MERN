import { compare } from "bcrypt";
import { REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { customError, tryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { Request } from "../models/request.js";
import { User } from "../models/user.js";
import { emitEvent } from "../utils/eventEmitter.js";
import { cookieOption, sendtoken } from "../utils/token.js";
import { uploadFilesToCloudinary } from "../utils/cloudinary.js";

const newUser=tryCatch(async(req,res)=>{
    const { name, username, password} = req.body;
    const file = req.file;
    let avatar=null;
    if(file)
        {
            const uploadedFile=await uploadFilesToCloudinary([file])
             avatar={
                public_id:uploadedFile[0].public_id,
                url:uploadedFile[0].secure_url
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
    
    const user=await User.findById(userId);
    if(!user)
        return next(new customError("Cannot find user",403));

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
    const { name="" }=req.query;

    const myChats=await Chat.find({groupChat:false, members:req.user});

    const allUserInMyChat=myChats.map((i)=>i.members).flat();

    const allOtherUsersFromMyChat=await User.find({
        _id:{$nin:allUserInMyChat},
        name:{$regex:name, $options:"i"}
    })

    const users=allOtherUsersFromMyChat.map((_id,name,avatar)=>({
        _id,
        name,avatar:avatar.url
    }))

    return res.status(200).json({
        success:true,
        users
    })
})


const sendFriendRequest=tryCatch(async(req,res,next)=>{
    const {userId}=req.body;

    const isRequestAlreadySent=await Request.findOne({
            $or:[
                {sender:req.user._id,receiver:userId},
                {sender:userId,receiver:req.user._id},
        ]})
    
        if(isRequestAlreadySent)
            next(new customError("Request already sent",400))

    await Request.create({
        sender:req.user._id,
        receiver:userId
    })

    return res.status(200).json({
        success:true,
        message:"Request sent successfully"
    })
})


const acceptFriendRequest=tryCatch(async(req,res,next)=>{
    const {requestId, accept}=req.body;

    const request= await Request.findById(requestId).populate("sender","name").populate("receiver","name")
    
    if(!request)
        next(new customError("Request not found",400))

    if(request.receiver._id.toString() != req.user._id.toString())
        next(new customError("You are not authorized to accepct the request",401));
    if(!accept)
        {
            await request.deleteOne();
            return res.status(200).json({
                success:true,
                message:"friend request rejected"
            })
        }

    const members=[request.sender._id, request.receiver._id]

    await Promise.all[
        Chat.create({members,name:`${request.sender.name}-${request.receiver.name}`}), 
        request.deleteOne()
    ]

    emitEvent(req,REFETCH_CHATS,members);

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
    const chatId=req.query._id;

    const chats=await Chat.find({
        members:req.user._id,
        groupChat:false
    }).populate("members", "name avatar")

    const newFriends=chats.map(({members})=>{
        const otherUsers=getOtherMember(members,req.user._id)
        return {
            _id:otherUsers._id,
            name:otherUsers.name,
            avatar:otherUsers.avatar.url
        }   
    })  

    if(chatId)
        {
            const chat=await Chat.findById(chatId);
            const availableFriends=friends.filter((i)=>!chat.members.includes(i._id))
            return res.status(200).json({
                success:true,
                availableFriends
            })
        }
    else
        {
            return res.status(200).json({
                success:true,
                newFriends
            }) 
        }

})


export { acceptFriendRequest, availableFriends, login, logout, myProfile, newUser, notifications, searchUser, sendFriendRequest };
