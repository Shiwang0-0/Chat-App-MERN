import { Menu, Stack } from '@mui/material'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CustomMutationHook } from '../../hooks/CustomMutationHook'
import { useDeleteChatMutation, useLeaveGroupMutation } from '../../redux/api/api'
import { setIsDeleteMenu } from '../../redux/reducers/others.'

const DeleteChatMenu = ({ dispatch, deleteAnchor }) => {

    const navigate = useNavigate();
    const { isDeleteMenu, selectedDeleteChat } = useSelector((state) => state.misc)
    const isGroup = selectedDeleteChat.groupChat;
    const chatId = selectedDeleteChat.chatId;

    const [deleteChat, _, deletedChatData] = CustomMutationHook(useDeleteChatMutation)
    const [leaveGroup, __, leaveChatData] = CustomMutationHook(useLeaveGroupMutation)

    const closeHandler = () => {
        dispatch(setIsDeleteMenu(false));
        deleteAnchor.current = null
    }

    const handleLeaveGroup = () => {
        closeHandler()
        leaveGroup("Leaving Group...", chatId)
    }
    const handleDeleteChat = () => {
        closeHandler();
        deleteChat("Deleting chat...", chatId)
    }

    useEffect(() => {
        if (deletedChatData)
            navigate("/")
    }, [deletedChatData, leaveChatData])

    return (
        <Menu open={isDeleteMenu} onClose={closeHandler} anchorEl={deleteAnchor.current}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }} >
            <Stack sx={{ width: "10rem", cursor: "pointer", padding: "0.5rem" }} direction={"row"} alignItems={"center"} spacing={"0.5rem"} onClick={isGroup ? handleLeaveGroup : handleDeleteChat}>
                {
                    isGroup ? (<>Leave Group</>) : (<>Delete Chat</>)
                }
            </Stack>
        </Menu>
    )
}

export default DeleteChatMenu
