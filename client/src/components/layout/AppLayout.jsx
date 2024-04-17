import React from 'react'
import Header from './Header'
import Title from '../shared/Title'
import { Grid, NativeSelect, Typography } from '@mui/material'
import NavigationPanel from './NavigationPanel'
import ChatList from '../specific/ChatList'
import { sampleChats } from '../../constants/sampleChats'
import { useParams } from 'react-router-dom'
// Higher order components
const AppLayout = ()=>(WrapperComponent) =>{


  const handleDeleteChat=(e,_id,groupChat)=>{
    e.preventDefault();
    console.log("deleteChat: ",_id,groupChat)
  }
 
  

  return(props)=>{ 
    const params=useParams();
    const chatId=params.chatId;
    return (
        <>
        <Title />
          <Header/>
          <Grid container height={"calc(100vh-4rem"}>
            <Grid item xs={3}
             sx={{
              display:{xs:"none",sm:"block"} }}
              height={"100%"} >
              <NavigationPanel/>
            </Grid>
            <Grid item xs={6} 
            sx={{display:{xs:"block"} }} 
            height={"100%"} >
              <WrapperComponent {...props}/>
            </Grid>
            <Grid item xs={3} 
            sx={{display:{xs:"none",sm:"block"} }} 
            height={"100%"} >
              <ChatList chats={sampleChats} chatId={chatId} handleDeleteChat={handleDeleteChat}/>
            </Grid>
          </Grid>
        </>
      )
  }
}

export default AppLayout
