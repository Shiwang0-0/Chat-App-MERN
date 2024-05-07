import SearchIcon from '@mui/icons-material/Search';
import { Dialog, DialogTitle, List, Stack, TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import React, { useState } from 'react';
import { sampleSearchs } from '../../constants/sampleChats';
import UserItem from '../shared/UserItem';

const SearchDialog = () => {

  let isSendingRequest=false;

  const [users,setUsers]=useState(sampleSearchs);

  const addFriendHandler=(id)=>{
    console.log("added friend",id);
  }
  
  return (
    <>
      <Dialog open>
        <Stack padding={{xs:"1rem",sm:"3rem"}}>
          <DialogTitle textAlign="center">Search people</DialogTitle>
          <TextField  label="" variant="outlined" 
          InputProps={{
              startAdornment:(
                <InputAdornment position="start">
                  <SearchIcon/>
                </InputAdornment>
              )
            }}/>

          <List>
            {users.map((u)=>(
                // console.log("user aya?",u)
              <UserItem users={u} handler={addFriendHandler} handlerLoading={isSendingRequest} key={u._id}/>
            ))}
          </List>
          
        </Stack>
        <UserItem />
      </Dialog>
    </>
  )
}

export default SearchDialog
