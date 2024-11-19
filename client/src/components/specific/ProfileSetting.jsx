import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
import BlockIcon from '@mui/icons-material/Block';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import { Box } from '@mui/material';
import axios from 'axios';
import React from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { royalBlue } from '../../constants/colors';
import { server } from '../../constants/configServer';
import { userNotExist } from '../../redux/reducers/auth';
import { NavigationBars } from '../shared/NavigationBars';
import { bgColorPanel } from '../../constants/colors';
const ProfileSetting = () => {

  const dispatch=useDispatch();

  const navigateToHome=()=>{
        navigate("/");
    }

    const logout=async()=>{
      try{
        const {data}=await axios.get(`${server}/api/v1/user/logout`,{
          withCredentials:true,
        });
        dispatch(userNotExist())
        toast.success(data.message)
      }
      catch(error){
        toast.error(error?.response?.data?.message || "Something went wrong")
      }
    }

  return (
    <div>
      <Box sx={{ bgcolor:bgColorPanel, height: '90vh', display: "flex", flexDirection: "column", alignItems: "center", mt: "10px", ml: "5px", mr: "5px", overflow: "none",borderRadius:"20px 20px 20px 20px" }} >
      <NavigationBars title={"Logout"} icon={<LogoutIcon/>} onClickfunc={logout}/>
      </Box>
    </div>
  )
}

export default ProfileSetting
