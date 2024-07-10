import { Typography, Stack, Box} from '@mui/material'
import React from 'react'
import AvatarCard from '../shared/AvatarCard'

const ChatHeader=({group,chatId})=>{

    const {name,avatar,_id}=group;
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
