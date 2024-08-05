const express = require("express");
const cors = require("cors");
const connectedToDB = require("./config/connectToDB");
const authRouter = require("./routes/auth.route");
const usersRouter = require("./routes/users.route");
const conversationsRouter = require("./routes/conversations.route");
const { app, server } = require("./socket/socket");

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/conversations", conversationsRouter);

server.listen(3001, () => {
  connectedToDB();
  console.log("server is running");
});
