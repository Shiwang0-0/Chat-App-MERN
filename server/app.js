import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from 'http';
import { Server } from "socket.io";
import { v4 as uuid } from "uuid";
import { corsOption } from "./constants/config.js";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT, START_TYPING, STOP_TYPING } from "./constants/events.js";
import { usersSockets } from "./lib/helper.js";
import { socketAuthenticator } from "./middlewares/auth.js";
import { errorMiddleware } from "./middlewares/error.js";
import { Message } from "./models/message.js";
import chatRoute from "./routes/chat.js";
import userRoute from "./routes/user.js";
import { connectDB } from "./utils/database.js";


const app=express();
const server=createServer(app);
const io=new Server(server,{
    cors:corsOption
});

app.set("io", io);  

dotenv.config({
    path:"./.env"
});

const uri=process.env.MONGO_URI;
const port=process.env.PORT || 3000;
const usersSocketIds=new Map();

connectDB(uri);

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})


app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOption))


app.use("/api/v1/user",userRoute);
app.use("/api/v1/chat",chatRoute);

app.get("/",(req,res)=>{
    res.send("Welcome to Home")
})


io.use((socket,next)=>{
    cookieParser()(socket.request,socket.request.res,
        async(err) => await socketAuthenticator(err,socket,next)
    )
})

io.on("connection",(socket)=>{
    const user=socket.user
    usersSocketIds.set(user._id.toString(),socket.id)
    
    
    socket.on(NEW_MESSAGE,async ({chatId,members,message})=>{
        if (!message || !message.trim()) return; 

        const messageForRealTime={
            content:message,
            _id:uuid(),
            sender:{
                _id:user._id,
                name:user.name
            },
            chat:chatId,
            createdAt:new Date().toISOString()
        }

        const messageForDB={
            content:message,
            sender:user._id,
            chat:chatId
        }
        const membersSocket=usersSockets(members)

        io.to(membersSocket).emit(NEW_MESSAGE, {
            chatId,
            message: messageForRealTime,
          });

        io.to(membersSocket).emit(NEW_MESSAGE_ALERT,{chatId})

        try{
            await Message.create(messageForDB)
        }
        catch(error)
        {
            throw new Error(error);
        }

    })

    socket.on(START_TYPING,({chatId,members})=>{
        const membersSocket=usersSockets(members)

        socket.to(membersSocket).emit(START_TYPING,{
            chatId
        })
    })

    socket.on(STOP_TYPING,({chatId,members})=>{
        const membersSocket=usersSockets(members)

        socket.to(membersSocket).emit(STOP_TYPING,{
            chatId
        })
    })

    socket.on("disconnect",()=>{
        console.log("user disconnected",socket.id)
        usersSocketIds.delete(user._id.toString())
    })
})

app.use(errorMiddleware)

server.listen(port,()=>
    {
        console.log("connected",3000);
    })

export { usersSocketIds };

