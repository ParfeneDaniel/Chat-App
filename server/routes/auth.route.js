const express = require("express");
const {
  signUp,
  validEmail,
  signIn,
  refresh,
  changePassword,
  forgotPassword,
  reset,
  signOut,
} = require("../controllers/auth.controller");
const authorization = require("../middlewares/authorization");

const router = express.Router();

router.post("/signup", signUp);
router.post("/validEmail/:emailToken", validEmail);
router.post("/signin", signIn);
router.post("/refresh", refresh);
router.put("/changePassword", authorization, changePassword);
router.post("/forgotPassword", forgotPassword);
router.put("/reset", reset);
router.post("/signout", authorization, signOut);

module.exports = router;
