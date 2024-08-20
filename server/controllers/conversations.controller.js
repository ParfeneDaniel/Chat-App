const Conversation = require("../models/conversation.model");
const client = require("../config/connectToRedis");
const {
  io,
  onlineUsers,
  usersCurrentConversation,
} = require("../socket/socket");

const getConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const ID = req.params.ID;
    const conversation = await Conversation.findOne({ ID });
    const validConversation = conversation.parties.find(
      (part) => part.id == userId
    );
    if (!validConversation) {
      return res
        .status(403)
        .json({ message: "This conversations is not yours" });
    }
    await client.hSet(userId.toString(), ID.toString(), 0);
    const index = validConversation.index;
    const numberOfMessages = validConversation.numberOfMessages;
    const didBlock = validConversation.didBlock;
    const wereBlocked = validConversation.wereBlocked;
    const receiverUserId = conversation.parties[1 - index].id;
    const unreadMessages = await client.hGet(
      receiverUserId.toString(),
      ID.toString()
    );
    const currentConversation = usersCurrentConversation[receiverUserId];
    if (currentConversation == ID) {
      const receiverSocketId = onlineUsers[receiverUserId];
      io.to(receiverSocketId).emit("read");
    }
    res.status(201).json({
      message: "This is your conversations",
      conversation,
      numberOfMessages,
      unreadMessages,
      didBlock,
      wereBlocked,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { ID, message, receiverId } = req.body;
    const conversation = await Conversation.findOne({ ID });
    const validConversation = conversation.parties.find(
      (part) => part.id == userId
    );
    if (!validConversation) {
      return res
        .status(403)
        .json({ message: "This conversations is not yours" });
    }
    const index = validConversation.index;
    const block =
      conversation.parties[index].didBlock ||
      conversation.parties[index].wereBlocked;
    if (block) {
      return res
        .status(403)
        .json({ message: "You blocked this user or he blocked you" });
    }
    conversation.parties[index].numberOfMessages =
      conversation.parties[index].numberOfMessages + 1;
    conversation.messages.push({ message, senderId: userId });
    conversation.save();
    const receiverSocketId = onlineUsers[receiverId];
    const senderSocketId = onlineUsers[userId];
    if (receiverSocketId) {
      const currentConversation = usersCurrentConversation[receiverId];
      if (currentConversation != ID) {
        await client.hIncrBy(receiverId.toString(), ID.toString(), 1);
        io.to(receiverSocketId).emit("unreadMessage", { ID });
        io.to(senderSocketId).emit("unreadMessageAtConversation");
      } else {
        io.to(receiverSocketId).emit("getMessage", {
          message,
          senderId: userId,
        });
      }
    } else {
      await client.hIncrBy(receiverId.toString(), ID.toString(), 1);
      io.to(senderSocketId).emit("unreadMessageAtConversation");
    }
    res.status(201).json({ message });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

const blockUser = async (req, res) => {
  try {
    const { ID } = req.body;
    const userId = req.user.id;
    const conversation = await Conversation.findOne({ ID });
    const validConversation = conversation.parties.find(
      (part) => part.id == userId
    );
    if (!validConversation) {
      return res
        .status(403)
        .json({ message: "This conversations is not yours" });
    }
    const index = validConversation.index;
    conversation.parties[index].didBlock = true;
    conversation.parties[1 - index].wereBlocked = true;
    await conversation.save();
    const receiverId = conversation.parties[1 - index].id;
    const receiverSocketId = onlineUsers[receiverId];
    if (receiverSocketId) {
      const currentConversation = usersCurrentConversation[receiverId];
      if (currentConversation == ID) {
        io.to(receiverSocketId).emit("blocked");
      }
    }
    res.status(201).json({ message: "You block this user" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

const unblockUser = async (req, res) => {
  try {
    const { ID } = req.body;
    const userId = req.user.id;
    const conversation = await Conversation.findOne({ ID });
    const validConversation = conversation.parties.find(
      (part) => part.id == userId
    );
    if (!validConversation) {
      return res
        .status(403)
        .json({ message: "This conversations is not yours" });
    }
    const index = validConversation.index;
    conversation.parties[index].didBlock = false;
    conversation.parties[1 - index].wereBlocked = false;
    await conversation.save();
    const receiverId = conversation.parties[1 - index].id;
    const receiverSocketId = onlineUsers[receiverId];
    if (receiverSocketId) {
      const currentConversation = usersCurrentConversation[receiverId];
      if (currentConversation == ID) {
        io.to(receiverSocketId).emit("unblocked");
      }
    }
    res.status(201).json({ message: "You unblock this user" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

module.exports = { sendMessage, getConversation, blockUser, unblockUser };
