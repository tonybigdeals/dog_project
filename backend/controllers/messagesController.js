const { supabase } = require('../config/supabase');

/**
 * Get messages for a user
 */
async function getUserMessages(req, res) {
    const { userId } = req.params;

    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
}

module.exports = {
    getUserMessages
};
