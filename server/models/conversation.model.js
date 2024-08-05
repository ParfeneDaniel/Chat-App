const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema(
  {
    ID: {
      type: String,
      required: true,
    },
    parties: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        numberOfMessages: {
          type: Number,
          default: 0,
        },
        index: {
          type: Number,
          required: true,
        },
      },
    ],
    messages: [
      {
        message: {
          type: String,
        },
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
