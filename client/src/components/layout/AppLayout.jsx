import { Drawer, Grid, Skeleton } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import { useErrors } from '../../hooks/ErrorHook'
import { useMyChatsQuery } from '../../redux/api/api'
import { setIsMobile } from '../../redux/reducers/others.'
import Title from '../shared/Title'
import ChatList from '../specific/ChatList'
import ProfileSetting from '../specific/ProfileSetting'
import Header from './Header'
import NavigationPanel from './NavigationPanel'

// Higher order components
const AppLayout = ()=>(WrapperComponent) =>{

  return(props)=>{ 

    const dispatch=useDispatch();
    const location=useLocation();
    const isProfilePage=location.pathname==='/profile'
    const params=useParams();
    const chatId=params.chatId;

    const {isMobile}=useSelector((state)=>state.misc)

    const {isLoading,isError,data,error,refetch}=useMyChatsQuery("");

    useErrors([{isError,error}])

    const handleMobileClose=()=>{
      dispatch(setIsMobile(false))
    }
    
    const handleDeleteChat=(e,_id,groupChat)=>{
      e.preventDefault();
      console.log("deleteChat: ",_id,groupChat)
    }
 
    return (
        <>
        <Title />
          <Header/>
          
          {isLoading?<Skeleton/>
            :
          <Drawer open={isMobile} onClose={handleMobileClose}>
            <ChatList w="70vw" chats={data.chats} chatId={chatId} handleDeleteChat={handleDeleteChat}/>
          </Drawer>
          }
          {console.log(isMobile)}
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
               (isLoading?
                <Skeleton variant="rectangular" height="3rem"/>
                :
                <ChatList chats={data.chats} chatId={chatId} handleDeleteChat={handleDeleteChat}/>)
               }
            </Grid>
          </Grid>
        </>
      )
  }
}

export default AppLayout
