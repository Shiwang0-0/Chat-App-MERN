import AttachmentIcon from '@mui/icons-material/Attachment';
import SendIcon from '@mui/icons-material/Send';
import { IconButton, Skeleton, Stack } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import AppLayout from "../components/layout/AppLayout";
import { TypingLoader } from '../components/layout/Loader';
import MessageComponent from '../components/shared/MessageComponent.jsx';
import AttachmentDialog from '../components/specific/AttachmentDialog';
import { InputBox } from "../components/styles/StyledComponent";
import { NEW_MESSAGE, START_TYPING, STOP_TYPING } from '../constants/events';
import { useErrors } from '../hooks/ErrorHook';
import { useSocketEvents } from '../hooks/SocketEvents';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { removeNewMessagesAlert } from '../redux/reducers/chat';
import { setIsFileMenu } from "../redux/reducers/others";
import { getSocket } from '../socket';

const Chat = ({ chatId, user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const containerRef = useRef();
  const topMessageRef = useRef(); // Ref for the first message of the current page

  const socket = getSocket();

  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [message, setMessage] = useState("");
  const [meTyping, setMeTyping] = useState(false);
  const typingTimeout = useRef(null);
  const [messages, setMessages] = useState([]);
  const [userTyping, setUserTyping] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  useEffect(() => {
    if (chatDetails.data) {
      setMessages([]);
      setPage(1);
      setHasMore(true); 
      setLoading(false);
      dispatch(removeNewMessagesAlert(chatId));
    }
  }, [chatDetails.data, dispatch]);
  

  const fetchMessages = async () => {
    if (loading || !hasMore) return; // Prevent overlapping fetches
  
    setLoading(true);
    try {
      const newData = await oldMessagesChunk.refetch({ chatId, page });
  
      if (newData?.data?.messages?.length) {
        const currentScrollHeight = containerRef.current.scrollHeight;
  
        setMessages((prevMessages) => {
          const newMessages = newData.data.messages.filter(
            (msg) => !prevMessages.some((prevMsg) => prevMsg._id === msg._id)
          );
  
          return [...newMessages, ...prevMessages];
        });
  
        setPage((prevPage) => prevPage + 1);
        setTimeout(() => {
          containerRef.current.scrollTop +=
            containerRef.current.scrollHeight - currentScrollHeight;
        }, 10);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };
  
  
  useEffect(() => {
    if (!loading) {
      const observer = new IntersectionObserver(
        (entries) => {
          const firstEntry = entries[0];
          if (firstEntry.isIntersecting && hasMore && !loading) {
            fetchMessages();
          }
        },
        { threshold: 1.0 } 
      );
  
      if (topMessageRef.current) observer.observe(topMessageRef.current);
  
      return () => observer.disconnect();
    }
  }, [messages, hasMore, loading]);
  
  

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

  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
  
      setMessages((prev) => {
        if (prev.some(msg => msg._id === data.message._id)) return prev;
  
        const updatedMessages = [...prev, data.message];
  
          setTimeout(() => {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
          }, 10);
  
        return updatedMessages;
      });
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
      <Stack sx={{ height: "93%", width: "98%", margin: "auto", overflowX: "hidden", overflowY: "scroll", borderRadius: "10px" ,"&::-webkit-scrollbar": { display: "none" }}}  ref={containerRef}>
        {hasMore && 
          <div ref={topMessageRef}>
            load more items.....
          </div>
        }
        {messages.map((message,index) => (
          
          <MessageComponent user={user} message={message} key={index} id={index} />
        ))}
        {userTyping && <TypingLoader />}
      </Stack>
      <form style={{ height: "5vh", padding: "10px", borderRadius: "10px", boxShadow: "0px 0px 10px rgba(0,0,0,0.2)" }} onSubmit={submitHandler}>
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
        {userTyping && <TypingLoader />}
      </form>
      <AttachmentDialog anchorEl={fileMenuAnchor} chatId={chatId} />
    </>
  );
};
export default AppLayout()(Chat);