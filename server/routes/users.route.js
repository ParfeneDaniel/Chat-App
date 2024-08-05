const express = require("express");
const authorization = require("../middlewares/authorization");
const {
  getUsers,
  getReceivedRequests,
  getSentRequests,
  getConversations,
  sendRequest,
  acceptRequest,
} = require("../controllers/users.controller");

const router = express.Router();

router.use(authorization);
router.get("/getUsers", getUsers);
router.get("/getReceivedRequests", getReceivedRequests);
router.get("/getSentRequests", getSentRequests);
router.get("/getConversations", getConversations);
router.post("/sendRequest", sendRequest);
router.post("/acceptRequest", acceptRequest);

module.exports = router;
