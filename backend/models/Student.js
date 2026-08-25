const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    registerNumber: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    year: { type: String },
    semester: { type: String },
    cgpa: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
