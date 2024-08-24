const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const User = require("../models/user.model");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const onlineUsers = {};
const usersCurrentConversation = {};

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    onlineUsers[userId] = socket.id;
  }
  const user = await User.findById(userId); 
  const conversations = user.conversations;
  conversations.forEach((conversation) => {
    const currentConversation = usersCurrentConversation[conversation.id];
    if (currentConversation == conversation.ID) {
      const receiverSocketId = onlineUsers[conversation.id];
      io.to(receiverSocketId).emit("online");
    } 
  });
  socket.on("setCurrentConversation", (currentConversationId) => {
    usersCurrentConversation[userId] = currentConversationId;
  });
  socket.on("disconnect", () => {
    conversations.forEach((conversation) => {
      const currentConversation = usersCurrentConversation[conversation.id];
      if (currentConversation == conversation.ID) {
        const receiverSocketId = onlineUsers[conversation.id];
        io.to(receiverSocketId).emit("offline");
      }
    });
    delete onlineUsers[userId];
    delete usersCurrentConversation[userId];
  });
});

module.exports = {
  server,
  app,
  io,
  onlineUsers,
  usersCurrentConversation,
};
