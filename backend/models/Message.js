const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Request",
    default: null
  },

  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },

  read: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
});

/*
 * Automatically delete messages 30 days after createdAt.
 * MongoDB's TTL monitor handles the deletion automatically.
 */
messageSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 30 }
);

module.exports = mongoose.model("Message", messageSchema);
