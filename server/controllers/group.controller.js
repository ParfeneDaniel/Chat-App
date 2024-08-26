const client = require("../config/connectToRedis");
const Group = require("../models/group.model");
const User = require("../models/user.model");
const {
  onlineUsers,
  usersCurrentConversation,
  io,
} = require("../socket/socket");

const addUser = async (req, res) => {
  try {
    const { ID, guests, username } = req.body;
    const adminId = req.user.id;
    const group = await Group.findOne({ ID });
    if (!group) {
      return res.status(404).json({ message: "This group doesn't exist" });
    }
    if (group.adminId != adminId) {
      return res.status(403).json({ message: "This group isn't yours" });
    }
    await Group.updateOne({ ID }, { $push: { guests } });
    for (g of guests) {
      const userParty = await User.findById(g.userId);
      userParty.groupRequest.push({
        name: group.name,
        ID: group.ID,
        admin: username,
      });
      await userParty.save();
    }
    res.status(201).json({ message: "Your persons was added" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

const outFromGroup = async (req, res) => {
  try {
    const { ID } = req.body;
    const userId = req.user.id;
    const group = await Group.findOne({ ID });
    const isAdmin = group.adminId == userId;
    const isParty = group.parties.find((party) => party.userId == userId)
      ? true
      : false;
    if (!(isAdmin || isParty)) {
      return res.status(403).json({ message: "You aren't in this group" });
    }
    if (isAdmin) {
      await Promise.all([
        Group.updateOne({ ID }, { $unset: { adminId: userId } }),
        User.updateOne({ _id: userId }, { $pull: { group: { ID } } }),
      ]);
    }
    if (isParty) {
      await Promise.all([
        Group.updateOne({ ID }, { $pull: { parties: { userId } } }),
        User.updateOne({ _id: userId }, { $pull: { group: { ID } } }),
      ]);
    }
    res.status(201).json({ message: "You are out from this group" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

const deleteFromGroup = async (req, res) => {
  try {
    const { ID, deleteId } = req.body;
    const userId = req.user.id;
    const group = await Group.findOne({ ID });
    if (group.adminId != userId) {
      return res
        .status(403)
        .json({ message: "You aren't the admin of this group" });
    }
    await Promise.all([
      Group.updateOne({ ID }, { $pull: { parties: { userId: deleteId } } }),
      User.updateOne({ _id: deleteId }, { $pull: { group: { ID } } }),
    ]);
    res.status(201).json({ message: "This user were deleted from group" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

const getGroup = async (req, res) => {
  try {
    const userId = req.user.id;
    const ID = req.params.ID;
    const group = await Group.findOne({ ID });
    const validGroup = group.parties.find((party) => party.userId == userId);
    if (!validGroup) {
      return res.status(404).json({ message: "You aren't in this group" });
    }
    await client.hSet(userId.toString(), ID.toString(), 0);
    res.status(201).json({ message: "This your group messages", group });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { ID, message, username } = req.body;
    const group = await Group.findOne({ ID });
    const validGroup = group.parties.find((party) => party.userId == userId);
    if (!validGroup) {
      return res.status(404).json({ message: "You aren't in this group" });
    }
    group.messages.push({ message, sender: username });
    await group.save();
    for (party of group.parties) {
      if (party.userId != userId) {
        const receiverSocketId = onlineUsers[party.userId];
        if (receiverSocketId) {
          const currentConversation = usersCurrentConversation[party.userId];
          if (currentConversation != ID) {
            await client.hIncrBy(party.userId.toString(), ID.toString(), 1);
            io.to(receiverSocketId).emit("unreadMessage", { ID });
          } else {
            io.to(receiverSocketId).emit("getMessage", {
              message,
              sender: username,
            });
          }
        }
      }
    }
    res.status(201).json({ message: "Message was sent" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

module.exports = {
  addUser,
  outFromGroup,
  deleteFromGroup,
  getGroup,
  sendMessage,
};
