const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

const connectedToDB = () => {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((error) => {
      console.log("DB ", error);
    });
};

module.exports = connectedToDB;
