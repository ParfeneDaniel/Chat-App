import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const useChatContext = () => {
  return useContext(ChatContext);
};

export const ChatContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [unread, setUnread] = useState([]);
  const [isOnline, setIsOnline] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const [receiverUsername, setReceiverUsername] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [messages, setMessages] = useState([]);
  const [numberOfMessages, setNumberOfMessages] = useState(0);
  const [sentMessages, setSentMessages] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadAtConversation, setUnreadAtConversation] = useState(0);
  const [didBlock, setDidBlock] = useState(null);
  const [wereBlocked, setWereBlocked] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const value = {
    socket,
    setSocket,
    unread,
    setUnread,
    isOnline,
    setIsOnline,
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
    didBlock,
    setDidBlock,
    wereBlocked,
    setWereBlocked,
    showChat,
    setShowChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
