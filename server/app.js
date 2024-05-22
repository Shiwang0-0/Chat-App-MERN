import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { createServer } from 'http';
import { Server } from "socket.io";
import { errorMiddleware } from "./middlewares/error.js";
import { Message } from "./models/message.js";
import { connectDB } from "./utils/database.js";

import { randomUUID } from "crypto";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/events.js";
import { usersSockets } from "./lib/helper.js";
import chatRoute from "./routes/chat.js";
import userRoute from "./routes/user.js";


const app=express();
const server=createServer(app);
const io=new Server(server,{});

dotenv.config({
    path:"./.env"
});

const uri=process.env.MONGO_URI;
const port=process.env.PORT || 3000;
const usersSocketIds=new Map();

connectDB(uri);


app.use(express.json());
app.use(cookieParser());

app.use("/user",userRoute);
app.use("/chat",chatRoute);

app.get("/",(req,res)=>{
    res.send("Welcome to Home")
})

const user={
    _id:"sdfsd",
    name:"sdfaf"
}

io.on("connection",(socket)=>{
    

    usersSocketIds.set(user._id.toString(),socket.id.toString())
    
    console.log(usersSocketIds)
    
    socket.on(NEW_MESSAGE,async ({members,message,chatId})=>{
       

        const messageForRealTime={
            content:message,
            _id:randomUUID(),
            sender:{
                _id:user._id,
                name:user.name
            },
            chat:chatId,
            createdAt:new Date().toISOString()
        }
        console.log("new message",messageForRealTime)

        const messageForDB={
            content:message,
            sender:user._id,
            chat:chatId
        }
        
        const membersSocket=usersSockets(members)

        io.to(membersSocket).emit(NEW_MESSAGE,{
            chatId,
            message:messageForRealTime
        })
        io.to(membersSocket).emit(NEW_MESSAGE_ALERT,{chatId})

        await Message.create(messageForDB)

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
