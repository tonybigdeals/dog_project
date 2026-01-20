const { createClient } = require('@supabase/supabase-js');
const { supabase, supabaseUrl, supabaseServiceRoleKey, supabaseAnonKey } = require('../config/supabase');

/**
 * Get Supabase client with optional auth token
 * If using service role key, returns the main client (bypasses RLS)
 * If using anon key, creates a client with auth token from request
 * @param {Object} req - Express request object (optional)
 * @returns {Object} Supabase client instance
 */
function getSupabaseClient(req = null) {
    // If using service role key, return main client (bypasses RLS)
    if (supabaseServiceRoleKey && supabaseServiceRoleKey.trim() !== '') {
        return supabase;
    }
    
    // If using anon key and request has auth token, create authenticated client
    if (supabase && req && supabaseUrl && supabaseAnonKey) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            // Create a new client with the auth token
            const authenticatedClient = createClient(supabaseUrl, supabaseAnonKey, {
                global: {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                },
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            });
            // Set the session token
            authenticatedClient.auth.setSession({
                access_token: token,
                refresh_token: ''
            }).catch(() => {
                // Ignore errors if token is invalid
            });
            return authenticatedClient;
        }
    }
    
    // Return main client (may not have auth context)
    return supabase;
}

module.exports = {
    getSupabaseClient,
    supabase
};
