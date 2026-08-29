const express = require("express");
const Message = require("../models/Message");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/faculty", async (req, res) => {
  try {
    const faculty = await User.find({
      role: { $in: ["faculty", "admin"] }
    }).select("_id name email role");

    res.json(faculty);
  } catch (err) {
    res.status(500).json({ message: "Failed to load faculty" });
  }
});
router.get("/received", async (req, res) => {
  try {
    const messages = await Message.find({
      receiverId: req.user._id
    })
      .populate("senderId", "name email role")
      .populate("receiverId", "name email role")
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to load received messages"
    });
  }
});
router.get("/request/:requestId", async (req, res) => {
  try {
    const messages = await Message.find({
      requestId: req.params.requestId,
      $or: [
        { senderId: req.user._id },
        { receiverId: req.user._id }
      ]
    })
      .populate("senderId", "name email role")
      .populate("receiverId", "name email role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to load messages" });
  }
});

router.post("/request/:requestId", async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    if (!receiverId || !message?.trim()) {
      return res.status(400).json({
        message: "Receiver and message are required"
      });
    }

    const newMessage = await Message.create({
      requestId: req.params.requestId,
      senderId: req.user._id,
      receiverId,
      message: message.trim()
    });

    await Notification.create({
      userId: receiverId,
      title: "New message",
      message: message.trim().slice(0, 150),
      type: "message",
    });

    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

module.exports = router;

