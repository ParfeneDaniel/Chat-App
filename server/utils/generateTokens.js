const jwt = require("jsonwebtoken");
const client = require("../config/connectToRedis");

const JWT_SECRET = process.env.JWT_SECRET;

const generateTokens = async (res, user) => {
  try {
    const accessToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "10m",
    });
    const refreshToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "15d",
    });
    await client.set(refreshToken, user.username, { EX: 15 * 24 * 60 * 60 });
    res.json({
      message: "You connected successfully",
      userId: user._id,
      username: user.username,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = generateTokens;
