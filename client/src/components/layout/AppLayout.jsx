import React from 'react'
import Header from './Header'
import Title from '../shared/Title'
import { Grid } from '@mui/material'

// Higher order components
const AppLayout = ()=>(WrapperComponent) =>{
  return(props)=>{
    return (
        <>
        <Title />
          <Header/>
          <Grid container height={"calc(100vh-4rem"}>
            <Grid item xs={4}
             sx={{
              display:{xs:"none",sm:"block"} }}
              height={"100%"} bgcolor="primary.main">
              first
            </Grid>
            <Grid item xs={8} 
            sx={{display:{xs:"block"} }} 
            height={"100%"} bgcolor="primary.default">
              <WrapperComponent {...props}/>
            </Grid>
          </Grid>
        </>
      )
  }
}

export default AppLayout
