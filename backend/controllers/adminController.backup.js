const crypto = require('crypto');
const Request = require('../models/Request');
const Student = require('../models/Student');
const Document = require('../models/Document');
const LockerDocument = require('../models/LockerDocument');
const { nextDocumentId } = require('../utils/generateId');
const { generateDocumentPdf } = require('../utils/generatePdf');

exports.getAllRequests = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const requests = await Request.find(filter)
      .populate({
        path: 'student',
        populate: {
          path: 'user',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    next(err);
  }
};

exports.getSummary = async (req, res, next) => {
  try {
    const [pending, approved, rejected, total] = await Promise.all([
      Request.countDocuments({
        status: { $in: ['PENDING', 'UNDER_REVIEW'] }
      }),
      Request.countDocuments({
        status: { $in: ['APPROVED', 'GENERATING', 'COMPLETED'] }
      }),
      Request.countDocuments({
        status: 'REJECTED'
      }),
      Request.countDocuments({})
    ]);

    const byType = await Request.aggregate([
      {
        $group: {
          _id: '$documentType',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      pending,
      approved,
      rejected,
      total,
      byType
    });
  } catch (err) {
    next(err);
  }
};

exports.approveRequest = async (req, res, next) => {
  try {
    const request = await Request.findOne({
      requestId: req.params.id
    }).populate({
      path: 'student',
      populate: {
        path: 'user'
      }
    });

    if (!request) {
      return res.status(404).json({
        message: 'Request not found'
      });
    }

    request.status = 'GENERATING';
    request.reviewedBy = req.user._id;

    await request.save();

    const documentId = await nextDocumentId();
    const verificationToken = crypto.randomBytes(16).toString('hex');

    const filePath = await generateDocumentPdf({
      documentId,
      requestDoc: request,
      student: request.student,
      user: request.student.user,
      verificationToken
    });

    const document = await Document.create({
      documentId,
      request: request._id,
      filePath: `/generated/${documentId}.pdf`,
      verificationToken
    });

    /*
     * SAVE GENERATED DOCUMENT TO DIGITAL LOCKER
     *
     * LockerDocument.studentId references User,
     * while request.student is a Student document.
     * request.student.user is therefore the correct User ID.
     */
    await LockerDocument.create({
      studentId: request.student.user._id,
      title: request.documentType,
      type: String(request.documentType || 'other').toLowerCase(),
      fileUrl: `/generated/${documentId}.pdf`,
      issuedBy: req.user._id,
      verified: true
    });

    request.status = 'COMPLETED';

    await request.save();

    res.json({
      request,
      document
    });
  } catch (err) {
    next(err);
  }
};

exports.rejectRequest = async (req, res, next) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        message: 'Rejection reason is required'
      });
    }

    const request = await Request.findOne({
      requestId: req.params.id
    });

    if (!request) {
      return res.status(404).json({
        message: 'Request not found'
      });
    }

    request.status = 'REJECTED';
    request.remarks = reason;
    request.reviewedBy = req.user._id;

    await request.save();

    res.json(request);
  } catch (err) {
    next(err);
  }
};

exports.markUnderReview = async (req, res, next) => {
  try {
    const request = await Request.findOne({
      requestId: req.params.id
    });

    if (!request) {
      return res.status(404).json({
        message: 'Request not found'
      });
    }

    request.status = 'UNDER_REVIEW';
    request.reviewedBy = req.user._id;

    await request.save();

    res.json(request);
  } catch (err) {
    next(err);
  }
};

exports.getRequestById = async (req, res, next) => {
  try {
    const request = await Request.findOne({
      requestId: req.params.id
    }).populate({
      path: 'student',
      populate: {
        path: 'user',
        select: 'name email'
      }
    });

    if (!request) {
      return res.status(404).json({
        message: 'Request not found'
      });
    }

    res.json(request);
  } catch (err) {
    next(err);
  }
};

