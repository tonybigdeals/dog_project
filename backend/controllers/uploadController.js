const multer = require('multer');
const { supabase, supabaseUrl } = require('../config/supabase');
const path = require('path');
const crypto = require('crypto');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only image files
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('只支持图片文件 (jpeg, jpg, png, gif, webp)'));
        }
    }
});

// Multer middleware
const uploadMiddleware = upload.single('image');

/**
 * Upload image to Supabase Storage
 */
async function uploadImage(req, res) {
    if (!req.file) {
        return res.status(400).json({ error: '没有上传文件' });
    }

    try {
        // Generate unique filename
        const fileExt = path.extname(req.file.originalname);
        const fileName = `${crypto.randomBytes(16).toString('hex')}${fileExt}`;
        const filePath = `dog-images/${fileName}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('dog-images')
            .upload(filePath, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: false
            });

        if (error) {
            console.error('Supabase upload error:', error);
            return res.status(500).json({ error: '图片上传失败: ' + error.message });
        }

        // Get public URL
        // getPublicUrl returns { data: { publicUrl: '...' } }
        const { data: urlData } = supabase.storage
            .from('dog-images')
            .getPublicUrl(filePath);

        // Extract the public URL
        const publicUrl = urlData?.publicUrl || urlData;
        
        if (!publicUrl) {
            console.error('Failed to get public URL:', urlData);
            return res.status(500).json({ error: '无法获取图片公开链接' });
        }

        // Return URL in similar format to Google's
        // Format: https://[supabase-url]/storage/v1/object/public/dog-images/[filename]
        // We'll return the public URL which Supabase provides
        res.json({ 
            url: publicUrl,
            message: '图片上传成功'
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: '图片上传失败: ' + error.message });
    }
}

module.exports = {
    uploadImage,
    uploadMiddleware
};
