const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    documentId: { type: String, required: true, unique: true }, // DOC-2026-00001
    request: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
    filePath: { type: String, required: true },
    issueDate: { type: Date, default: Date.now },
    verificationToken: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);
