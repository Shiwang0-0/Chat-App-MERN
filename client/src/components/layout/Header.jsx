import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { AppBar, Backdrop, Box, Tooltip, Typography } from '@mui/material';
import React, { Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { royalBlue } from '../../constants/colors';
import { setIsMobile, setIsSearch } from '../../redux/reducers/others.';
import { bgcolorHeader } from '../../constants/colors';
const SearchDialog = lazy(() => import("../specific/SearchDialog"));

const Header = () => {

  const dispatch = useDispatch();

  const { isSearch, isNotification } = useSelector((state) => state.misc)

  const searchDialog = () => dispatch(setIsSearch(true));
  

  const handleMobile = () => dispatch(setIsMobile(true));


  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position='static'  sx={{ bgcolor: bgcolorHeader, height: '3rem', width:"95%", borderRadius:"0px 0px 15px 15px" , marginInline:"auto"}}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: "100%", }} >
            <Typography sx={{ textAlign: 'center', flex: 1, fontWeight:700}}>
              Chatting Application
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
              <Tooltip title="Search">
                <SearchIcon sx={{ marginRight: "20px" }} onClick={searchDialog} />
              </Tooltip>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "center", display: { xs: "block", sm: "none" }, }}>
              <Tooltip title="Chats">
                <MenuIcon sx={{ marginRight: '20px' }} onClick={handleMobile} />
              </Tooltip>
            </Box>
          </Box>
        </AppBar>
      </Box>

      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <SearchDialog />
        </Suspense>
      )}

    </>
  )
}

export default Header
