const express = require("express");
const authorization = require("../middlewares/authorization");
const {
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
} = require("../controllers/users.controller");

const router = express.Router();

router.use(authorization);
router.get("/getUsers", getUsers);
router.get("/getReceivedRequests", getReceivedRequests);
router.get("/getSentRequests", getSentRequests);
router.get("/getConversations", getConversations);
router.get("/getGroupRequests", getGroupRequests);
router.get("/getGroups", getGroups);
router.post("/sendRequest", sendRequest);
router.post("/acceptRequest", acceptRequest);
router.post("/createGroup", createGroup);
router.post("/acceptGroupRequest", acceptGroupRequest);
router.post("/withdraw", withdraw);

module.exports = router;
