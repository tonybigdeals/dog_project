const express = require('express');
const router = express.Router();
const { getAllDogs, getDogById } = require('../controllers/dogsController');
const checkSupabase = require('../middleware/supabaseCheck');

// Get all dogs
router.get('/', checkSupabase, getAllDogs);

// Get specific dog details
router.get('/:id', checkSupabase, getDogById);

module.exports = router;
