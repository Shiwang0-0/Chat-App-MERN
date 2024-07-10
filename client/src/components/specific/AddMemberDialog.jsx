import { Button, Dialog, DialogTitle, Skeleton, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CustomMutationHook } from "../../hooks/CustomMutationHook";
import { useErrors } from "../../hooks/ErrorHook";
import { useAddGroupMembersMutation, useAvailableFriendsQuery } from "../../redux/api/api";
import { setIsAddMember } from "../../redux/reducers/others.";
import UserItem from "../shared/UserItem";


const AddMemberDialog = ({chatId}) => {

  const dispatch=useDispatch()

  const { isLoading, data, isError, error } = useAvailableFriendsQuery(chatId);
  const [addMembers, isLoadingAddMembers]=CustomMutationHook(useAddGroupMembersMutation);
  const { isAddMember } = useSelector((state) => state.misc);

  
  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id]
    );
  };

  const closeHandler=()=>{
    dispatch(setIsAddMember(false))
  }

  const addMemberSubmitHandler = () => {
    addMembers("Adding Members...", { chatId,members:selectedMembers });
    closeHandler();
  };
  useErrors([{isError,error}])

  return (
    <Dialog open={isAddMember} onClose={closeHandler} >
      <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"}>Add Member</DialogTitle>
        <Stack spacing={"1rem"}>
          {isLoading ? (
            <Skeleton />
          ) : 
          
          (data?.friends?.length > 0 ? (
            data?.friends?.map((i) => (
              <UserItem key={i._id} users={i} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)}
              />
            ))
          ) : (
            <Typography textAlign={"center"}>No Friends</Typography>
          ))
          
          
          }
        </Stack>

        <Stack direction={"row"} alignItems={"center"} justifyContent={"space-evenly"}>
          <Button color="error" onClick={closeHandler}>
            Cancel
          </Button>
          <Button onClick={addMemberSubmitHandler} variant="contained" disabled={isLoadingAddMembers}>
            Submit Changes
          </Button>
        </Stack>
      </Stack>
      <UserItem />
    </Dialog>
  )
};

export default AddMemberDialog;