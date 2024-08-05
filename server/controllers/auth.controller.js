const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const client = require("../config/connectToRedis");
const { sendValidEmail, sendSecurityEmail } = require("../utils/sendEmails");
const generateTokens = require("../utils/generateTokens");
const renewToken = require("../utils/renewToken");

const PAPPER = process.env.PAPPER;

const signUp = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const userInUse = await User.findOne({ $or: [{ username }, { email }] });
    if (userInUse) {
      return res
        .status(400)
        .json({ message: "Username or email already in use" });
    }
    const hashPassword = bcrypt.hashSync(password + PAPPER, 12);
    const emailToken = crypto.randomBytes(32).toString("hex");
    const newUser = new User({
      username,
      password: hashPassword,
      previousPasswords: hashPassword,
      email,
      isValid: false,
    });
    await Promise.all([
      newUser.save(),
      client.set(emailToken, username, { EX: 2 * 60 }),
      sendValidEmail(newUser, emailToken),
    ]);
    res.status(201).json({ message: "Your account was created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

const validEmail = async (req, res) => {
  try {
    const emailToken = req.params.emailToken;
    const isTokenValid = await client.get(emailToken);
    if (!isTokenValid) {
      return res.status(404).json({ message: "Your token expired" });
    }
    const user = await User.findOne({ username: isTokenValid });
    user.isValid = true;
    await Promise.all([user.save(), client.set(emailToken, "", { EX: 1 })]);
    res.status(201).json({ message: "Your email was verified" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Wrong credentials" });
    }
    const isValidPassword = bcrypt.compareSync(
      password + PAPPER,
      user.password
    );
    if (!isValidPassword) {
      return res.status(404).json({ message: "Wrong credentials" });
    }
    if (!user.isValid) {
      return res
        .status(403)
        .json({ message: "You need to validate your email" });
    }
    const { password: hashPassword, ...rest } = user._doc;
    generateTokens(res, rest);
    res.status(201);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const isValid = await client.get(refreshToken);
    if (!isValid) {
      return res.status(403).json({ message: "You aren't connected" });
    }
    renewToken(res, refreshToken);
    res.status(201);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newPassword } = req.body;
    const user = await User.findById(userId);
    for (const password of user.previousPasswords) {
      const isAlreadyUsed = bcrypt.compareSync(newPassword + PAPPER, password);
      if (isAlreadyUsed) {
        return res
          .status(401)
          .json({ message: "This password was already use" });
      }
    }
    const hashPassword = bcrypt.hashSync(newPassword + PAPPER, 12);
    user.password = hashPassword;
    user.previousPasswords.push(hashPassword);
    await user.save();
    res.status(201).json({ message: "Your password was changed" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "This user doesn't exist" });
    }
    const securityToken = crypto.randomBytes(32).toString("hex");
    await Promise.all([
      sendSecurityEmail(user, securityToken),
      client.set(securityToken, user._id.toString(), { EX: 3 * 60 }),
    ]);
    res.status(201).json({ message: "Your link was send to your email" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

const reset = async (req, res) => {
  try {
    const { newPassword, securityToken } = req.body;
    const isAvailable = await client.get(securityToken);
    if (!isAvailable) {
      return res
        .status(403)
        .json({ message: "Your security token isn't valid" });
    }
    const user = await User.findById(isAvailable);
    for (const password of user.previousPasswords) {
      const isAlreadyUsed = bcrypt.compareSync(newPassword + PAPPER, password);
      if (isAlreadyUsed) {
        return res
          .status(403)
          .json({ message: "This password was already use" });
      }
    }
    const hashPassword = bcrypt.hashSync(newPassword + PAPPER, 12);
    user.password = hashPassword;
    user.previousPasswords.push(hashPassword);
    await Promise.all([user.save(), client.set(securityToken, "", { EX: 1 })]);
    res.status(201).json({ message: "Your password was changed" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

const signOut = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    await client.set(refreshToken, "", { EX: 1 });
    res.status(201).json({ message: "You disconnected successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

module.exports = {
  signUp,
  validEmail,
  signIn,
  refresh,
  changePassword,
  forgotPassword,
  reset,
  signOut,
};
