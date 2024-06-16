import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { Avatar, Box, Button, Container, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { server } from '../constants/configServer';
import { userExist } from '../redux/reducers/auth';
import { validate } from '../utils/validation';

const Login = () => {

  const dispatch=useDispatch();

  const initialValuesLogin = { username: "",password: "" };
  const initialValuesRegister = { name:"",username: "",password: "" ,confirmpassword:""};
  const allowedExtensions = ['jpeg', 'jpg', 'png'];
  const [isLogin, setIsLogin]=useState(true);
  const [formValues, setFormValues] = useState(isLogin?initialValuesLogin:initialValuesRegister);
  const [formErrors, setFormErrors] = useState({});
  const [selectedImg, setSelectedImg] = useState(null);
  const [fileError,setFileError]=useState(null);
  
  const togglePage=()=>{
    setIsLogin(((prev)=>!prev));
    setFormValues(isLogin?initialValuesRegister:initialValuesLogin);
    setFormErrors({});
    setSelectedImg(null);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setFormErrors(prevErrors => ({ ...prevErrors, [name]: '' })); 
  };
  
  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
  
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();
  
    if (allowedExtensions.includes(fileExtension)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImg(e.target.result);
      };
      reader.readAsDataURL(file);
      setFileError(null);
      setFormValues({ ...formValues, avatar: file });
    } 
    else {
      setFileError('Please upload a file with a .jpg, .png, or .jpeg extension');
      setSelectedImg(null);
    }
  };


  const handleSubmit = isLogin ? async (e) => {
    e.preventDefault();
    const errors = validate(formValues, isLogin);
    setFormErrors(errors);
    if (Object.keys(errors).length !== 0) {
      return;
    }
    
    try {
      const data = await axios.post(`${server}/api/v1/user/login`,
        {
          username: formValues.username,
          password: formValues.password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      dispatch(userExist(true));
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  } 
  : async (e) => {
    e.preventDefault();
    const errors = validate(formValues, isLogin);
    setFormErrors(errors);
    if (Object.keys(errors).length !== 0) {
      return;
    }
    try {
      const formData = new FormData();
      formData.append("avatar", formValues.avatar);
      formData.append("name", formValues.name);
      formData.append("username", formValues.username);
      formData.append("password", formValues.password);
      formData.append("confirmpassword", formValues.confirmpassword);
  
    
      const data = await axios.post(`${server}/api/v1/user/register`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(userExist(true));
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };
  


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
          sx={{ width: "10rem", height: "10rem", mt: "7px", objectFit: "contained" }}
        />
        <input type="file" name="avatar" onChange={handleImgChange} style={{ display: 'none' }} accept="image/*"      id="avatar-input" />
        {fileError && <p style={{ margin: "-5px", color: "red" }}>{fileError}</p>}
        <label htmlFor='avatar-input'>
          <IconButton sx={{ position: "absolute", bottom: "0", right: "0" }} component="span">
            <CameraAltIcon />
          </IconButton>
        </label>
      </Stack>

        <form style={{display:"flex",flexDirection:"column",alignItems:"center", width:"80%", margin:"8px"}} onSubmit={handleSubmit}>
        <TextField 
            margin='normal'
            required
            fullWidth
            name="name"
            label="Name"  
            variant='outlined'
            value={formValues.name || ''}
            onChange={handleChange}
          />
          {formErrors.name && <p style={{margin:"-5px",color:"red"}}>{formErrors.name}</p>}
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
          <Typography sx={{mt:"25px",display:"flex",justifyContent:"center",alignItems:"center", textAlign:"center"}}>Already a User?</Typography>
          
          <Box sx={{display:"flex",borderRadius:"1rem",alignItems:"center" ,justifyContent:"center", mt:"4px"}}>
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
