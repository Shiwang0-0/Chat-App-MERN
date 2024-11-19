import { Box, Stack } from '@mui/material'
import React from 'react'
import { royalBlue } from '../../constants/colors'
import ChatItem from '../shared/ChatItem'
import { bgColorBar,bgColorPanel } from '../../constants/colors'

const ChatList = (
  { w = "95%", chats = [], chatId, onlineUser = [],
    newMessagesAlert = [
      { chatId: "", count: 0 }
    ],
    handleDeleteChat
  }) => {
  return (
    <Box sx={{ bgcolor:bgColorPanel, height: '90vh', display: "flex", flexDirection: "column", alignItems: "center", mt: "10px", ml: "5px", mr: "5px", overflow: "none",borderRadius:"20px 20px 20px 20px" }} >
      <Stack width={w} mr="1rem" ml="1rem" mt="6px" spacing={1.5}>
        {
          

          chats?.map((data, index) => {
            const { groupAvatar, _id, name, groupChat, members } = data;
            const newMessageAlert = newMessagesAlert.find(
              ({ chatId }) => chatId === _id
            )
            return (
              <ChatItem index={index} newMessageAlert={newMessageAlert} avatar={groupAvatar} name={name} _id={_id} key={_id} groupChat={groupChat} sameSender={chatId === _id} handleDeleteChat={handleDeleteChat} />
            )
          }
          )}
      </Stack>
    </Box>
  )
}

export default ChatList
