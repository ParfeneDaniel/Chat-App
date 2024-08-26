import React, { useEffect, useRef } from "react";
import { useChatContext } from "../contexts/ChatContext";
import useAxiosInstance from "../hooks/useAxiosInstance";
import { useAuthContext } from "../contexts/AuthContext";

const ChatGroup = () => {
  const inputRef = useRef();
  const lastMessageRef = useRef();
  const { name, conversationId, setMessages, conversation, messages } =
    useChatContext();
  const { accessToken, username } = useAuthContext();
  const axiosInstance = useAxiosInstance();

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [conversation, messages]);

  const sendMessage = () => {
    axiosInstance
      .post(
        "/groups/sendMessage",
        { ID: conversationId, message: inputRef.current.value, username },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(() => {
        const msg = { message: inputRef.current.value, sender: username };
        setMessages((prev) => [...prev, msg]);
        inputRef.current.value = "";
      })
      .catch((error) => console.log(error));
  };

  const sendMessageOnEnter = (e) => {
    if (e.key == "Enter") {
      axiosInstance
        .post(
          "/groups/sendMessage",
          { ID: conversationId, message: inputRef.current.value, username },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then(() => {
          const msg = { message: inputRef.current.value, sender: username };
          setMessages((prev) => [...prev, msg]);
          inputRef.current.value = "";
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="chat">
      <div className="details">
        <p>{name}</p>
      </div>
      <div className="messages">
        {conversation?.map((conv) => {
          if (conv.sender == username) {
            return (
              <div className="message" key={conv._id} ref={lastMessageRef}>
                <div className="messageSent">
                  <p>{conv.message}</p>
                </div>
              </div>
            );
          }
          return (
            <div className="message" key={conv._id} ref={lastMessageRef}>
              <div className="messageReceived">
                <p>{conv.message}</p>
                <p className="usernameMessage">{conv.sender}</p>
              </div>
            </div>
          );
        })}
        {messages?.map((msg, ind) => {
          if (msg.sender == username) {
            return (
              <div className="message" key={ind} ref={lastMessageRef}>
                <div className="messageSent">
                  <p>{msg.message}</p>
                </div>
              </div>
            );
          }
          return (
            <div className="message" key={ind} ref={lastMessageRef}>
              <div className="messageReceived">
                <p>{msg.message}</p>
                <p className="usernameMessage">{msg.sender}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="send">
        <input type="text" ref={inputRef} onKeyDown={sendMessageOnEnter} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatGroup;
