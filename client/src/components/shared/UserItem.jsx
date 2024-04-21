import AddIcon from '@mui/icons-material/Add';
import PersonRemove from '@mui/icons-material/PersonRemove';
import { Avatar, IconButton, ListItem, Stack, Typography } from '@mui/material';
import React, { memo } from 'react';

const UserItem = ({users,handler,handlerLoading,isAdded=false}) => {

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
            }}>{name}</Typography>
            <IconButton onClick={()=>{handler(_id)}} disabled={handlerLoading}>
              {
                isAdded?<PersonRemove/>:<AddIcon/>
              }
                
            </IconButton>   
        </Stack>
    </ListItem>
  )
}

export default memo(UserItem)
