import React, { useEffect, useRef } from "react";
import { useChatContext } from "../contexts/ChatContext";
import { useAuthContext } from "../contexts/AuthContext";
import useAxiosInstance from "../hooks/useAxiosInstance";

const Chat = () => {
  const axiosInstance = useAxiosInstance();
  const { userId, accessToken } = useAuthContext();
  const {
    receiverId,
    receiverUsername,
    conversationId,
    conversation,
    messages,
    setMessages,
    numberOfMessages,
    sentMessages,
    setSentMessages,
    unreadMessages,
    unreadAtConversation,
    didBlock,
    setDidBlock,
    wereBlocked,
    isOnline,
  } = useChatContext();
  const inputRef = useRef();
  const lastMessageRef = useRef();
  var index = 0,
    indexAtConversation = 0;

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [conversation, messages]);

  const handleBlock = () => {
    if (didBlock) {
      axiosInstance
        .post(
          "/conversations/unblockUser",
          { ID: conversationId },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then(() => setDidBlock(false))
        .catch((error) => console.log(error));
    } else {
      axiosInstance
        .post(
          "/conversations/blockUser",
          { ID: conversationId },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then(() => setDidBlock(true))
        .catch((error) => console.log(error));
    }
  };

  const sendMessage = () => {
    axiosInstance
      .post(
        "/conversations/sendMessage",
        { ID: conversationId, message: inputRef.current.value, receiverId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(() => {
        const msg = { message: inputRef.current.value, senderId: userId };
        setMessages((prev) => [...prev, msg]);
        setSentMessages((prev) => prev + 1);
        inputRef.current.value = "";
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="chat">
      <div className="details">
        <p>{wereBlocked ? "blocked" : "unblocked"}</p>
        <p>{receiverUsername}</p>
        <p>{isOnline ? "Online" : "Offline"}</p>
        <button onClick={handleBlock}>{didBlock ? "Unblock" : "Block"}</button>
      </div>
      <div className="messages">
        {conversation?.map((conv) => {
          if (conv.senderId == userId) {
            index++;
            if (index > numberOfMessages - unreadMessages) {
              return (
                <div className="message" key={conv._id} ref={lastMessageRef}>
                  <div className="messageSent">
                    <p>{conv.message}</p>
                    <div className="unread"></div>
                  </div>
                </div>
              );
            }
            return (
              <div className="message" key={conv._id} ref={lastMessageRef}>
                <div className="messageSent">
                  <p>{conv.message}</p>
                  <div className="read"></div>
                </div>
              </div>
            );
          }
          return (
            <div className="message" key={conv._id} ref={lastMessageRef}>
              <div className="messageReceived">
                <p>{conv.message}</p>
              </div>
            </div>
          );
        })}
        {messages?.map((msg, ind) => {
          if (msg.senderId == userId) {
            indexAtConversation++;
            if (indexAtConversation > sentMessages - unreadAtConversation) {
              return (
                <div className="message" key={ind} ref={lastMessageRef}>
                  <div className="messageSent">
                    <p>{msg.message}</p>
                    <div className="unread"></div>
                  </div>
                </div>
              );
            }
            return (
              <div className="message" key={ind} ref={lastMessageRef}>
                <div className="messageSent">
                  <p>{msg.message}</p>
                  <div className="read"></div>
                </div>
              </div>
            );
          }
          return (
            <div className="message" key={ind} ref={lastMessageRef}>
              <div className="messageReceived">
                <p>{msg.message}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="send">
        <input type="text" ref={inputRef} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
