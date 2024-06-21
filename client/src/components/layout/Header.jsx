import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { AppBar, Backdrop, Box, Tooltip, Typography } from '@mui/material';
import React, { Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { royalBlue } from '../../constants/colors';
import { setIsMobile, setIsSearch } from '../../redux/reducers/others.';
const SearchDialog = lazy(()=>import("../specific/SearchDialog"));

const Header = () => {
  const dispatch=useDispatch();
  const {isSearch}=useSelector(state=>state.misc)

  const searchDialog=()=>{
    console.log("search");
    dispatch(setIsSearch(true));
}

  const handleMobile=()=>{
    dispatch(setIsMobile(true));
  }
  return (
    <>
      <Box sx={{flexGrow:1 }}>
        <AppBar position='static' sx={{ bgcolor: royalBlue, height: '3rem' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center',height:"100%"}}>
            <Typography sx={{ textAlign: 'center', flex: 1 }}>
              Chatting Application
            </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center',justifyContent:"center" }}>
              <Tooltip title="Search">
                <SearchIcon sx={{marginRight:"20px"}} onClick={searchDialog}/>
              </Tooltip>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center',justifyContent:"center",  display: { xs: "block", sm: "none" }, }}>
              <Tooltip title="Chats">
                <MenuIcon sx={{marginRight:'20px'}} onClick={handleMobile}/>
              </Tooltip>
          </Box>
          </Box>
        </AppBar>
      </Box>

    {isSearch && (
        <Suspense fallback={<Backdrop open/>}>  
            <SearchDialog/>
        </Suspense>
    )}

    </>
  )
}

export default Header
