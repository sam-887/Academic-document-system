const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createRequest,
  getMyRequests,
  getRequestById,
  getDashboardSummary,
  getDocumentForRequest,
} = require('../controllers/requestController');

router.post('/', protect, requireRole('student'), upload.array('attachments', 3), createRequest);
router.get('/', protect, requireRole('student'), getMyRequests);
router.get('/dashboard/summary', protect, requireRole('student'), getDashboardSummary);
router.get('/:id', protect, getRequestById);
router.get('/:id/document', protect, getDocumentForRequest);

module.exports = router;
