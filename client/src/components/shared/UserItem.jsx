import AddIcon from '@mui/icons-material/Add';
import PersonRemove from '@mui/icons-material/PersonRemove';
import { Avatar, IconButton, ListItem, Stack, Typography } from '@mui/material';
import React, { memo } from 'react';
import { transformImage } from '../../lib/fileFormat';
const UserItem = ({ users, handler, handlerLoading, isAdded = false }) => {
  if (!users)
    return null;

  const { name, _id, avatar } = users;
  console.log(users)

  return (
    <ListItem sx={{boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)", padding: "0.5rem 1.5rem", borderRadius: "1rem",bgcolor:"#2a6f97",color:"white"}}>
      <Stack direction="row" width="100%">
        <Avatar src={transformImage([avatar])} />
        <Typography sx={{
          display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis", width: "100%", justifyItems: "center", ml: "8px", mt: "6px"
        }}>
          {name}
        </Typography>
        <IconButton sx={{color:"white"}}onClick={() => { handler(_id) }} disabled={handlerLoading}>
          {
            isAdded ? <PersonRemove /> : <AddIcon />
          }

        </IconButton>
      </Stack>
    </ListItem>
  )
}

export default memo(UserItem)
