import { Drawer, Grid, Skeleton } from '@mui/material'
import React, { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { NEW_MESSAGE_ALERT, NEW_REQUEST, REFETCH_CHATS } from '../../constants/events'
import { useErrors } from '../../hooks/ErrorHook'
import { useSocketEvents } from '../../hooks/SocketEvents'
import { getOrSaveFromStorage } from '../../lib/localStorage'
import { useMyChatsQuery } from '../../redux/api/api'
import { incrementNotification, setNewMessagesAlert } from '../../redux/reducers/chat'
import { setIsDeleteMenu, setIsMobile, setSelectedDeleteChat } from '../../redux/reducers/others.'
import { getSocket } from '../../socket'
import Title from '../shared/Title'
import ChatList from '../specific/ChatList'
import DeleteChatMenu from '../specific/DeleteChatMenu'
import ProfileSetting from '../specific/ProfileSetting'
import Header from './Header'
import NavigationPanel from './NavigationPanel'
import { bgColorHome } from '../../constants/colors'

// Higher order components
const AppLayout = () => (WrapperComponent) => {

  return (props) => {

    const dispatch = useDispatch();
    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();
    const deleteAnchor = useRef(null)

    const isProfilePage = location.pathname === '/profile'
    
    const chatId = params.chatId;
    const socket = getSocket();
    
    const { user } = useSelector((state) => state.auth)
    const { isMobile } = useSelector((state) => state.misc)
    const { newMessagesAlert } = useSelector((state) => state.chat)
    const { isLoading, isError, data, error, refetch } = useMyChatsQuery("");

    console.log("app",user)


    const handleMobileClose = () => {
      dispatch(setIsMobile(false))
    }

    const newMessageAlertListener = useCallback((data) => {
      if (data.chatId === chatId) return;
      dispatch(setNewMessagesAlert(data))
    }, [chatId])

    const newRequestListener = useCallback(() => {
      dispatch(incrementNotification())
    }, [dispatch])

    
    const handleDeleteChat = (e, chatId, groupChat) => {
      dispatch(setIsDeleteMenu(true))
      dispatch(setSelectedDeleteChat({ chatId, groupChat }))
      deleteAnchor.current = e.currentTarget;
    }

    useErrors([{ isError, error }])

    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert, isGet: false })
    }, [newMessagesAlert])
    
    const refetchListener = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch, navigate]);


    const socketEvents = {
      [NEW_MESSAGE_ALERT]: newMessageAlertListener,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]: refetchListener
    }
    useSocketEvents(socket, socketEvents)


    return (
      <div style={{
        backgroundImage: bgColorHome,
        backgroundSize: 'cover', // Ensure the image covers the entire screen
        height:"100vh"
      }}>
        <Title />
        <Header />

        <DeleteChatMenu dispatch={dispatch} deleteAnchor={deleteAnchor} />

        {isLoading ? <Skeleton />
          :
          <Drawer open={isMobile} onClose={handleMobileClose}>
            <ChatList w="70vw" chats={data?.chats} chatId={chatId} handleDeleteChat={handleDeleteChat} />
          </Drawer>
        }
        <Grid container height={"calc(100vh - 4rem)"} >
          <Grid item xs={2.5}
            sx={{
              display: { xs: "none", sm: "block" }
            }}
            height="100%" >
            <NavigationPanel />
          </Grid>
          <Grid item xs={7} style={{ height: '100%' }}
            sx={{ display: { xs: "block" } }}
          >
            <WrapperComponent {...props} chatId={chatId} user={user} />
          </Grid>
          <Grid item xs={2.5}
            sx={{ display: { xs: "none", sm: "block" } }}
            height="100%" >
            {isProfilePage ? <ProfileSetting /> :
              (isLoading ?
                <Skeleton variant="rectangular" height="3rem" />
                :
                <ChatList chats={data?.chats} chatId={chatId} handleDeleteChat={handleDeleteChat} newMessagesAlert={newMessagesAlert} />
              )
            }
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default AppLayout
