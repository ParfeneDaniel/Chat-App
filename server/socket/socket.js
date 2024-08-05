const http = require("http");
const express = require("express");
const { Server } = require("socket.io");

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

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    onlineUsers[userId] = socket.id;
  }

  io.emit("getOnlineUsers", onlineUsers);

  socket.on("setCurrentConversation", (currentConversationId) => {
    usersCurrentConversation[userId] = currentConversationId;
  });

  socket.on("disconnect", () => {
    delete onlineUsers[userId];
    delete usersCurrentConversation[userId];
    io.emit("getOnlineUsers", onlineUsers);
  });
});

module.exports = {
  server,
  app,
  io,
  onlineUsers,
  usersCurrentConversation,
};
