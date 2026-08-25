const mongoose = require('mongoose');

const documentTypeSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true }, // e.g. BONAFIDE, TRANSCRIPT, RECOMMENDATION
    label: { type: String, required: true },
    fields: [{ type: String }], // form field names expected
  },
  { timestamps: true }
);

module.exports = mongoose.model('DocumentType', documentTypeSchema);
