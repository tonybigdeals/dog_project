const express = require('express');
const router = express.Router();
const { getUserMessages } = require('../controllers/messagesController');
const checkSupabase = require('../middleware/supabaseCheck');

// Get messages for a user
router.get('/:userId', checkSupabase, getUserMessages);

module.exports = router;
