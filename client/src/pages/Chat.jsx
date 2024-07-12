import { useInfiniteScrollTop } from "6pp";
import AttachmentIcon from '@mui/icons-material/Attachment';
import SendIcon from '@mui/icons-material/Send';
import { IconButton, Skeleton, Stack, debounce, CircularProgress } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import AppLayout from '../components/layout/AppLayout';
import { TypingLoader } from "../components/layout/Loader"
import MessageComponent from '../components/shared/MessageComponent';
import AttachmentDialog from "../components/specific/AttachmentDialog"
import { InputBox } from '../components/styles/StyledComponent';
import { NEW_MESSAGE, START_TYPING, STOP_TYPING } from '../constants/events';
import { useErrors } from '../hooks/ErrorHook';
import { useSocketEvents } from '../hooks/SocketEvents';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { removeNewMessagesAlert } from "../redux/reducers/chat"
import { setIsFileMenu } from "../redux/reducers/others.";
import { getSocket } from '../socket';

const Chat = ({ chatId, user }) => {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const socket = getSocket();

  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [meTyping, setMeTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  useEffect(() => {
    dispatch(removeNewMessagesAlert(chatId));
    return () => {
      console.log("running in 1 return ")
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
    };
  }, [chatId]);

  const allMessages = [...oldMessages, ...messages];

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk?.isError, error: oldMessagesChunk?.error }
  ];

  const members = chatDetails?.data?.chat?.members;

  const messageOnChange = (e) => {
    setMessage(e.target.value);
    if (!meTyping) {
      socket.emit(START_TYPING, { chatId, members });
      setMeTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { chatId, members });
      setMeTyping(false);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      dispatch(removeNewMessagesAlert(chatId));
    }
  }, [chatId]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle socket events
  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const socketEvents = {
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener
  };

  useSocketEvents(socket, socketEvents);
  useErrors(errors);


  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  useEffect(() => {
    if (chatDetails.isError) {
      return navigate("/");
    }
  }, [chatDetails.isError, navigate]);

  return (
    chatDetails.isLoading ? <Skeleton /> :
      <>
        <Stack sx={{ height: "93%", width: "98%", margin: "auto", overflowX: "hidden", overflowY: "auto", '&::-webkit-scrollbar': { width: 0, height: 0 }, borderRadius: "10px 10px 10px 10px" }} ref={containerRef} spacing={1} >
          {allMessages.map((message) => (
            <MessageComponent user={user} message={message} key={message._id} />
          ))
          }
          {userTyping && <TypingLoader />}
          <div ref={bottomRef} />
        </Stack>
        <form style={{ height: "5vh", padding: "10px", borderRadius: "10px", boxShadow: "0px 0px 10px rgba(0,0,0,0.2)" }} onSubmit={submitHandler} id="messageBox" >
          <Stack direction="row" sx={{ height: "100%", alignItems: "center", justifyContent: "space-between" }} position="relative">
            <IconButton onClick={handleFileOpen} sx={{ marginRight: "10px" }}>
              <AttachmentIcon />
            </IconButton>
            <InputBox
              placeholder="Type Message Here..."
              value={message}
              onChange={messageOnChange}
              sx={{ flex: 1, padding: "10px", fontSize: "16px", borderRadius: "10px", border: "1px solid #ccc" }}
            />
            <IconButton type="submit" style={{ background: 'none', border: 'none', padding: 0, marginLeft: "10px" }}>
              <SendIcon />
            </IconButton>
          </Stack>
        </form>
        <AttachmentDialog anchorEl={fileMenuAnchor} chatId={chatId} />
      </>
  );
};

export default AppLayout()(Chat);