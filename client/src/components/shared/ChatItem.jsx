import React from 'react'
import { Typography,Stack,Box } from '@mui/material'
import { memo } from 'react'
import { royalBlue,random2,random3 } from '../../constants/colors'
import { StyledLink } from '../styles/StyledComponent'
import AvatarCard from './AvatarCard'
import { transformImage } from '../../lib/fileFormat'

const ChatItem = (
  {avatar=[],
  name,
  _id,
  groupChat=false,
  sameSender,
  isOnline,
  newMessageAlert,
  index=0,
  handleDeleteChat}
) => {
  return (
    <StyledLink to={`/chat/${_id}`} onContextMenu={(e)=>handleDeleteChat(e,_id,groupChat)}> 
      <div style={{
        height:"3rem",
        gap:"1rem",
        display:"flex",
        position:"relative",
        alignItems:"center", 
        justifyContent:"flex-start",
        backgroundColor:sameSender? random2 : "unset",
        color:sameSender? "unset" : random2 ,
      }}>

      <AvatarCard avatar={transformImage(avatar)}/>
      <Stack >
      <Typography ml="0.5rem" >{name}</Typography>
    {newMessageAlert && (
    <Typography>You have {newMessageAlert.count} new messages</Typography>
    )}
    </Stack>

      {
        isOnline && (<Box sx={{
          width:"10px",
          height:"10px",
          borderRadius:"50%",
          backgroundColor:"green"
        }}/>
     )}

      </div>
    </StyledLink>
  )
}

export default memo(ChatItem)

