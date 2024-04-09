import React, { useState } from 'react'
import {Container,Paper, Typography, TextField,Button,Box,IconButton,Stack,Avatar} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { VisuallyHiddenInput } from '../components/styles/StyledComponent';

const Login = () => {

  const [isLogin, setIsLogin]=useState(true);
  const togglePage=()=>{
    setIsLogin(((prev)=>!prev));
  }
  return (
    <>
    <Container max-width="xs" component={"main"} sx={{margin:"auto",display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"}}>
    
      { isLogin ?
      <>
      <Paper elevation={7} sx={{height:"500px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center", padding:4, borderRadius:"1rem", width:"40%", mt:""}}>
        <Typography variant="h4" color="initial">
          Login
        </Typography>
        <form style={{display:"flex",flexDirection:"column",alignItems:"center", width:"80%", margin:"30px 0 0 0"}}>
          <TextField 
            margin='normal'
            required
            fullWidth
            id="UserName"
            label="UserName"  
            variant='outlined'
          />
          <TextField
            margin='normal'
            required
            fullWidth
            id="Password"
            type="password"
            label="Password"  
          />
          <Typography sx={{mt:"100px",display:"flex",justifyContent:"center",alignItems:"center", textAlign:"center"}}>Don't have an account?  <br/>Create New Account</Typography>
          
          <Box sx={{display:"flex",borderRadius:"1rem",alignItems:"center" ,justifyContent:"center", mt:"20px"}}>
            <Button variant='contained' type="submit" onClick={togglePage} >
            Register
            </Button>
          </Box>
          
        </form>
        </Paper>
      </>
      :
      <>
      <Paper elevation={7} sx={{height:"650px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center", padding:4, borderRadius:"1rem", width:"40%"}}>
        <Typography variant="h4" color="initial" mt="-15px">
          Register
        </Typography>

        <Stack position={"relative"}>
          <Avatar sx={{width:"10rem",height:"10rem",mt:"13px",objectFit:"contained"}} />
          <IconButton sx={{position:"absolute" ,bottom: "0" ,right: "0"}}component="label">
            <CameraAltIcon/>  
            <VisuallyHiddenInput type="file"/>
          </IconButton>
        </Stack>

        <form style={{display:"flex",flexDirection:"column",alignItems:"center", width:"80%", margin:"10px 0 0 0"}} >
        <TextField 
            margin='normal'
            required
            fullWidth
            id="userName"
            label="UserName"  
          />
          <TextField
            margin='normal'
            required
            fullWidth
            id="password"
            type="password"
            label="Password"  
          />
          <TextField 
            margin='normal'
            required
            fullWidth
            id="ConfirmPassword"
            type="password"
            label="Confirm Password"  
          />
          <Typography sx={{mt:"35px",display:"flex",justifyContent:"center",alignItems:"center", textAlign:"center"}}>Already a User?  <br/>Log in to your account</Typography>
          
          <Box sx={{display:"flex",borderRadius:"1rem",alignItems:"center" ,justifyContent:"center", mt:"12px"}}>
            <Button variant='contained' type="submit" onClick={togglePage} >
            Login
            </Button>
          </Box>
          
        </form>
        </Paper>
      </>
      }
     
    
    </Container>
    </>
  )
}

export default Login
