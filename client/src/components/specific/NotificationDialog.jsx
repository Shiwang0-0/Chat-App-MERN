import { Dialog, DialogTitle,Stack, Typography,Avatar,List,ListItem, IconButton } from '@mui/material'
import React, { memo } from 'react'
import { sampleNotifications } from '../../constants/sampleChats';
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';

const NotificationDialog = () => {

  const handleFriendRequest=({_id,isAccepted})=>{
    isAccepted?(console.log(`${_id} accepted friend req`)):(console.log(`${_id} rejected friend req`))
  }

  return (
    <Dialog open>
        <Stack padding= "1rem">
          <DialogTitle textAlign="center">Notifications</DialogTitle>
          {
            sampleNotifications.length>0?(
              <List>
              {
              sampleNotifications.map((i)=>(
              <NotificationItem notification={i} key={i._id} handler={handleFriendRequest} />  
              ))
              }
            </List>      
            ):
            (
              <Typography>you have 0 notifications</Typography>
            )
          }
          
        </Stack>
      </Dialog>
  )
}

const NotificationItem=memo(({notification,handler})=>{
  const {sender,_id}=notification;

  const {name,avatar}=sender;
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
            <IconButton onClick={()=>handler({_id,isAccepted:true})}>
              <DoneIcon /> 
            </IconButton> 
            <IconButton onClick={()=>handler({_id,isAccepted:false})}>
              <CancelIcon />
            </IconButton>
              
             
        </Stack>
    </ListItem>
  )

})

export default NotificationDialog
