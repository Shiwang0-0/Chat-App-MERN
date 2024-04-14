import React,{Suspense, lazy} from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import ProtectedRoute from './components/styles/auth/ProtectedRoute.jsx';
import Loader from './components/layout/Loader.jsx';

const Home= lazy(()=>import("./pages/Home.jsx"));
const Login=lazy(()=>import("./pages/Login.jsx"))
const Chat=lazy(()=>import("./pages/Chat.jsx"))
const Group=lazy(()=>import("./pages/Group.jsx"))
const NotFound=lazy(()=>import("./pages/NotFound.jsx"))

const App = () => {
  let user=true;
  return (
    <BrowserRouter>
    <Suspense fallback={<Loader/>}>
    <Routes> 

      <Route element={<ProtectedRoute user={user}/>}>
        <Route path="/" element={<Home/>}/>
        <Route path="/chat/:chatId" element={<Chat/>}/>
        <Route path="/group" element={<Group/>}/>
      </Route>

      <Route path="/login" element={<ProtectedRoute user={!user} redirect="/">
        <Login/>
      </ProtectedRoute>}/>

      <Route path="*" element={<NotFound/>}/>

    </Routes>
    </Suspense>
    </BrowserRouter>
  )
}

export default App
