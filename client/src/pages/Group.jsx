import React, { Suspense, memo, useEffect, useState } from "react";
// import GroupNavigation from '../components/specific/GroupNavigation';
import { Add as AddIcon, Delete as DeleteIcon, Done as DoneIcon, Edit as EditIcon, Home as HomeIcon } from "@mui/icons-material";
import { Avatar, Backdrop, Box, Button, CircularProgress, Grid, IconButton, Skeleton, Stack, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserItem from "../components/shared/UserItem";
import AddMemberDialog from "../components/specific/AddMemberDialog";
import DeleteGroupDialog from "../components/specific/DeleteGroupDialog";
import { StyledLink } from "../components/styles/StyledComponent";
import { bgColorGroup, bgColorPanel, bgColorProfileCard, random2 } from "../constants/colors";
import { CustomMutationHook } from "../hooks/CustomMutationHook";
import { useErrors } from "../hooks/ErrorHook";
import { transformImage } from "../lib/fileFormat";
import { useChatDetailsQuery, useDeleteChatMutation, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from "../redux/api/api";
import { setIsAddMember } from "../redux/reducers/others";


const Group = () => {
  const user = {
    _id: "sdfsdf",
    name: "dfsdfasd",
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const chatId = useSearchParams()[0].get("group");
  const { isMobile } = useSelector((state) => state.misc);
  const { isAddMember } = useSelector((state) => state.misc);

  const groupDetails = useChatDetailsQuery({ chatId, populate: true }, { skip: !chatId })


  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [groupName, setGroupName] = useState("")
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("")
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [members, setMembers] = useState([])
  const [addMemberDialog, setAddMemberDialog] = useState(false);

  const [renameGroup, isLoadingGroupName] = CustomMutationHook(useRenameGroupMutation)
  const [removeMember, isLoadingRemoveMember] = CustomMutationHook(useRemoveGroupMemberMutation)
  const [deleteChat, isLoadingDeleteChat] = CustomMutationHook(useDeleteChatMutation)


  const myGroup = useMyGroupsQuery("");

  const errors = [
    {
      isError: myGroup.isError,
      error: myGroup.error,
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error,
    }
  ];

  useErrors(errors);

  const navigateToHome = () => navigate("/");

  useEffect(() => {
    if (chatId) {
      setGroupName(`Group Name ${chatId}`);
      setGroupNameUpdatedValue(`Group Name ${chatId}`);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setIsEdit(false);
    };
  }, [chatId]);

  useEffect(() => {
    if (groupDetails.data) {
      setGroupName(groupDetails?.data?.chat?.name)
      setGroupNameUpdatedValue(groupDetails?.data?.chat?.name)
      setMembers(groupDetails?.data?.chat?.members)
    }

    return () => {
      setGroupName("")
      setGroupNameUpdatedValue("")
      setMembers([]);
      setIsEdit(false)
    }
  }, [groupDetails.data])

  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleMobileClose = () => {
    setIsMobileMenuOpen(false);
  };

  const updateGroupName = () => {
    setIsEdit(false)
    renameGroup("Updating group name...", {
      chatId,
      name: groupNameUpdatedValue
    })
  }

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true)
  }
  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false)
  }
  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true))
  }
  const closeAddMemberHandler = () => {
    dispatch(setIsAddMember(false))
  }

  const removeMemberHandler = (userId) => {
    removeMember("removing member...", { chatId, userId })
  }

  const deleteHandler = () => {
    deleteChat("Deleting Group...", chatId);
    closeConfirmDeleteHandler();
    navigate("/group");
  };


  const GroupName = (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"center"}
      spacing={"1rem"}
      padding={"2rem"}
    >
      {isEdit ? (
        <>
          <TextField
            value={groupNameUpdatedValue} onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
          />
          <IconButton onClick={updateGroupName} disabled={isLoadingGroupName} >
            <DoneIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Typography sx={{ fontSize: "2rem", color:"black",fontFamily:"revert-layer"}}>{groupName}</Typography>
          <IconButton onClick={() => setIsEdit(true)} disabled={isLoadingGroupName} >
            <EditIcon />
          </IconButton>
        </>
      )
      } 
    </Stack>
  );



  const ButtonGroup = (
    <Stack direction={{ xs: "column-reverse", sm: "row", }} spacing={"1rem"} p={{ xs: "0", sm: "1rem", md: "1rem 4rem", }}>
      <Button color="error" startIcon={<DeleteIcon />} onClick={openConfirmDeleteHandler}>
        Delete Group
      </Button>
      <Button sx={{backgroundColor: "green",color:"white",variant:"contained",
          "&:hover": {
            backgroundColor: "green"
          }
      }} startIcon={<AddIcon />} onClick={openAddMemberHandler}>
        Add Member
      </Button>
    </Stack>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh",backgroundImage: bgColorGroup }}>
      <Grid container height={"calc(100vh - 1rem)"}>
        <Grid item xs={9} sx={{ padding: "2rem" }}>
          <HomeIcon onClick={navigateToHome} />
          {chatId ? (
            <>
              {GroupName && (
                <>
                    {GroupName}
                  <Stack maxWidth={"45rem"} width={"100%"} boxSizing={"border-box"} padding={"1rem 2rem"} spacing={"2rem"} height={"50vh"} overflow={"auto"} sx={{ backgroundColor: bgColorProfileCard, borderRadius: "1rem", boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)",margin:"auto",overflowX: "hidden", overflowY: "auto", '&::-webkit-scrollbar':{ width: 0, height: 0 }}}
                  >
                    {isLoadingRemoveMember ? (
                      <CircularProgress />
                    ) : (
                      members.map((i) => (
                        <UserItem users={i} key={i._id} isAdded 
                          handler={removeMemberHandler} 
                        />
                      ))
                    )}
                  </Stack>

                  <Box sx={{display:"flex",justifyContent:"flex-end"}}>
                  {ButtonGroup}
                  </Box>
                </>
              )}
            </>
          ) : (
            <>
            <Typography sx={{textAlign:"center",fontSize:"3rem",mb:"0.6rem"}}>Welcome to Groups Section</Typography>
            <Typography sx={{textAlign:"center",fontSize:"2rem"}}>Edit Your groups</Typography></>
          )}
        </Grid>
        {
          confirmDeleteDialog && (
            <Suspense fallback={<Backdrop open />}>
              <DeleteGroupDialog confirmDeleteDialog={confirmDeleteDialog} closeConfirmDeleteHandler={closeConfirmDeleteHandler} deleteHandler={deleteHandler} />
            </Suspense>
          )
        }
        {
          isAddMember && (
            <Suspense fallback={<Backdrop open />}>
              <AddMemberDialog chatId={chatId} />
            </Suspense>
          )
        }
        <Grid item xs={3} sx={{ display: { xs: "none", sm: "block" }, height: "100%" }}>
          {myGroup.isLoading ? (
            <Skeleton variant="rectangular" height="3rem" />
          ) : (
            <GroupList groups={myGroup?.data?.groups} chatId={chatId} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

const GroupList = ({ chatId, groups = [] }) => (
  <Stack spacing={2} sx={{ padding: "1rem", backgroundColor: "white", borderRadius: "1rem", boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)",height:"100%",mt:"10px",bgcolor:bgColorPanel,ml:"10px",mr:"10px",color:"white" }}>
    {groups.length > 0 ? (
      groups.map((group) => (
        <GroupListItem group={group} chatId={chatId} key={group._id} />
      ))
    ) : (
      <Typography>no groups</Typography>
    )}
  </Stack>
);

const GroupListItem = memo(({ group, chatId }) => {
  const { name, _id } = group;
  let avatar = [];
  avatar = group.groupAvatar?.url;
  let sameSender=false;

  const [isSameSender,setIsSameSender]=useState(false);

  useEffect(()=>{
    if(chatId==_id)
    setIsSameSender(true)

    return()=>{
      setIsSameSender(false)
    }
  },[_id,chatId])

  return (
    <StyledLink
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id){
          e.preventDefault();
        }
      }}
    >
      <Stack direction="row" sx={{ padding: "0.3rem", alignItems: "center",backgroundColor:isSameSender? random2 : "unset", color:isSameSender? "unset" : random2 ,borderRadius:"20px 20px 20px 20px" }}>
        <Avatar
          src={transformImage([avatar])}
          sx={{ height: "2.2rem", width: "2.2rem" }}
        />
        <Typography sx={{ fontSize: "1rem" }}>{name}</Typography>
      </Stack>
    </StyledLink>
  );
});

export default Group;
