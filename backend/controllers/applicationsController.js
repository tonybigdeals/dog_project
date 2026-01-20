const { supabase } = require('../config/supabase');
const { getSupabaseClient } = require('../utils/supabaseClient');

/**
 * Submit adoption application
 */
async function submitApplication(req, res) {
    const { userId, dogId, fullName, phone, address, hasPets, housingType } = req.body;

    // Use getSupabaseClient to get client with proper auth context
    // If using service role key, this bypasses RLS
    // If using anon key, this includes auth token from request header
    const client = getSupabaseClient(req);
    
    const { data, error } = await client
        .from('applications')
        .insert([{
            user_id: userId,
            dog_id: dogId,
            full_name: fullName,
            phone: phone,
            address: address,
            has_pets: hasPets,
            housing_type: housingType,
            status: 'pending'
        }]);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Application submitted successfully', data });
}

/**
 * Get all applications (for admin)
 */
async function getAllApplications(req, res) {
    const { data, error } = await supabase
        .from('applications')
        .select('*, dogs(name)')
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    // Flatten dog name for easier access
    const formattedData = data.map(app => ({
        ...app,
        dog_name: app.dogs?.name || '未知'
    }));

    res.json(formattedData);
}

/**
 * Get applications for a specific user
 */
async function getUserApplications(req, res) {
    const { userId } = req.params;
    const client = getSupabaseClient(req);
    
    const { data, error } = await client
        .from('applications')
        .select('*, dogs(name)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
}

/**
 * Approve application
 */
async function approveApplication(req, res) {
    const { id } = req.params;
    const { userId, dogName } = req.body;

    // Update application status
    const { error: updateError } = await supabase
        .from('applications')
        .update({ status: 'approved' })
        .eq('id', id);

    if (updateError) return res.status(500).json({ error: updateError.message });

    // Send notification message
    const { error: messageError } = await supabase
        .from('messages')
        .insert([{
            user_id: userId,
            sender_name: '系统通知',
            content: `恭喜！您申请领养 ${dogName} 的申请已通过审核。请尽快联系我们安排见面时间。`,
            is_unread: true
        }]);

    if (messageError) console.error('Failed to send notification:', messageError);

    res.json({ message: 'Application approved and notification sent' });
}

/**
 * Reject application
 */
async function rejectApplication(req, res) {
    const { id } = req.params;
    const { userId, dogName } = req.body;

    // Update application status
    const { error: updateError } = await supabase
        .from('applications')
        .update({ status: 'rejected' })
        .eq('id', id);

    if (updateError) return res.status(500).json({ error: updateError.message });

    // Send notification message
    const { error: messageError } = await supabase
        .from('messages')
        .insert([{
            user_id: userId,
            sender_name: '系统通知',
            content: `很抱歉，您申请领养 ${dogName} 的申请未通过审核。如有疑问请联系我们。`,
            is_unread: true
        }]);

    if (messageError) console.error('Failed to send notification:', messageError);

    res.json({ message: 'Application rejected and notification sent' });
}

module.exports = {
    submitApplication,
    getAllApplications,
    getUserApplications,
    approveApplication,
    rejectApplication
};
