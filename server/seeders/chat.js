import { tryCatch } from "../middlewares/error.js";
import { User } from "../models/user.js";
import {faker, simpleFaker} from "@faker-js/faker"
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";


const createSingleChat=tryCatch(async()=>{
        const users= await User.find().select("_id");

        const chatPromise=[];
                for(let i=0;i<users.length;i++)
                    {
                        for(let j=i+1;j<users.length;j++)
                            {
                                chatPromise.push(Chat.create({
                                    name:faker.lorem.words(2),
                                    members:[users[i],users[j]]
                                }))
                            }
                    }
        await Promise.all(chatPromise);
        console.log("chat created successfully");
        process.exit(1);
})



const createGroupChat=tryCatch(async(chatsCount)=>{
        const users= await User.find().select("_id");

        const chatPromise=[];
        for(let i=0;i<chatsCount;i++)
            {
               const numMembers=simpleFaker.number.int({min:2,max:users.length});
               const members=[];

               for(let j=0;j<numMembers;j++)
                {
                    const randomIdx=Math.floor(Math.random()*users.length);
                    const randomUser=users[randomIdx];

                    if(!members.includes(randomUser)){
                        members.push(randomUser);
                    }
                }
                const chat=Chat.create({
                    groupChat:true,
                    name:faker.lorem.words(1),
                    members,
                    creator:members[0]
                })
                chatPromise.push(chat);
            }
        await Promise.all(chatPromise);
        console.log("chat created successfully");
        process.exit(1);
})   


const createMessage=tryCatch(async (numMessages)=>{
        const users= await User.find().select("_id");
        const chats= await User.find().select("_id");

        const messagePromise=[];
        for(let i=0;i<numMessages;i++)
            {
                const randomUser=users[Math.floor(Math.random()*users.length)];
                const randomChat=chats[Math.floor(Math.random()*chats.length)];

                messagePromise.push(
                    Message.create({
                        chat:randomChat,
                        sender:randomUser,
                        content:faker.lorem.sentence()
                    })
                )
            }
        await Promise.all(messagePromise);
        console.log("message created successfully");
        process.exit(1);
})


const createMessageInChat=tryCatch(async (chatId,numMessages)=>{
        const users= await User.find().select("_id");

        const messagePromise=[];
        for(let i=0;i<numMessages;i++)
            {
                const randomUser=users[Math.floor(Math.random()*users.length)];

                messagePromise.push(
                    Message.create({
                        chat:chatId,
                        sender:randomUser,
                        content:faker.lorem.sentence()
                    })
                )
            }
        await Promise.all(messagePromise);
        console.log("message created successfully");
        process.exit(1);
})


export {createSingleChat, createGroupChat, createMessage, createMessageInChat}