import { Button, Dialog, DialogTitle, List, Stack, TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import React, { useEffect, useState } from 'react';
import { sampleSearchs } from '../../constants/sampleChats';
import UserItem from '../shared/UserItem';

const NewGroupDialog = () => {

  const [members,setMembers]=useState(sampleSearchs);
  const [selectedMembers,setSelectedMembers]=useState([]);

  const submitHandler=()=>{
    console.log("added")
  }
  const closeHandler=()=>{
    console.log("closed")
  }

  const selectMember=(_id)=>{
    setSelectedMembers((prev)=>prev.includes(_id)
    ? prev.filter((i)=>i!==_id)
    :[...prev,_id])
    console.log("user ",_id," added");
    
  }
  useEffect(() => {
    console.log(selectedMembers); 
  }, [selectedMembers]);

  return (
    <>
      <Dialog open>
        <Stack padding={{xs:"1rem",sm:"3rem"}}>
          <DialogTitle textAlign="center">Create Group</DialogTitle>
          <TextField  label="Group name" variant="outlined" 
          InputProps={{
              startAdornment:(
                <InputAdornment position="start"/>
              )
            }}/>

          <List>
            {members.map((u)=>(
                // console.log("user aya?",u)
              <UserItem users={u} handler={selectMember} key={u._id} isAdded={selectedMembers.includes(u._id)}/>
            ))}
          </List>
          <Stack direction="row" sx={{justifyContent: "space-between" }}> 
            <Button onClick={closeHandler}>Cancel</Button>
            <Button onClick={submitHandler}>Create</Button>
          </Stack>
        </Stack>
        <UserItem />
      </Dialog>
    </>
  )
}

export default NewGroupDialog
