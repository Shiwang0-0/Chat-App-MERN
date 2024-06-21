import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupsIcon from '@mui/icons-material/Groups';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SearchIcon from '@mui/icons-material/Search';
import { Backdrop } from '@mui/material';
import { Box } from '@mui/system';
import React, { Suspense, lazy, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { royalBlue } from '../../constants/colors';
import { NavigationBars } from '../shared/NavigationBars';
import { useDispatch, useSelector } from 'react-redux';
import { setIsNotification } from '../../redux/reducers/others.';

const SearchDialog = lazy(()=>import("../specific/SearchDialog"));
const NotificationDialog=lazy(()=>import("../specific/NotificationDialog"));
const NewGroupDialog=lazy(()=>import("../specific/NewGroupDialog"))

const NavigationPanel = () => {

    const navigate=useNavigate();

    const [isMobile,setIsMobile]=useState(false);
    const [isSearch,setIsSearch]=useState(false);
    const [isNewGroup,setIsNewGroup]=useState(false);

    const dispatch=useDispatch();
    const {isNotification}=useSelector(state=>state.misc)

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
        dispatch(setIsNotification(true))
    }
    const navigateToGroups=()=>{    
        navigate("/group")
    }
    const createGroup=()=>{
        console.log("create group");
        setIsNewGroup((prev)=>!prev);
    }
    const navigateToProfile=()=>{    
        navigate("/profile")
    }

  return (
    <>
    <Box sx={{ bgcolor: royalBlue, height: '90vh', display:"flex", flexDirection:"column", alignItems:"center", mt:"10px",ml:"5px",mr:"5px", overflow:"none"}} >

        <NavigationBars title={"Home"} icon={<HomeIcon/>} onClickfunc={navigateToHome}/>
        <NavigationBars title={"Search"} icon={<SearchIcon/>} onClickfunc={searchDialog}/>
        <NavigationBars title={"Notifications"} icon={<NotificationsNoneIcon/>} onClickfunc={openNotifications}/>
        <NavigationBars title={"Groups"} icon={<GroupsIcon/>} onClickfunc={navigateToGroups}/>
        <NavigationBars title={"Create Group"} icon={<GroupAddIcon/>} onClickfunc={createGroup}/>
        <NavigationBars title={"Profile"} icon={<AccountCircleIcon/>} onClickfunc={navigateToProfile}/>
    </Box>

    {isSearch && (
        <Suspense fallback={<Backdrop open/>}>
            <SearchDialog/>
        </Suspense>
    )}
    {isNotification && (
        <Suspense fallback={<Backdrop open/>}>
            <NotificationDialog/>
        </Suspense>
    )}
    {isNewGroup && (
        <Suspense fallback={<Backdrop open/>}>
            <NewGroupDialog/>
        </Suspense>
    )}

    </>
  )
}



export default NavigationPanel
