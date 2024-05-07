import React from 'react'
import Header from './Header'
import Title from '../shared/Title'
import { Grid, NativeSelect, Typography } from '@mui/material'
import NavigationPanel from './NavigationPanel'
import ChatList from '../specific/ChatList'
import { sampleChats } from '../../constants/sampleChats'
import { useLocation, useParams } from 'react-router-dom'
import ProfileSetting from '../specific/ProfileSetting'

// Higher order components
const AppLayout = ()=>(WrapperComponent) =>{

    

  const handleDeleteChat=(e,_id,groupChat)=>{
    e.preventDefault();
    console.log("deleteChat: ",_id,groupChat)
  }
 
  

  return(props)=>{ 
    const location=useLocation();
    const isProfilePage=location.pathname==='/profile'
    const params=useParams();
    const chatId=params.chatId;
    return (
        <>
        <Title />
          <Header/>
          <Grid container height={"calc(100vh - 4rem)"}>
            <Grid item xs={3}
             sx={{
              display:{xs:"none",sm:"block"} }}
              height="100%" >
              <NavigationPanel/>
            </Grid>
            <Grid item xs={6} style={{ height: '100%' }}
            sx={{display:{xs:"block"} ,backgroundColor:"blue"}} 
            >
              <WrapperComponent {...props}/>
            </Grid>
            <Grid item xs={3} 
            sx={{display:{xs:"none",sm:"block"} }} 
            height="100%" >
              {isProfilePage? <ProfileSetting/> :
               (<ChatList chats={sampleChats} chatId={chatId} handleDeleteChat={handleDeleteChat}/>)
               }
            </Grid>
          </Grid>
        </>
      )
  }
}

export default AppLayout
