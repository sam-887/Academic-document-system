const Request = require('../models/Request');
const Student = require('../models/Student');
const { nextRequestId } = require('../utils/generateId');

exports.createRequest = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(400).json({ message: 'Student profile not found' });

    const { documentType, formData } = req.body;
    if (!documentType) return res.status(400).json({ message: 'documentType is required' });

    const requestId = await nextRequestId();

    const attachments = (req.files || []).map((f) => ({
      filename: f.filename,
      path: `/uploads/${f.filename}`,
      originalName: f.originalname,
    }));

    const parsedFormData = typeof formData === 'string' ? JSON.parse(formData) : formData || {};

    const request = await Request.create({
      requestId,
      student: student._id,
      documentType,
      formData: parsedFormData,
      attachments,
      status: 'PENDING',
    });

    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
};

exports.getMyRequests = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(400).json({ message: 'Student profile not found' });

    const requests = await Request.find({ student: student._id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    next(err);
  }
};

exports.getRequestById = async (req, res, next) => {
  try {
    const request = await Request.findOne({ requestId: req.params.id }).populate({
      path: 'student',
      populate: { path: 'user', select: 'name email' },
    });
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Ownership check for students
    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user._id });
      if (!student || String(request.student._id) !== String(student._id)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
    }

    res.json(request);
  } catch (err) {
    next(err);
  }
};

exports.getDashboardSummary = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(400).json({ message: 'Student profile not found' });

    const [total, pending, approved, rejected] = await Promise.all([
      Request.countDocuments({ student: student._id }),
      Request.countDocuments({ student: student._id, status: { $in: ['PENDING', 'UNDER_REVIEW'] } }),
      Request.countDocuments({ student: student._id, status: { $in: ['APPROVED', 'GENERATING', 'COMPLETED'] } }),
      Request.countDocuments({ student: student._id, status: 'REJECTED' }),
    ]);

    const recent = await Request.find({ student: student._id }).sort({ createdAt: -1 }).limit(5);

    res.json({ total, pending, approved, rejected, recent });
  } catch (err) {
    next(err);
  }
};

exports.getDocumentForRequest = async (req, res, next) => {
  try {
    const Document = require('../models/Document');
    const request = await Request.findOne({ requestId: req.params.id });
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const document = await Document.findOne({ request: request._id });
    if (!document) return res.status(404).json({ message: 'Document not yet generated' });

    res.json({
      documentId: document.documentId,
      filePath: document.filePath,
      verifyUrl: `/verify/${document.verificationToken}`,
    });
  } catch (err) {
    next(err);
  }
};
