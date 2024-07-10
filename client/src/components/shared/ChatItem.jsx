import { Avatar, Box, Stack, Typography } from '@mui/material'
import React, { memo } from 'react'
import { random2 } from '../../constants/colors'
import { transformImage } from '../../lib/fileFormat'
import { StyledLink } from '../styles/StyledComponent'

const ChatItem = ({ avatar=[], name, _id, groupChat, sameSender, isOnline, newMessageAlert, handleDeleteChat }) => {
  
  return (
    <StyledLink to={`/chat/${_id}`} onContextMenu={(e)=>handleDeleteChat(e,_id,groupChat)}> 
      <div style={{ height:"3rem", gap:"1rem", display:"flex", position:"relative", alignItems:"center",  justifyContent:"flex-start", backgroundColor:sameSender? random2 : "unset", color:sameSender? "unset" : random2 ,borderRadius:"20px 20px 20px 20px"
      }}> 
       <Avatar src={transformImage(avatar)} sx={{ transform: 'translateX(6px)'}}/>
      <Stack >
      <Typography ml="0.5rem" >{name}</Typography>
    {newMessageAlert && (
    <Typography>You have {newMessageAlert.count} new messages</Typography>
    )}
    </Stack>

      {
        isOnline && (<Box sx={{ width:"10px", height:"10px", borderRadius:"50%", backgroundColor:"green"
        }}/>
     )}
      </div>
    </StyledLink>
  )
}

export default memo(ChatItem)

