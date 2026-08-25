const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/auth');
const {
  getAllRequests,
  getSummary,
  approveRequest,
  rejectRequest,
  markUnderReview,
} = require('../controllers/adminController');

router.use(protect, requireRole('admin', 'faculty'));

router.get('/requests', getAllRequests);
router.get('/summary', getSummary);
router.patch('/requests/:id/review', markUnderReview);
router.patch('/requests/:id/approve', approveRequest);
router.patch('/requests/:id/reject', rejectRequest);

module.exports = router;
