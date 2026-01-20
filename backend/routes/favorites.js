const express = require('express');
const router = express.Router();
const { getUserFavorites, toggleFavorite } = require('../controllers/favoritesController');
const checkSupabase = require('../middleware/supabaseCheck');

// Get favorites for a user
router.get('/:userId', checkSupabase, getUserFavorites);

// Toggle favorite (add or remove)
router.post('/', checkSupabase, toggleFavorite);

module.exports = router;
