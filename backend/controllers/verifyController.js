const Document = require('../models/Document');
const Request = require('../models/Request');

exports.verifyDocument = async (req, res, next) => {
  try {
    const { token } = req.params;
    const document = await Document.findOne({ verificationToken: token }).populate('request');
    if (!document) {
      return res.status(404).json({ verified: false, message: 'Document not found' });
    }

    const request = document.request;

    res.json({
      verified: true,
      documentId: document.documentId,
      documentType: request.documentType,
      issueDate: document.issueDate,
      status: 'VALID',
    });
  } catch (err) {
    next(err);
  }
};
