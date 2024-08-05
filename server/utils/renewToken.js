const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const renewToken = (res, refreshToken) => {
  try {
    const decode = jwt.decode(refreshToken, JWT_SECRET);
    const accessToken = jwt.sign({ id: decode.id }, JWT_SECRET, {
      expiresIn: "10m",
    });
    res.json({ message: "Now you can reuse our api", accessToken });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = renewToken;
