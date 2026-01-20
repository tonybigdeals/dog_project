const express = require('express');
const router = express.Router();
const {
    submitDogSubmission,
    getAllSubmissions,
    approveSubmission,
    rejectSubmission
} = require('../controllers/dogSubmissionsController');
const checkSupabase = require('../middleware/supabaseCheck');

// Submit dog submission
router.post('/', checkSupabase, submitDogSubmission);

// Get all submissions (for admin)
router.get('/', checkSupabase, getAllSubmissions);

// Approve submission
router.post('/:id/approve', checkSupabase, approveSubmission);

// Reject submission
router.post('/:id/reject', checkSupabase, rejectSubmission);

module.exports = router;
