import CameraAltIcon from "@mui/icons-material/CameraAlt";
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  List,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { CustomMutationHook } from "../../hooks/CustomMutationHook";
import { useErrors } from "../../hooks/ErrorHook";
import {
  useAvailableFriendsQuery,
  useNewGroupMutation,
} from "../../redux/api/api";
import { setIsNewGroup } from "../../redux/reducers/others.";
import UserItem from "../shared/UserItem";

const NewGroupDialog = () => {
  const { isNewGroup } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const [selectedMembers, setSelectedMembers] = useState([]);
  const allowedExtensions = ['jpeg', 'jpg', 'png'];
  const [groupName, setGroupName] = useState("");
  const [groupIcon, setGroupIcon] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);

  const [newGroup, isLoadingNewGroup] = CustomMutationHook(useNewGroupMutation);

  const { isError, isLoading, error, data } = useAvailableFriendsQuery();

  const errors = [{ isError, error }];

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    const fileName = file.name;
    const fileExtension = fileName.split(".").pop().toLowerCase();

    if (allowedExtensions.includes(fileExtension)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImg(e.target.result);
      };
      reader.readAsDataURL(file);
      setFileError(null);
      setGroupIcon({ avatar: file });
    } else {
      setFileError(
        "Please upload a file with a .jpg, .png, or .jpeg extension"
      );
      setGroupIcon(null);
    }
  };

  useErrors(errors);

  const handleChange = (e) => {
    const groupName = e.target.value;
    setGroupName(groupName);
  };

  const submitHandler = () => {
    if (groupName.length == 0) return toast.error("Group name is required");
    if (selectedMembers.length < 2)
      return toast.error("Atleast 3 members required to form a group");


    newGroup("Creating Group....", {
      name: groupName,
      members: selectedMembers,
      avatar: selectedImg
    });

    closeHandler();
  };
  const closeHandler = () =>  dispatch(setIsNewGroup(false));

  const selectMember = (_id) => {
    setSelectedMembers((prev) =>
      prev.includes(_id) ? prev.filter((i) => i !== _id) : [...prev, _id]
    );
  };


  return (
    <>
      <Dialog open={isNewGroup} onClose={closeHandler}>
        <Stack padding={{ xs: "1rem", sm: "3rem" }}>
          <DialogTitle textAlign="center" mt="-3rem">
            Create Group
          </DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              src={selectedImg}
              sx={{ width: "5rem", height: "5rem", objectFit: "contained" }}
            />
            <input
              type="file"
              name="avatar"
              onChange={handleImgChange}
              style={{ display: "none" }}
              accept="image/*"
              id="avatar-input"
            />
            <label htmlFor="avatar-input">
              <IconButton
                sx={{ position: "relative", bottom: "-30px", left: "-40px" }}
                component="span"
              >
                <CameraAltIcon />
              </IconButton>
            </label>
            <TextField
              label="Group name"
              variant="outlined"
              value={groupName}
              onChange={handleChange}
              InputProps={{
                startAdornment: <InputAdornment position="start" />,
              }}
            />
          </Stack>
          {fileError && (
            <Typography style={{ margin: "-5px", color: "red" }}>{fileError}</Typography>
          )}
          <List>
            {isLoading ? (
              <Skeleton />
            ) : (
              data?.friends.map((u) => (
                <UserItem
                  users={u}
                  handler={selectMember}
                  key={u._id}
                  isAdded={selectedMembers.includes(u._id)}
                />
              ))
            )}
          </List>
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Button onClick={closeHandler}>Cancel</Button>
            <Button onClick={submitHandler} disabled={isLoadingNewGroup}>
              Create
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
};

export default NewGroupDialog;
