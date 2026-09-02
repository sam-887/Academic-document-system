const Request = require('../models/Request');
const Student = require('../models/Student');
const { nextRequestId } = require('../utils/generateId');
const Notification = require('../models/Notification');
const LockerDocument = require('../models/LockerDocument');

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

    // Add documents selected from the student's Digital Locker.
    // Locker documents are verified against the logged-in student.
    let lockerDocumentIds = [];

    if (req.body.lockerDocumentIds) {
      try {
        lockerDocumentIds =
          typeof req.body.lockerDocumentIds === 'string'
            ? JSON.parse(req.body.lockerDocumentIds)
            : req.body.lockerDocumentIds;
      } catch {
        lockerDocumentIds = [];
      }
    }

    if (!Array.isArray(lockerDocumentIds)) {
      lockerDocumentIds = [];
    }

    if (lockerDocumentIds.length > 0) {
      const lockerDocuments = await LockerDocument.find({
        _id: { $in: lockerDocumentIds },
        studentId: req.user._id,
        personalUpload: true,
      });

      lockerDocuments.forEach((doc) => {
        attachments.push({
          filename: doc.fileUrl.split('/').pop(),
          path: doc.fileUrl,
          originalName: doc.title,
        });
      });
    }

    const parsedFormData = typeof formData === 'string' ? JSON.parse(formData) : formData || {};

    const request = await Request.create({
      requestId,
      student: student._id,
      documentType,
      formData: parsedFormData,
      attachments,
      status: 'PENDING',
    });

    try {
      const User = require('../models/User');
      const admins = await User.find({ role: { $in: ['admin', 'faculty'] } }).select('_id');
      if (admins.length) {
        await Notification.insertMany(admins.map((admin) => ({
          userId: admin._id,
          title: 'New document request',
          message: 'New request ' + request.requestId + ' - ' + request.documentType,
          type: 'request',
          requestId: request._id
        })));
      }
    } catch (notificationError) {
      console.error('Admin notification failed:', notificationError.message);
    }

    res.status(201).json({
      requestId: request.requestId,
      request
    });
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




