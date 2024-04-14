import { Grid, Skeleton,Box ,Stack} from '@mui/material'
import React from 'react'

const Loader = () => {
  return (
    <>
          <Box sx={{ position:'static',height: '3rem',mt:0,mb:"1rem" }}>
          <  Skeleton variant="rectangular" height="3rem"/>
          </Box>
    <Grid container height={"calc(100vh-4rem"}>
            <Grid item xs={3}
             sx={{
              display:{display:"flex",alignItems:"center",justifyContent:"center",xs:"none",sm:"block",height:"90vh", alignItems:"center",width:"50%",ml:"5px"} }}
               mt="0.5rem" padding="0.5rem" >
            <Stack spacing="0.6rem" sx={{ alignItems: 'center', textAlign: 'center' }}>
            { Array.from({length:6}).map((_,index)=><  Skeleton key={index} variant="rectangular" width="15rem" height="4rem"  />)}
            </Stack>
            </Grid>
            <Grid item xs={6} 
            sx={{display:{xs:"block"} , margin:"1rem 0 0.5 rem 1rem"}} 
            height={"100%"}>
             <Stack spacing="1rem" mr="1.5rem">
             { Array.from({length:8}).map((_,index)=><  Skeleton key={index} variant="rectangular" height="3rem" />)}
             </Stack>
            </Grid>
            <Grid item xs={2.9} 
            sx={{display:{xs:"none",sm:"block"},mr:"5px"}} 
            height={"100%"}>
            <Skeleton variant="rectangular" height="90vh" mr="5px" padding="0.5rem" />
            </Grid>
          </Grid></>
  )
}

export default Loader
