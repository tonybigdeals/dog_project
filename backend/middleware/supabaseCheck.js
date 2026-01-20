const { supabase } = require('../config/supabase');

/**
 * Middleware to check if Supabase client is initialized
 * Returns 500 error if Supabase is not configured
 */
function checkSupabase(req, res, next) {
    if (!supabase) {
        return res.status(500).json({ 
            error: 'Supabase client not initialized. Please check your environment variables.' 
        });
    }
    next();
}

module.exports = checkSupabase;
