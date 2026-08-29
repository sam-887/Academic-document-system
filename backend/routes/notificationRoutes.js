const express = require("express");
const Notification = require("../models/Notification");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/", async (req, res) => {
  try {
    const data = await Notification.find({
      userId: req.user._id
    }).sort({ createdAt: -1 }).limit(100);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to load notifications" });
  }
});

router.get("/unread-count", async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user._id,
      read: false
    });

    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Failed to get notification count" });
  }
});


router.delete("/clear-all", async (req, res) => {
  try {
    const result = await Notification.deleteMany({
      userId: req.user._id
    });

    res.json({
      message: "All notifications cleared",
      deletedCount: result.deletedCount
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to clear notifications"
    });
  }
});
router.patch("/:id/read", async (req, res) => {
  try {
    const item = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id
      },
      { read: true },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to update notification" });
  }
});

router.patch("/read-all", async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, read: false },
      { read: true }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update notifications" });
  }
});

module.exports = router;

