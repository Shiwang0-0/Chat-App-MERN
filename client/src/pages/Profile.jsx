import React from 'react'
import AppLayout from '../components/layout/AppLayout'
import { Stack,Avatar ,Box, Typography} from '@mui/material'
import { random } from '../constants/colors'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import EmailIcon from '@mui/icons-material/Email';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import moment from 'moment'
const Profile = () => {
  return (
    <>
    <Box sx={{ display:"flex",flexDirection:"column",alignItems:"center",mt:"50px", height:"450px", widht:"100%",backgroundColor:random}}>
        <Avatar sx={{height:"150px", width:"150px", objectFit:"contain",mt:"10px"}} />
        <ProfileCard heading="bio" text="iam a kitty" icon={<TextSnippetIcon/>} />
        <ProfileCard heading="username" text="ChonkyCat" icon={<AssignmentIndIcon/>} />
        <ProfileCard heading="email" text="feedMe@kitty" icon={<EmailIcon/>} />
        <ProfileCard heading="joined" text={moment('2024-04-18T00:00:00.000Z').fromNow()} icon={<CalendarMonthIcon/>} />
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
