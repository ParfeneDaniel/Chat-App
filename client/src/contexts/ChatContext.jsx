import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const useChatContext = () => {
  return useContext(ChatContext);
};

export const ChatContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [unread, setUnread] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const [receiverUsername, setReceiverUsername] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [messages, setMessages] = useState([]);
  const [numberOfMessages, setNumberOfMessages] = useState(0);
  const [sentMessages, setSentMessages] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadAtConversation, setUnreadAtConversation] = useState(0);

  const value = {
    socket,
    setSocket,
    unread,
    setUnread,
    onlineUsers,
    setOnlineUsers,
    conversationId,
    setConversationId,
    receiverId,
    setReceiverId,
    receiverUsername,
    setReceiverUsername,
    conversation,
    setConversation,
    messages,
    setMessages,
    numberOfMessages,
    setNumberOfMessages,
    sentMessages,
    setSentMessages,
    unreadMessages,
    setUnreadMessages,
    unreadAtConversation,
    setUnreadAtConversation,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
