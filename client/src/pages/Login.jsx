import React, { useEffect, useState } from 'react'
import {Container,Paper, Typography, TextField,Button,Box,IconButton,Stack,Avatar} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { VisuallyHiddenInput } from '../components/styles/StyledComponent';
import { validate} from '../utils/validation';


const Login = () => {

  const [isLogin, setIsLogin]=useState(true);
  const togglePage=()=>{
    setIsLogin(((prev)=>!prev));
  }
  const initialValuesLogin = { username: "",password: "" };
  const initialValuesRegister = { username: "",password: "" ,confirmpassword:""};
  const [formValues, setFormValues] = useState(isLogin?initialValuesLogin:initialValuesRegister);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => { 
    e.preventDefault();
    const errors = validate(formValues,isLogin);
    setFormErrors(errors);
    setIsSubmit(true);
  };

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(formValues);
    }
  }, [formErrors,isSubmit]);

  const handleImgChange=(e)=>{
    const file=e.target.files[0];
    if(file)
    {
      const reader=new FileReader();
      reader.onload=(e)=>{
        setSelectedImg(e.target.result);
      }
      reader.readAsDataURL(file);
    }
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
        <form style={{display:"flex",flexDirection:"column",alignItems:"center", width:"80%", margin:"30px 0 0 0"}} onSubmit={handleSubmit}>
          <TextField 
            margin='normal'
            required
            fullWidth
            name="username"
            label="Username"  
            variant='outlined'
            value={formValues.username}
            onChange={handleChange}
          />
          {formErrors.username && <p style={{margin:"-5px",color:"red"}}>{formErrors.username}</p>}
          <TextField
            margin='normal'
            required
            fullWidth
            name="password"
            type="password"
            label="Password"  
            value={formValues.password}
            onChange={handleChange}
          />
          {formErrors.password && <p style={{margin:"-5px",color:"red"}}>{formErrors.password}</p>}
          <Box sx={{display:"flex",borderRadius:"1rem",alignItems:"center" ,justifyContent:"center", mt:"12px"}}>
            <Button variant='contained' type="submit" >
            Login
            </Button>
          </Box>
          <Typography sx={{mt:"60px",display:"flex",justifyContent:"center",alignItems:"center", textAlign:"center"}}>Don't have an account?</Typography>
          
          <Box sx={{display:"flex",borderRadius:"1rem",alignItems:"center" ,justifyContent:"center", mt:"8px"}}>
            <Button type="button" onClick={togglePage} >
            Register
            </Button>
          </Box>
          
        </form>
        </Paper>
      </>
      :
      <>
      <Paper elevation={7} sx={{height:"650px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center", padding:4, borderRadius:"1rem", width:"40%"}}>
        <Typography variant="h4" color="initial" mt="-4px">
          Register
        </Typography>

        <Stack position={"relative"}>
          <Avatar src={selectedImg}
          sx={{width:"10rem",height:"10rem",mt:"13px",objectFit:"contained"}} 
          />
          <input type="file" onChange={handleImgChange} style={{ display: 'none' }} accept="image/*" id="avatar-input"/>
          <label htmlFor='avatar-input'>
          <IconButton sx={{position:"absolute" ,bottom: "0" ,right: "0"}} component="span">
            <CameraAltIcon/>  
            <VisuallyHiddenInput type="image/*"/>  
          </IconButton>
          </label>
        </Stack>

        <form style={{display:"flex",flexDirection:"column",alignItems:"center", width:"80%", margin:"10px"}} onSubmit={handleSubmit}>
        <TextField 
            margin='normal'
            required
            fullWidth
            name="username"
            label="Username"  
            value={formValues.username}
            onChange={handleChange}
          />
          {formErrors.username && <p style={{margin:"-5px",color:"red"}}>{formErrors.username}</p>}
          <TextField
            margin='normal'
            required
            fullWidth
            name="password"
            type="password"
            label="Password"  
            value={formValues.password}
            onChange={handleChange}
          />
          {formErrors.password && <p style={{margin:"-5px",color:"red"}}>{formErrors.password}</p>}
          <TextField 
            margin='normal'
            required
            fullWidth
            name="confirmpassword"
            type="password"
            label="Confirm Password"  
            value={formValues.confirmpassword || ''}
            onChange={handleChange}
          />
          {formErrors.confirmpassword && <p style={{margin:"-5px",color:"red"}}>{formErrors.confirmpassword}</p>}
          <Box sx={{display:"flex",borderRadius:"1rem",alignItems:"center" ,justifyContent:"center", mt:"12px"}}>
            <Button variant='contained' type="submit"  >
            Sign Up
            </Button>
          </Box>
          <Typography sx={{mt:"38px",display:"flex",justifyContent:"center",alignItems:"center", textAlign:"center"}}>Already a User?</Typography>
          
          <Box sx={{display:"flex",borderRadius:"1rem",alignItems:"center" ,justifyContent:"center", mt:"8px"}}>
            <Button type="button" onClick={togglePage} >
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
