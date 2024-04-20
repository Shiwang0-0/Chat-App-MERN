import { Dialog, DialogTitle, Stack, TextField, List } from '@mui/material'
import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import UserItem from '../shared/UserItem';
import { sampleSearchs } from '../../constants/sampleChats';
import { useState } from 'react';

const SearchDialog = () => {

  let isSendingRequest=false;

  const [users,setUsers]=useState(sampleSearchs);

  const addFriendHandler=(id)=>{
    console.log("added friend",id);
  }
  
  return (
    <div>
      <Dialog open>
        <Stack padding= "1rem">
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
    </div>
  )
}

export default SearchDialog
