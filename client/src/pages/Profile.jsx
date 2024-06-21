import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmailIcon from '@mui/icons-material/Email';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import { random } from '../constants/colors';
import { transformImage } from '../lib/fileFormat';
const Profile = ({user}) => {
  
  return (
    <>
    <Box sx={{ display:"flex",flexDirection:"column",alignItems:"center",mt:"50px", height:"450px", widht:"100%",backgroundColor:random}}>
        <Avatar src={transformImage(user?.avatar?.url)} sx={{height:"150px", width:"150px", objectFit:"contain",mt:"10px"}} />
        <ProfileCard heading="bio" text={user?.bio || ""} icon={<TextSnippetIcon/>} />
        <ProfileCard heading="username" text={user?.username} icon={<AssignmentIndIcon/>} />
        <ProfileCard heading="email" text={user?.email} icon={<EmailIcon/>} />
        <ProfileCard heading="joined" text={moment(user?.createdAt).fromNow()} icon={<CalendarMonthIcon/>} />
    </Box> 
    </> 
  )
}

const ProfileCard=({heading,text,icon})=>{
  return(
    <Box sx={{ display: "flex", alignItems: "center" ,border:"2px solid red"}}>
      {icon && <Box sx={{ marginRight: "0.3rem" }}>{icon}</Box>}
      <Stack textAlign="center" mt="0.8rem">
        <Typography sx={{ color: "black" }}>{text}</Typography>
        <Typography sx={{ color: "black" }}>{heading}</Typography>
      </Stack>
    </Box>
  )

}

export default AppLayout()(Profile)
