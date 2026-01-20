/**
 * API 配置
 * 开发模式：使用 http://localhost:5001/api
 * 生产模式：使用相对路径 /api（支持前后端部署到同一域名）
 */
export const API_BASE_URL = import.meta.env.DEV 
    ? 'http://localhost:5001/api' 
    : '/api';
