import React from 'react'
import AppLayout from '../components/layout/AppLayout'
import { Stack,Box, Typography } from '@mui/material'
const Home = () => {
  return (
    <Box>
      <Stack height="100%" sx={{backgroundColor:"red"}}/>
      <Typography sx={{display:"flex ", justifyContent:"center",mt:"4rem",fontSize:"3rem"}}>Welcome to Chat-APP</Typography>
    </Box>
  )
}

export default AppLayout()(Home)
