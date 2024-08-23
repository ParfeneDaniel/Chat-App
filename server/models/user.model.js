const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    previousPasswords: [
      {
        type: String,
      },
    ],
    email: {
      type: String,
      unique: true,
      required: true,
    },
    isValid: {
      type: Boolean,
      required: true,
    },
    sentRequests: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        username: {
          type: String,
        },
      },
    ],
    receivedRequests: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        username: {
          type: String,
        },
      },
    ],
    conversations: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        username: {
          type: String,
        },
        ID: {
          type: String,
          required: true,
        },
      },
    ],
    group: [
      {
        name: {
          type: String,
          required: true,
        },
        ID: {
          type: String,
          required: true,
        },
      },
    ],
    groupRequest: [
      {
        name: {
          type: String,
          required: true,
        },
        ID: {
          type: String,
          required: true,
        },
        admin: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
