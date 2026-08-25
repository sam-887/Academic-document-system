const express = require('express');
const router = express.Router();
const { verifyDocument } = require('../controllers/verifyController');

router.get('/:token', verifyDocument);

module.exports = router;
