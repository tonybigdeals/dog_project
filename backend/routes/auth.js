const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const checkSupabase = require('../middleware/supabaseCheck');

// Register
router.post('/register', checkSupabase, register);

// Login
router.post('/login', checkSupabase, login);

module.exports = router;
