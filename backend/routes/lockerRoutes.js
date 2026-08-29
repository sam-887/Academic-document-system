const express = require("express");
const crypto = require("crypto");
const path = require("path");

const LockerDocument = require("../models/LockerDocument");
const upload = require("../middleware/upload");
const { protect, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

// GET student's personal locker documents
router.get("/", requireRole("student"), async (req, res) => {
  try {
    const documents = await LockerDocument.find({
      studentId: req.user._id,
      personalUpload: true
    })
      .populate("issuedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(documents);
  } catch (err) {
    console.error("LOCKER GET ERROR:", err);
    res.status(500).json({
      message: "Failed to load digital locker"
    });
  }
});

// UPLOAD personal document
router.post(
  "/upload",
  requireRole("student"),
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Please select a file."
        });
      }

      const title = req.body.title || req.file.originalname;
      const type = req.body.type || "other";

      const document = await LockerDocument.create({
        studentId: req.user._id,
        title,
        type,
        fileUrl: `/uploads/${req.file.filename}`,
        issuedBy: null,
        verified: false,
        personalUpload: true
      });

      res.status(201).json({
        message: "Document uploaded successfully",
        document
      });
    } catch (err) {
      console.error("LOCKER UPLOAD ERROR:", err);

      res.status(500).json({
        message: err.message || "Failed to upload document"
      });
    }
  }
);

// GET single personal document
router.get("/:id", requireRole("student"), async (req, res) => {
  try {
    const document = await LockerDocument.findOne({
      _id: req.params.id,
      studentId: req.user._id,
      personalUpload: true
    });

    if (!document) {
      return res.status(404).json({
        message: "Document not found"
      });
    }

    res.json(document);
  } catch (err) {
    console.error("LOCKER DOCUMENT ERROR:", err);
    res.status(500).json({
      message: "Failed to load document"
    });
  }
});

// Share personal document
router.post("/:id/share", requireRole("student"), async (req, res) => {
  try {
    const token = crypto.randomBytes(24).toString("hex");

    const document = await LockerDocument.findOneAndUpdate(
      {
        _id: req.params.id,
        studentId: req.user._id,
        personalUpload: true
      },
      {
        shareToken: token,
        shareExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({
        message: "Document not found"
      });
    }

    res.json({
      token,
      expiresAt: document.shareExpiresAt
    });
  } catch (err) {
    console.error("LOCKER SHARE ERROR:", err);
    res.status(500).json({
      message: "Failed to create share link"
    });
  }
});

module.exports = router;
