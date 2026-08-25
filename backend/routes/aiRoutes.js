const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/auth');
const {
  validateRequest,
  generateRecommendation,
  saveRecommendationDraft,
} = require('../controllers/aiController');

router.post('/validate', protect, requireRole('admin', 'faculty'), validateRequest);
router.post('/recommendation/generate', protect, requireRole('admin', 'faculty'), generateRecommendation);
router.patch('/recommendation/draft', protect, requireRole('admin', 'faculty'), saveRecommendationDraft);

module.exports = router;
