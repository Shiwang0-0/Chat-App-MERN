import AttachmentIcon from '@mui/icons-material/Attachment';
import SendIcon from '@mui/icons-material/Send';
import { Skeleton, Stack,Button, IconButton } from '@mui/material';
import React, { useCallback, useEffect, useState, memo, useRef } from 'react';
import { getSocket } from '../socket';
import AppLayout from '../components/layout/AppLayout';
import MessageComponent from '../components/shared/MessageComponent';
import { InputBox } from '../components/styles/StyledComponent';
import { NEW_MESSAGE } from '../constants/events';
import { useChatDetailsQuery, useGetMessageQuery } from '../redux/api/api';
import { useSocketEvents } from '../hooks/SocketEvents';
import { useSelector } from 'react-redux';
import { useErrors } from '../hooks/ErrorHook';
import { useInfiniteScrollTop } from "6pp"



const Chat = memo(({chatId}) => {

  const {user}=useSelector((state)=>state.auth)

  const ref=useRef(null);

  const socket=getSocket();
  const [message,setMessage]=useState("")
  const [messages,setMessages]=useState([])
  const [page,setPage]=useState(1)

  const chatDetails=useChatDetailsQuery({chatId,skip:!chatId})

  const oldMessageChunk=useGetMessageQuery({chatId,page});

  const members=chatDetails?.data?.chat?.members;  

  const {data:oldMessages,setData:setOldMessages}=useInfiniteScrollTop(
    ref,
    oldMessageChunk.data?.totalPages,
    page,
    setPage,
    oldMessageChunk.data?.message
  )

  const errors=[
    {isError:chatDetails.isError,error:chatDetails.error},
    {isError:oldMessageChunk.isError,error:oldMessageChunk.error}
  ]

  const messageOnChange=(e)=>{
    console.log("typing...",e.target.value)
    setMessage(e.target.value)
  }

  const newMessagesListener = useCallback(
    (data) => {
      console.log("New message received:", data);
      if (data.chatId !== chatId || !data.message) return;
      setMessages((prev) => [...prev, data.message]);
      
    },
    [chatId]
  );

  const submitHandler=(e)=>{
    e.preventDefault()

    if(!message.trim())
      return;

    socket.emit(NEW_MESSAGE,{chatId,members,message})
    setMessage("");
  }

  const socketEvents={[NEW_MESSAGE]:newMessagesListener}
  
  useSocketEvents(socket,socketEvents)

  useErrors(errors)

  const allMessages=[...oldMessages,...messages]

  console.log(allMessages)

  return (
    chatDetails.isLoading?<Skeleton/>
    :
    <>
    <Stack height="93%" sx={{ backgroundColor:'#ff1744', overflowX:"hidden", overflowY:"auto"}} ref={ref}>
      {console.log("sup budy",messages)}

      {allMessages.map((message)=>(
        message && <MessageComponent user={user} message={message} key={message._id}/>
      ))}

    </Stack>
    <form style={{height:"5%"}} onSubmit={submitHandler}>
      <Stack direction="row" sx={{height:"100%"}} position="relative">
        <AttachmentIcon/>
        <InputBox placeholder="chat" value={message} onChange={messageOnChange}/>
        <IconButton type="submit" style={{ background: 'none', border: 'none', padding: 0 }}>
          <SendIcon />
        </IconButton>
      </Stack>
    </form> 
    </>
  )
})

export default AppLayout()(Chat)  
