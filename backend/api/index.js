/**
 * Vercel Serverless Function 入口点
 * 所有 /api/* 请求会被路由到这里
 * 
 * 注意：Vercel 会自动去掉 /api 前缀，所以请求 /api/auth/login 
 * 到达这里时路径已经变成了 /auth/login
 */
const express = require('express');
const cors = require('cors');

// 导入路由
const authRoutes = require('../routes/auth');
const dogsRoutes = require('../routes/dogs');
const favoritesRoutes = require('../routes/favorites');
const applicationsRoutes = require('../routes/applications');
const messagesRoutes = require('../routes/messages');
const dogSubmissionsRoutes = require('../routes/dogSubmissions');
const uploadRoutes = require('../routes/upload');
const forumRoutes = require('../routes/forum');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes (注意：这里不需要 /api 前缀，因为 Vercel 已经去掉了)
// 每个路由文件内部已经包含了 checkSupabase 中间件
app.use('/auth', authRoutes);
app.use('/dogs', dogsRoutes);
app.use('/favorites', favoritesRoutes);
app.use('/applications', applicationsRoutes);
app.use('/messages', messagesRoutes);
app.use('/dog-submissions', dogSubmissionsRoutes);
app.use('/upload', uploadRoutes);
app.use('/forum', forumRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// 调试：捕获所有未匹配的路由
app.use((req, res, next) => {
    console.log(`[API] Unmatched route: ${req.method} ${req.path}`);
    res.status(404).json({ 
        error: 'Route not found', 
        method: req.method, 
        path: req.path,
        originalUrl: req.originalUrl
    });
});

// 导出为 Vercel serverless function handler
module.exports = app;
