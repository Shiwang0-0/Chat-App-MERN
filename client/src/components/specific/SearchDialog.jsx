import SearchIcon from '@mui/icons-material/Search';
import { Dialog, DialogTitle, List, Stack, TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CustomMutationHook } from '../../hooks/CustomMutationHook';
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../../redux/api/api';
import { setIsSearch } from '../../redux/reducers/others.';
import UserItem from '../shared/UserItem';

const SearchDialog = () => {

  const [searchValue,setSearchValue]=useState("");

  const dispatch=useDispatch();
  const {isSearch}=useSelector(state=>state.misc);
  const [searchUser]=useLazySearchUserQuery();

  const [sendFriendRequest,isLoading]=CustomMutationHook(useSendFriendRequestMutation);

  useEffect(()=>{

    const timeOut=setTimeout(async()=>{
      
      try{
          const {data}=await searchUser(searchValue);
          setUsers(data.users)  
        }
        catch(error){
          console.log(error)
        }

    },1000)

    return ()=>{
      clearTimeout(timeOut);
    }

  },[searchValue])

  const [users,setUsers]=useState([]);

  const addFriendHandler=async (id)=>{
    await sendFriendRequest("Sending Friend Request",{userId:id})
  }
  
  const handleSearchDialogClose=()=>{
    dispatch(setIsSearch(false));
  }

  const searchHandler=(e)=>{
    const {value}=e.target;
    setSearchValue(value);
  }

  return (
    <>
      <Dialog open={isSearch} onClose={handleSearchDialogClose}>
        <Stack padding={{xs:"1rem",sm:"3rem"}} sx={{overflowX: "hidden", overflowY: "auto", '&::-webkit-scrollbar':{ width: 0, height: 0 }}}>
          <DialogTitle textAlign="center">Add Friend to Chat With</DialogTitle>
          <TextField  label="" variant="outlined" value={searchValue} onChange={searchHandler}
          InputProps={{
              startAdornment:(
                <InputAdornment position="start">
                  <SearchIcon/>
                </InputAdornment>
              )
            }}/>

          <List >
            {users.map((u)=>(
              <UserItem users={u} handler={addFriendHandler} handlerLoading={isLoading} key={u._id}/>
            ))}
          </List>
          
        </Stack>
        <UserItem />
      </Dialog>
    </>
  )
}

export default SearchDialog
