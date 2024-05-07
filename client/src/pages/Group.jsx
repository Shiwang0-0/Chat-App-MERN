import React, { useState } from 'react';
// import GroupNavigation from '../components/specific/GroupNavigation';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, Drawer, Grid, IconButton, Stack, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import AvatarCard from '../components/shared/AvatarCard';
import { StyledLink } from '../components/styles/StyledComponent';
import { sampleChats } from '../constants/sampleChats';
import {Chat} from './Chat';
import ChatHeader from '../components/specific/ChatHeader';
const Group = () => {

  const user={
    _id:"sdfsdf",
    name:"dfsdfasd"
  }
    const chatId=useSearchParams()[0].get("group");
    const [isMobileMenuOpen,setIsMobileMenuOpen]=useState(false);
    const handleMobile=()=>{
        setIsMobileMenuOpen((prev)=>!prev);
    }
  
    const handleMobileClose=()=>{
        setIsMobileMenuOpen(false);
    }

  return (
    <>
      <Grid container height={"calc(100vh - 4rem)"} sx={{backgroundColor:"red"}}>
        
            <Box sx={{ display:{xs:"block", sm:"none", position:"fixed", top:"1rem", right:"1rem"} }}>
              <IconButton onClick={handleMobile}>
                <MenuIcon/>
              </IconButton>
            </Box>
            <Grid item xs={2}
             sx={{
              display:{xs:"none",sm:"block"},backgroundColor:"green"}}
              height="100%" width="5rem" >
                  <GroupList group={sampleChats} chatId={chatId}/>
            </Grid>
            {
              chatId?(
                <Grid item xs={10} 
            sx={{display:{xs:"none",sm:"block"},backgroundColor:"blue" }} 
            height="100%">
              <ChatHeader group={sampleChats} chatId={chatId}/>
              <Chat/>
            </Grid>
              ):
              <Box sx={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                <Typography >---- CHAT WITH OTHERS, FORM A GROUP ----</Typography>
              </Box>
            } 
            <Drawer PaperProps={{ sx: { width: "40%" },}} sx={{display:{xs:"block",sm:"none"}}} 
            open={isMobileMenuOpen} onClose={handleMobileClose}>
             <GroupList group={sampleChats} chatId={chatId}/>
            </Drawer>
      </Grid>
    </>
  )
} 


const GroupList=({group,chatId})=>(
  <Stack spacing={2}>
    {group.length>0 ? (
      group.map((i,index)=>(
        <GroupListItem item={i} chatId={chatId} key={index}/>
      ))
    ):
    (
      <Typography>no groups</Typography>
    )}
  </Stack>
)

const GroupListItem=({item,chatId})=>{
  const {name,_id,avatar}=item;
  return (
    <StyledLink to={`?group=${_id}`} onClick={(e)=>{if(chatId===_id) e.preventDefault()}}>
      <Stack direction="row" >
      <AvatarCard avatar={avatar}/>
      <Typography>{name}</Typography>
    </Stack>
    </StyledLink>
  )
  
}


export default Group
