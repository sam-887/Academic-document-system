const mongoose = require("mongoose");

const lockerDocumentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    title: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: [
        "bonafide",
        "transcript",
        "recommendation",
        "marksheet",
        "certificate",
        "other"
      ],
      default: "other"
    },

    fileUrl: {
      type: String,
      required: true
    },

    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    verified: {
      type: Boolean,
      default: false
    },

    personalUpload: {
      type: Boolean,
      default: true
    },

    shareToken: {
      type: String,
      unique: true,
      sparse: true
    },

    shareExpiresAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("LockerDocument", lockerDocumentSchema);
