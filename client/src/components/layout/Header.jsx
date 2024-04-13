import { AppBar,Box, IconButton, Tooltip, Typography } from '@mui/material'
import React,{ useState,Suspense, lazy} from 'react'
import { royalBlue } from '../../constants/colors'
import SearchIcon from '@mui/icons-material/Search';

const SearchDialog = lazy(()=>import("../specific/SearchDialog"));

const Header = () => {
  const [isSearch,setIsSearch]=useState(false);
  const searchDialog=()=>{
    console.log("search");
    setIsSearch((prev)=>!prev);
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
                <SearchIcon sx={{marginRight:"40px"}} onClick={searchDialog}/>
              </Tooltip>
          </Box>
          </Box>
        </AppBar>
      </Box>

    {isSearch && (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchDialog/>
        </Suspense>
    )}

    </>
  )
}

export default Header
