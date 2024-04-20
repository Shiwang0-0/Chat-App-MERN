import { Avatar, IconButton, Typography,Stack,ListItem } from '@mui/material'
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import { memo } from 'react';

const UserItem = ({users,handler,handlerLoading}) => {

    if(!users)
      return null;

    const { name,_id,avatar } = users;
    
  return (
    <ListItem >
        <Stack direction="row" width="100%">
            <Avatar src={avatar}/>
            <Typography sx={{
              display:"-webkit-box",
              WebkitLineClamp:1,
              WebkitBoxOrient:"vertical",
              overflow:"hidden",
              textOverflow:"ellipsis",
              width:"100%",
              justifyItems:"center",
              ml:"8px",
              mt:"6px"
            }}fullWidth>{name}</Typography>
            <IconButton onClick={()=>{handler(_id)}} disabled={handlerLoading}>
                <AddIcon/>
            </IconButton>   
        </Stack>
    </ListItem>
  )
}

export default memo(UserItem)
