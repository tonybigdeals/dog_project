const express = require('express');
const router = express.Router();
const { uploadImage, uploadMiddleware } = require('../controllers/uploadController');
const checkSupabase = require('../middleware/supabaseCheck');

// Upload image
router.post('/image', checkSupabase, uploadMiddleware, uploadImage);

module.exports = router;
