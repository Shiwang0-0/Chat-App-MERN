import { Typography, Stack, Box} from '@mui/material'
import React from 'react'
import AvatarCard from '../shared/AvatarCard'

// probably need to make a group sample chat where the groupname, chats are allocated with respect to the user  ( when the user created the group)

const ChatHeader=({group,chatId})=>{

    const {name,avatar,_id}=group;
    console.log(chatId)
    return (
       <>
        {group.length>0 ? (
        <Box sx={{height:"4rem"}}>
        <AvatarCard avatar={avatar}/>
            <Stack direction="row">
                <Typography>{name}</Typography>
            </Stack>
        </Box>
          ):
          (
            <Typography>no groups</Typography>
          )}</>
    )
    
  }

export default ChatHeader
