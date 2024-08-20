const express = require("express");
const authorization = require("../middlewares/authorization");
const {
  getConversation,
  sendMessage,
  blockUser,
  unblockUser,
} = require("../controllers/conversations.controller");

const router = express.Router();

router.use(authorization);
router.get("/getConversation/:ID", getConversation);
router.post("/sendMessage", sendMessage);
router.post("/blockUser", blockUser);
router.post("/unblockUser", unblockUser);

module.exports = router;
