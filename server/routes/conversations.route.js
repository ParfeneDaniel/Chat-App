const express = require("express");
const authorization = require("../middlewares/authorization");
const {
  getConversation,
  sendMessage,
} = require("../controllers/conversations.controller");

const router = express.Router();

router.use(authorization);
router.get("/getConversation/:ID", getConversation);
router.post("/sendMessage", sendMessage);

module.exports = router;
