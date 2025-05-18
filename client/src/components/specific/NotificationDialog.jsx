import CancelIcon from '@mui/icons-material/Cancel';
import DoneIcon from '@mui/icons-material/Done';
import { Avatar, Dialog, DialogTitle, IconButton, List, ListItem, Skeleton, Stack, Typography } from '@mui/material';
import React, { memo } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../../redux/api/api';
import { setIsNotification } from '../../redux/reducers/others';

const NotificationDialog = () => {

  const dispatch=useDispatch();
  const {isNotification}=useSelector((state)=>state.misc)
  const [acceptRequest]=useAcceptFriendRequestMutation();

  const {isLoading,isError,error,data}=useGetNotificationsQuery()

  const handleFriendRequest=async ({_id,accept})=>{
    dispatch(setIsNotification(false));

    try{
      const res=await acceptRequest({requestId:_id,accept});
      if(res.data?.success)
      {
          console.log("use sockets here")
          toast.success(res.data.message)
      }
      else{
        toast.error(res.data?.error || "Friend Request Rejected")
      }
    }
    catch(error)
    {
      toast.error("Something went wrong")
    }
  }

  const handleClose=()=>{
   dispatch(setIsNotification(false))
  }

  return (
    <Dialog open={isNotification} onClose={handleClose}>
        <Stack padding= "1rem">
          <DialogTitle textAlign="center">Notifications</DialogTitle>
          {isLoading?<Skeleton/>
          :
          <>{
            
            data?.allRequests?.length>0?(
               <List>
               {
               data?.allRequests?.map((i)=>(
               <NotificationItem notification={i} key={i._id} _id={i._id} handler={handleFriendRequest} />  
               ))
               }
             </List>      
             ):
             (
               <Typography>you have 0 notifications</Typography>
             )
           }</>
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
            <IconButton onClick={()=>{
              handler({_id,accept:true})
              }}>
              <DoneIcon /> 
            </IconButton> 
            <IconButton onClick={()=>handler({_id,accept:false})}>
              <CancelIcon />
            </IconButton>
              
             
        </Stack>
    </ListItem>
  )

})

export default NotificationDialog
