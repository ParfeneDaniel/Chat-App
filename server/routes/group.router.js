const express = require("express");
const {
  addUser,
  outFromGroup,
  deleteFromGroup,
  getGroup,
  sendMessage,
} = require("../controllers/group.controller");
const authorization = require("../middlewares/authorization");

const router = express.Router();

router.use(authorization);
router.post("/addUser", addUser);
router.post("/outFromGroup", outFromGroup);
router.post("/deleteFromGroup", deleteFromGroup);
router.get("/getGroup/:ID", getGroup);
router.post("/sendMessage", sendMessage);

module.exports = router;
