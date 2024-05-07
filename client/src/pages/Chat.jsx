import AttachmentIcon from '@mui/icons-material/Attachment';
import SendIcon from '@mui/icons-material/Send';
import { Stack } from '@mui/material';
import { orange } from '@mui/material/colors';
import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import MessageComponent from '../components/shared/MessageComponent';
import { InputBox } from '../components/styles/StyledComponent';
import { sampleMsg } from '../constants/sampleChats';

const user={
  _id:"sdfsdf",
  name:"dfsdfasd"
}

export const Chat = () => {
  return (
    <>
    <Stack height="93%" sx={{ backgroundColor:'#ff1744', overflowX:"hidden", overflowY:"auto"}}>
    {sampleMsg.map((message)=>(
        <MessageComponent message={message} user={user} key={message._id}/>
    ))}
    </Stack>
    <form style={{height:"5%"}}>
      <Stack direction="row" sx={{height:"100%"}} position="relative">
        <AttachmentIcon/>
        <InputBox placeholder="chat"/>



        <SendIcon/>
      </Stack>
    </form>
    
    </>
  )
}

export default AppLayout()(Chat)  
