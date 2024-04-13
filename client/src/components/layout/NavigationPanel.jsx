import React, { Suspense, useState, lazy } from 'react'
import { Box } from '@mui/system'
import { royalBlue,random } from '../../constants/colors'
import {IconButton, Typography,TextField } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import GroupsIcon from '@mui/icons-material/Groups';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import {useNavigate } from 'react-router-dom';

const SearchDialog = lazy(()=>import("../specific/SearchDialog"));
const NotificationDialog=lazy(()=>import("../specific/NotificationDialog"));
const NewGroupDialog=lazy(()=>import("../specific/NewGroupDialog"))

const NavigationPanel = () => {

    const navigate=useNavigate();

    const [isMobile,setIsMobile]=useState(false);
    const [isSearch,setIsSearch]=useState(false);
    const [isNewGroup,setIsNewGroup]=useState(false);
    const [isNotification,setIsNotification]=useState(false);

    const handleMobile=()=>{
        setIsMobile((prev)=>!prev);
    }

    const navigateToHome=()=>{
        console.log("home");
        navigate("/");
    }
    const searchDialog=()=>{
        console.log("search");
        setIsSearch((prev)=>!prev);
    }
    const openNotifications=()=>{
        console.log("notification")
        setIsNotification((prev)=>!prev);
    }
    const navigateToGroups=()=>{    
        navigate("/group")
    }
    const createGroup=()=>{
        console.log("create group");
        setIsNewGroup((prev)=>!prev);
    }
    const viewProfile=()=>{
        console.log("profile");

    }

  return (
    <>
    <Box sx={{ bgcolor: royalBlue, height: '90vh', display:"flex", flexDirection:"column", alignItems:"center", mt:"10px",ml:"5px", overflow:"none"}} >

        <NavigationBars title={"Home"} icon={<HomeIcon/>} onClickfunc={navigateToHome}/>
        <NavigationBars title={"Search"} icon={<SearchIcon/>} onClickfunc={searchDialog}/>
        <NavigationBars title={"Notifications"} icon={<NotificationsNoneIcon/>} onClickfunc={openNotifications}/>
        <NavigationBars title={"Groups"} icon={<GroupsIcon/>} onClickfunc={navigateToGroups}/>
        <NavigationBars title={"Create Group"} icon={<GroupAddIcon/>} onClickfunc={createGroup}/>
        <NavigationBars title={"Profile"} icon={<AccountCircleIcon/>} onClickfunc={viewProfile}/>
    </Box>

    {isSearch && (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchDialog/>
        </Suspense>
    )}
    {isNotification && (
        <Suspense fallback={<div>Loading...</div>}>
            <NotificationDialog/>
        </Suspense>
    )}
    {isNewGroup && (
        <Suspense fallback={<div>Loading...</div>}>
            <NewGroupDialog/>
        </Suspense>
    )}

    </>
  )
}

const NavigationBars=({title,icon,onClickfunc})=>{
   return (
    <Box sx={{mt:"15px",bgcolor:random,borderRadius:"6px",width:"70%",height:"40px",display: 'flex', alignItems: 'center', justifyContent: 'center'}} >
    <IconButton onClick={onClickfunc}>
        {icon}
    </IconButton>
    <Typography sx={{textAlign: 'center'}} >
        {title}
    </Typography>   
    </Box>
   )
}

export default NavigationPanel
