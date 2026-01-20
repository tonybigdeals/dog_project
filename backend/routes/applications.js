const express = require('express');
const router = express.Router();
const {
    submitApplication,
    getAllApplications,
    getUserApplications,
    approveApplication,
    rejectApplication
} = require('../controllers/applicationsController');
const checkSupabase = require('../middleware/supabaseCheck');

// Submit adoption application
router.post('/', checkSupabase, submitApplication);

// Get all applications (for admin)
router.get('/', checkSupabase, getAllApplications);

// Get applications for a user
router.get('/:userId', checkSupabase, getUserApplications);

// Approve application
router.post('/:id/approve', checkSupabase, approveApplication);

// Reject application
router.post('/:id/reject', checkSupabase, rejectApplication);

module.exports = router;
