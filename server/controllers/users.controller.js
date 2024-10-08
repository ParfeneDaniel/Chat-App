const User = require("../models/user.model");
const Conversation = require("../models/conversation.model");
const client = require("../config/connectToRedis");
const crypto = require("crypto");
const Group = require("../models/group.model");

const getUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    let users = await User.find({ _id: { $ne: userId } }).select([
      "_id",
      "username",
    ]);
    const currentUser = await User.findById(userId);
    users = users.filter((user) => {
      const userObjectId = user._id.toString();
      let valid = currentUser.receivedRequests.find(
        (req) => req.id.toString() == userObjectId
      );
      if (valid) return false;
      valid = currentUser.sentRequests.find(
        (req) => req.id.toString() == userObjectId
      );
      if (valid) return false;
      valid = currentUser.conversations.find(
        (conversation) => conversation.id.toString() === userObjectId
      );
      if (valid) return false;
      return true;
    });
    res.status(201).json({ message: "All users", users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

const getReceivedRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    res.status(201).json({
      message: "Receive Requests were send",
      receivedRequests: user.receivedRequests,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

const getSentRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    res.status(201).json({
      message: "Send Requests were send",
      sentRequests: user.sentRequests,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const unreadMessages = await client.hGetAll(userId.toString());
    res.status(201).json({
      message: "Your list of conversations was send",
      conversations: user.conversations,
      unreadMessages,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

const sendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const userId = req.user.id;
    const senderUser = await User.findById(userId);
    const receiverUser = await User.findById(receiverId);
    const existRequest =
      receiverUser.receivedRequests.find((req) => req.id == userId) ||
      receiverUser.sentRequests.find((req) => req.id == userId);
    if (existRequest) {
      return res
        .status(403)
        .json({ message: "There is a request between you" });
    }
    const isAlreadyFriends = receiverUser.conversations.find(
      (friend) => friend.id == userId
    );
    if (isAlreadyFriends) {
      return res
        .status(403)
        .json({ message: "You already are friend with this person" });
    }
    receiverUser.receivedRequests.push({
      id: userId,
      username: senderUser.username,
    });
    senderUser.sentRequests.push({
      id: receiverId,
      username: receiverUser.username,
    });
    await Promise.all([receiverUser.save(), senderUser.save()]);
    res.status(201).json({ message: "Request was send" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

const acceptRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { senderId } = req.body;
    const user = await User.findById(userId);
    const senderUser = await User.findById(senderId);
    const isValidRequest =
      user.receivedRequests.find((req) => req.id == senderId) &&
      senderUser.sentRequests.find((req) => req.id == userId);
    if (!isValidRequest) {
      return res.status(404).json({ message: "This request doesn't exist" });
    }
    const ID = crypto.randomBytes(32).toString("hex");
    await Promise.all([
      User.updateMany(
        { _id: userId },
        {
          $pull: { receivedRequests: { id: senderId } },
          $addToSet: {
            conversations: { id: senderId, username: senderUser.username, ID },
          },
        }
      ),
      User.updateMany(
        { _id: senderId },
        {
          $pull: { sentRequests: { id: userId } },
          $addToSet: {
            conversations: { id: userId, username: user.username, ID },
          },
        }
      ),
      new Conversation({
        ID,
        parties: [
          { id: senderId, index: 0 },
          { id: userId, index: 1 },
        ],
      }).save(),
      client.hSet(userId.toString(), ID.toString(), 0),
      client.hSet(senderId.toString(), ID.toString(), 0),
    ]);
    res.status(201).json({ message: "You accept as friend this user" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

const createGroup = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, guests, username } = req.body;
    const ID = crypto.randomBytes(32).toString("hex");
    const user = await User.findById(userId);
    user.group.push({ name, ID });
    for (g of guests) {
      const userParty = await User.findById(g.userId);
      userParty.groupRequest.push({ name, ID, admin: user.username });
      await userParty.save();
    }
    const group = {
      ID,
      adminId: userId,
      adminUsername: user.username,
      parties: [{ userId, username }],
      ...req.body,
    };
    const newGroup = new Group(group);
    await Promise.all([
      newGroup.save(),
      user.save(),
      client.hSet(userId.toString(), ID.toString(), 0),
    ]);
    res.status(201).json({ message: "Group was created" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

const acceptGroupRequest = async (req, res) => {
  try {
    const { ID, name } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    const isValidRequest = user.groupRequest.find((req) => req.ID == ID);
    if (!isValidRequest) {
      return res.status(404).json({ message: "This request doesn't exist" });
    }
    user.group.push({ name, ID });
    const group = await Group.findOne({ ID });
    group.parties.push({ userId, username: user.username });
    await Promise.all([
      user.save(),
      group.save(),
      User.updateOne({ _id: userId }, { $pull: { groupRequest: { ID } } }),
      Group.updateOne({ ID }, { $pull: { guests: { userId } } }),
      client.hSet(userId.toString(), ID.toString(), 0),
    ]);
    res.status(201).json({ message: "You accepted this request" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

const getGroupRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    res.status(201).json({
      message: "Your group requests were sent",
      groupRequests: user.groupRequest,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

const getGroups = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const unreadMessages = await client.hGetAll(userId.toString());
    res.status(201).json({
      message: "Your groups were sent",
      groups: user.group,
      unreadMessages,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

const withdraw = async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.user.id;
    await Promise.all([
      User.updateOne({ _id: userId }, { $pull: { sentRequests: { id } } }),
      User.updateOne(
        { _id: id },
        { $pull: { receivedRequests: { id: userId } } }
      ),
    ]);
    res.status(201).json({ message: "Your request was withdrew" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

const reject = async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.user.id;
    await Promise.all([
      User.updateOne({ _id: userId }, { $pull: { receivedRequests: { id } } }),
      User.updateOne({ _id: id }, { $pull: { sentRequests: { id: userId } } }),
    ]);
    res.status(201).json({ message: "Your request was rejected" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

module.exports = {
  getUsers,
  getReceivedRequests,
  getSentRequests,
  getConversations,
  sendRequest,
  acceptRequest,
  createGroup,
  acceptGroupRequest,
  getGroupRequests,
  getGroups,
  withdraw,
  reject,
};
