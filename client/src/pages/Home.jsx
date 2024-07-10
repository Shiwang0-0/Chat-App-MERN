import React from 'react'
import AppLayout from '../components/layout/AppLayout'
import { Stack, Box, Typography } from '@mui/material'
import { bgColorHome } from '../constants/colors'
const Home = () => {
  return (
    <Box
      height={"100%"}
    >
      <Typography p={"2rem"} variant="h5" textAlign={"center"}>
        Welcome to Chat application <br/> <br/> <br/> Select a friend to chat
      </Typography>
    </Box>
  )
}

export default AppLayout()(Home)
