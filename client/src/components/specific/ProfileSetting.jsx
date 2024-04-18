import React from 'react'
import { Box } from '@mui/material'
import { royalBlue } from '../../constants/colors'
import { NavigationBars } from '../shared/NavigationBars';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
import BlockIcon from '@mui/icons-material/Block';
import EditIcon from '@mui/icons-material/Edit';
const ProfileSetting = () => {

    const navigateToHome=()=>{
        console.log("home");
        navigate("/");
    }

  return (
    <div>
      <Box sx={{ bgcolor: royalBlue, height: '90vh', display:"flex", flexDirection:"column", alignItems:"center", mt:"10px",ml:"5px",mr:"5px", overflow:"none"}} >
      <NavigationBars title={"Edit Profile"} icon={<EditIcon/>} onClickfunc={navigateToHome}/>
      <NavigationBars title={"Add an Exisiting Account"} icon={<SupervisedUserCircleIcon/>} onClickfunc={navigateToHome}/>
      <NavigationBars title={"Deactivate account"} icon={<AutoDeleteIcon/>} onClickfunc={navigateToHome}/>
      <NavigationBars title={"Blocked users"} icon={<BlockIcon/>} onClickfunc={navigateToHome}/>
      </Box>
    </div>
  )
}

export default ProfileSetting
