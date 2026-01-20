require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Supabase Setup
// Priority: Use service role key (bypasses RLS) > anon key (requires auth token)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY; // Fallback to SUPABASE_KEY for backward compatibility
let supabase = null;

if (supabaseUrl && supabaseUrl.trim() !== '') {
    // Prefer service role key (bypasses RLS, suitable for backend operations)
    if (supabaseServiceRoleKey && supabaseServiceRoleKey.trim() !== '') {
        supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });
        console.log("Supabase client initialized with SERVICE ROLE KEY (RLS bypassed).");
    } else if (supabaseAnonKey && supabaseAnonKey.trim() !== '') {
        supabase = createClient(supabaseUrl, supabaseAnonKey);
        console.log("Supabase client initialized with ANON KEY (RLS enforced - requires auth token).");
        console.warn("WARNING: Using anon key. For backend operations, consider using SUPABASE_SERVICE_ROLE_KEY.");
    } else {
        console.error("ERROR: SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY missing. Supabase client not initialized.");
    }
} else {
    console.error("ERROR: SUPABASE_URL missing. Supabase client not initialized.");
}

module.exports = {
    supabase,
    supabaseUrl,
    supabaseServiceRoleKey,
    supabaseAnonKey
};
