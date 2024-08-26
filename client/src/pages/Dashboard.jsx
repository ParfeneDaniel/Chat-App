import { useEffect } from "react";
import io from "socket.io-client";
import { useChatContext } from "../contexts/ChatContext";
import { useAuthContext } from "../contexts/AuthContext";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import CreateGroup from "../components/CreateGroup";
import ChatGroup from "../components/ChatGroup";

const Dashboard = () => {
  const { userId } = useAuthContext();
  const {
    setSocket,
    setMessages,
    setUnread,
    setUnreadMessages,
    setUnreadAtConversation,
    setWereBlocked,
    showChat,
    setIsOnline,
    showCreateGroup,
    showGroupChat,
  } = useChatContext();

  useEffect(() => {
    const socket = io.connect("http://localhost:3001", {
      query: {
        userId,
      },
    });
    setSocket(socket);
    socket.on("getMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    socket.on("unreadMessage", (data) => {
      setUnread((prev) => ({ ...prev, [data.ID]: Number(prev[data.ID]) + 1 }));
    });
    socket.on("read", () => {
      setUnreadMessages(0);
      setUnreadAtConversation(0);
    });
    socket.on("unreadMessageAtConversation", () => {
      setUnreadAtConversation((prev) => prev + 1);
    });
    socket.on("blocked", () => {
      setWereBlocked(true);
    });
    socket.on("unblocked", () => {
      setWereBlocked(false);
    });
    socket.on("online", () => {
      setIsOnline(true);
    });
    socket.on("offline", () => {
      setIsOnline(false);
    });
    return () => socket.close();
  }, []);

  return (
    <div className="dashboard">
      <Header />
      <div className="functionalities">
        <Sidebar />
        {showChat ? (
          <Chat />
        ) : showCreateGroup ? (
          <CreateGroup />
        ) : showGroupChat ? (
          <ChatGroup />
        ) : (
          <div className="empty"></div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
