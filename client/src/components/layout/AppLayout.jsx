import React from 'react'
import Header from './Header'
import Title from '../shared/Title'
import { Grid, NativeSelect } from '@mui/material'
import NavigationPanel from './NavigationPanel'
import ChatList from '../specific/ChatList'
// Higher order components
const AppLayout = ()=>(WrapperComponent) =>{
  return(props)=>{
    return (
        <>
        <Title />
          <Header/>
          <Grid container height={"calc(100vh-4rem"}>
            <Grid item xs={3}
             sx={{
              display:{xs:"none",sm:"block"} }}
              height={"100%"} >
              <NavigationPanel/>
            </Grid>
            <Grid item xs={6} 
            sx={{display:{xs:"block"} }} 
            height={"100%"} >
              <WrapperComponent {...props}/>
            </Grid>
            <Grid item xs={3} 
            sx={{display:{xs:"none",sm:"block"} }} 
            height={"100%"} >
              <ChatList/>
            </Grid>
          </Grid>
        </>
      )
  }
}

export default AppLayout
