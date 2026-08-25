const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    requestId: { type: String, required: true, unique: true }, // REQ-2026-00001
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    documentType: { type: String, required: true }, // BONAFIDE | TRANSCRIPT | RECOMMENDATION
    formData: { type: mongoose.Schema.Types.Mixed, default: {} },
    attachments: [{ filename: String, path: String, originalName: String }],
    status: {
      type: String,
      enum: ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'GENERATING', 'COMPLETED', 'REJECTED'],
      default: 'PENDING',
    },
    remarks: { type: String, default: '' },
    aiValidation: { type: mongoose.Schema.Types.Mixed },
    aiRecommendationDraft: { type: String },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Request', requestSchema);
