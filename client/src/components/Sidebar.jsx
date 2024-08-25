import React, { useState } from "react";
import useAxiosInstance from "../hooks/useAxiosInstance";
import { useAuthContext } from "../contexts/AuthContext";
import { useChatContext } from "../contexts/ChatContext";

const Sidebar = () => {
  const axiosInstance = useAxiosInstance();
  const [show, setShow] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const { accessToken } = useAuthContext();
  const {
    socket,
    unread,
    setUnread,
    setIsOnline,
    setReceiverId,
    setReceiverUsername,
    setConversationId,
    setConversation,
    setMessages,
    setNumberOfMessages,
    setSentMessages,
    setUnreadMessages,
    setUnreadAtConversation,
    setDidBlock,
    setWereBlocked,
    setShowChat,
    setShowCreateGroup,
  } = useChatContext();

  const [users, setUsers] = useState(null);
  const [received, setReceived] = useState(null);
  const [sent, setSent] = useState(null);
  const [conversations, setConversations] = useState(null);
  const [groupRequests, setGroupRequests] = useState(null);
  const [groups, setGroups] = useState(null);

  const handleGetUsers = () => {
    axiosInstance
      .get("/users/getUsers", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => setUsers(response.data.users))
      .catch((error) => console.log(error));
  };

  const handleGetReceived = () => {
    axiosInstance
      .get("/users/getReceivedRequests", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => setReceived(response.data.receivedRequests))
      .catch((error) => console.log(error));
  };

  const handleGetSent = () => {
    axiosInstance
      .get("/users/getSentRequests", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => setSent(response.data.sentRequests))
      .catch((error) => console.log(error));
  };

  const handleGetConversations = () => {
    axiosInstance
      .get("/users/getConversations", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setConversations(response.data.conversations);
        setUnread(response.data.unreadMessages);
      })
      .catch((error) => console.log(error));
  };

  const handleShow = (id) => {
    setShow((prev) => {
      const newShow = prev.map((_, ind) => ind == id);
      return newShow;
    });
    if (id == 0) {
      handleGetUsers();
    } else if (id == 1) {
      handleGetReceived();
    } else if (id == 2) {
      handleGetSent();
    } else if (id == 3) {
      handleGetConversations();
    } else if (id == 4) {
      handleShowCreateGroup();
    } else if (id == 5) {
      handleGetGroupRequests();
    } else if (id == 6) {
      handleGetGroups();
    }
  };

  const handleSubmitSend = (receiverId) => {
    axiosInstance
      .post(
        "/users/sendRequest",
        { receiverId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .catch((error) => console.log(error));
  };

  const handleAcceptRequest = (senderId) => {
    axiosInstance
      .post(
        "/users/acceptRequest",
        { senderId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .catch((error) => console.log(error));
  };

  const handleGetConversation = (ID, conv) => {
    axiosInstance
      .get(`/conversations/getConversation/${ID}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setUnread((prev) => ({ ...prev, [ID]: 0 }));
        setReceiverId(conv.id);
        setReceiverUsername(conv.username);
        setConversationId(ID);
        setConversation(response.data.conversation.messages);
        setNumberOfMessages(response.data.numberOfMessages);
        setSentMessages(0);
        setUnreadMessages(response.data.unreadMessages);
        setUnreadAtConversation(0);
        setMessages([]);
        setDidBlock(response.data.didBlock);
        setWereBlocked(response.data.setWereBlocked);
        setIsOnline(response.data.isOnline);
        setShowChat(true);
        setShowCreateGroup(false);
        socket.emit("setCurrentConversation", ID);
      })
      .catch((error) => console.log(error));
  };

  const handleShowCreateGroup = () => {
    setShowCreateGroup(true);
    setShowChat(false);
  };

  const handleGetGroupRequests = () => {
    axiosInstance
      .get("/users/getGroupRequests", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => setGroupRequests(response.data.groupRequests))
      .catch((error) => console.log(error));
  };

  const handleAcceptGroupRequest = (request) => {
    axiosInstance
      .post(
        "/users/acceptGroupRequest",
        { ID: request.ID, name: request.name },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .catch((error) => console.log(error));
  };

  const handleGetGroups = () => {
    axiosInstance
      .get("/users/getGroups", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => setGroups(response.data.groups))
      .catch((error) => console.log(error));
  };

  const handleGetGroup = () => {};

  return (
    <div className="sidebar">
      <div className="buttons">
        <button onClick={() => handleShow(0)}>Users</button>
        <button onClick={() => handleShow(1)}>Received</button>
        <button onClick={() => handleShow(2)}>Sent</button>
        <button onClick={() => handleShow(3)}>Conversations</button>
        <button onClick={() => handleShow(4)}>Create</button>
        <button onClick={() => handleShow(5)}>Receive Groups</button>
        <button onClick={() => handleShow(6)}>Groups</button>
      </div>
      <div className="showData">
        {show[0]
          ? users?.map((user) => (
              <div key={user._id} className="data">
                <p>{user.username}</p>
                <button onClick={() => handleSubmitSend(user._id)}>Add</button>
              </div>
            ))
          : ""}
        {show[1]
          ? received?.map((req) => (
              <div key={req._id} className="data">
                <p>{req.username}</p>
                <button onClick={() => handleAcceptRequest(req.id)}>
                  Accept
                </button>
              </div>
            ))
          : ""}
        {show[2]
          ? sent?.map((req) => (
              <div key={req._id} className="data">
                <p>{req.username}</p>
              </div>
            ))
          : ""}
        {show[3]
          ? conversations?.map((conv) => (
              <div key={conv._id} className="data">
                <p>{conv.username}</p>
                {unread[conv.ID] > 0 && (
                  <div className="unreadMessages">{unread[conv.ID]}</div>
                )}
                <button onClick={() => handleGetConversation(conv.ID, conv)}>
                  Show
                </button>
              </div>
            ))
          : ""}
        {show[5]
          ? groupRequests?.map((req) => (
              <div key={req._id} className="data">
                <p>{req.name}</p>
                <p>Admin: {req.admin}</p>
                <button onClick={() => handleAcceptGroupRequest(req)}>
                  Accept
                </button>
              </div>
            ))
          : ""}
        {show[6]
          ? groups?.map((group) => (
              <div key={group._id} className="data">
                <p>{group.name}</p>
                {unread[group.ID] > 0 && (
                  <div className="unreadMessages">{unread[conv.ID]}</div>
                )}
                <button>Show</button>
              </div>
            ))
          : ""}
      </div>
    </div>
  );
};

export default Sidebar;
