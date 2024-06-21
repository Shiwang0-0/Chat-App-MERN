import axios from 'axios';
import React, { Suspense, lazy, useEffect } from 'react';
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Loader from './components/layout/Loader.jsx';
import ProtectedRoute from './components/styles/auth/ProtectedRoute.jsx';
import { server } from './constants/configServer.js';
import { userExist, userNotExist } from './redux/reducers/auth.js';

const Home= lazy(()=>import("./pages/Home.jsx"));
const Login=lazy(()=>import("./pages/Login.jsx"))
const Chat=lazy(()=>import("./pages/Chat.jsx"))
const Group=lazy(()=>import("./pages/Group.jsx"))
const NotFound=lazy(()=>import("./pages/NotFound.jsx"))
const Profile=lazy(()=>import("./pages/Profile.jsx"))


const App = () => {
  
  const {user,loader}=useSelector(state=>state.auth);

  const dispatch=useDispatch();

  useEffect(()=>{
    axios
    .get(`${server}/api/v1/user/myprofile`,{withCredentials:true})
    .then(({data})=>dispatch(userExist(data.user)))
    .catch((err)=>dispatch(userNotExist()))
  },[dispatch])

  return loader?<Loader/>:(
    <BrowserRouter>
    <Suspense fallback={<Loader/>}>
    <Routes> 

      <Route element={<ProtectedRoute user={user}/>}>
        <Route path="/" element={<Home/>}/>
        <Route path="/chat/:chatId" element={<Chat/>}/>
        <Route path="/group" element={<Group/>}/>
        <Route path="/profile" element={<Profile user={user}/>}/>
      </Route>

      <Route path="/login" element={<ProtectedRoute user={!user} redirect="/">
        <Login/>
      </ProtectedRoute>}/>

      <Route path="*" element={<NotFound/>}/>

    </Routes>
    </Suspense>
    <Toaster position='top-right'/>
    </BrowserRouter>
  )
}

export default App
