const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const dogsRoutes = require('./routes/dogs');
const favoritesRoutes = require('./routes/favorites');
const applicationsRoutes = require('./routes/applications');
const messagesRoutes = require('./routes/messages');
const dogSubmissionsRoutes = require('./routes/dogSubmissions');
const uploadRoutes = require('./routes/upload');
const forumRoutes = require('./routes/forum');

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dogs', dogsRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/dog-submissions', dogSubmissionsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/forum', forumRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Vercel serverless 环境：只导出 app，不调用 app.listen()
// 本地开发环境：需要启动服务器
if (process.env.VERCEL !== '1') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

module.exports = app;