const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const authorization = (req, res, next) => {
  try {
    const header = req.header("Authorization");
    if (!header) {
      return res.status(403).json({ message: "Yot aren't autentificated" });
    }
    const accessToken = header.split(" ")[1];
    jwt.verify(accessToken, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Token isn't valid" });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = authorization;
