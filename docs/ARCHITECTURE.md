# Dog Project 项目架构分析

## 项目概述

这是一个**宠物领养平台**应用，采用类似 Tinder 的卡片滑动交互方式。项目采用前后端分离架构，支持用户浏览宠物、收藏、提交领养申请和管理后台审核等功能。

## 技术栈

### 前端技术栈

- **框架**: React 19.2.0
- **构建工具**: Vite 7.2.4
- **路由**: React Router DOM 7.12.0
- **样式**: Tailwind CSS 3.4.19
- **动画**: Framer Motion 12.26.2
- **图标**: Lucide React + Material Symbols (通过 Google Fonts)
- **工具库**: 
  - `clsx` - 条件类名合并
  - `tailwind-merge` - Tailwind 类名合并

### 后端技术栈

- **框架**: Express.js 5.2.1
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth
- **中间件**: 
  - `cors` - 跨域支持
  - `dotenv` - 环境变量管理

## 项目结构

```
dog_project/
├── backend/              # Express 后端服务
│   ├── index.js         # 主服务器文件，包含所有 API 路由
│   └── package.json
├── frontend/            # React 前端应用
│   ├── src/
│   │   ├── pages/       # 页面组件
│   │   ├── components/  # 可复用组件
│   │   ├── context/     # React Context 状态管理
│   │   └── main.jsx     # 应用入口
│   └── vite.config.js
└── supabase_schema.sql  # 数据库表结构定义
```

## 核心功能模块

### 1. 用户认证系统

- **位置**: `frontend/src/context/AuthContext.jsx`
- **功能**: 
  - 用户注册/登录
  - 本地存储用户状态
  - 提供全局认证状态
- **API 端点**:
  - `POST /api/auth/register` - 用户注册
  - `POST /api/auth/login` - 用户登录

### 2. 宠物数据管理

- **位置**: `frontend/src/context/DogContext.jsx`
- **功能**:
  - 获取宠物列表
  - 管理用户收藏
  - 提供全局宠物数据状态
- **API 端点**:
  - `GET /api/dogs` - 获取所有宠物
  - `GET /api/dogs/:id` - 获取特定宠物详情
  - `GET /api/favorites/:userId` - 获取用户收藏
  - `POST /api/favorites` - 切换收藏状态

### 3. 页面路由结构

- **路由配置**: `frontend/src/App.jsx`
- **主要页面**:
  - `/` - 首页（卡片滑动浏览）
  - `/pet/:id` - 宠物详情页
  - `/favorites` - 收藏列表
  - `/application/:id` - 领养申请表
  - `/messages` - 消息中心
  - `/profile` - 个人中心
  - `/admin` - 后台管理（申请审核）
  - `/add` - 添加宠物（SelectDog）
  - `/login` - 登录页
  - `/register` - 注册页

### 4. 领养申请系统

- **位置**: `frontend/src/pages/Application.jsx`
- **功能**: 多步骤表单提交领养申请
- **API 端点**:
  - `POST /api/applications` - 提交申请
  - `GET /api/applications` - 获取所有申请（管理员）
  - `POST /api/applications/:id/approve` - 审核通过
  - `POST /api/applications/:id/reject` - 拒绝申请

### 5. 消息通知系统

- **功能**: 系统通知（申请审核结果）
- **API 端点**:
  - `GET /api/messages/:userId` - 获取用户消息

## 数据流架构

### 前端数据流

```
用户操作 
  ↓
页面组件 (Pages)
  ↓
Context (AuthContext/DogContext)
  ↓
API 调用 (fetch)
  ↓
后端 Express 服务器
  ↓
Supabase 数据库
```

### 状态管理

- **AuthContext**: 管理用户认证状态（登录/登出）
- **DogContext**: 管理宠物数据和收藏状态
- **本地存储**: 使用 `localStorage` 持久化用户信息

## 数据库设计

### 核心表结构（Supabase）

1. **profiles** - 用户资料表
2. **dogs** - 宠物信息表
3. **favorites** - 收藏关系表
4. **applications** - 领养申请表
5. **messages** - 消息通知表

详细表结构见 `supabase_schema.sql`

## 后端 API 设计

### API 基础路径

- 开发环境: `http://localhost:5001/api`

### 路由分组

1. **认证路由** (`/api/auth/*`)
   - 注册、登录

2. **宠物路由** (`/api/dogs/*`)
   - 获取列表、详情

3. **收藏路由** (`/api/favorites/*`)
   - 查询、切换收藏

4. **申请路由** (`/api/applications/*`)
   - 提交、查询、审核

5. **消息路由** (`/api/messages/*`)
   - 查询用户消息

### Mock 模式

当 Supabase 配置缺失时，后端自动切换到 Mock 模式，使用内存数据：

- `MOCK_USERS` - 模拟用户数据
- `MOCK_DOGS` - 模拟宠物数据
- `MOCK_APPLICATIONS` - 模拟申请数据
- `MOCK_MESSAGES` - 模拟消息数据

## UI/UX 特性

### 设计系统

- **主色调**: 暖米色 (`#D0BB95`)
- **辅助色**: 鼠尾草绿 (`#70BF8E`)
- **支持暗色模式**: 通过 Tailwind `dark:` 类实现

### 核心交互

1. **卡片滑动**: 首页使用 Framer Motion 实现卡片滑动动画
2. **底部导航**: 固定底部导航栏，支持快速切换
3. **响应式设计**: 最大宽度 430px，适配移动端

## 开发环境配置

### 前端启动

```bash
cd frontend
npm install
npm run dev  # 开发服务器（默认端口 5173）
```

### 后端启动

```bash
cd backend
npm install
npm run dev  # 使用 nodemon 热重载（默认端口 5001）
```

### 环境变量（后端）

需要创建 `.env` 文件：

```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # 推荐：绕过 RLS，适合后端服务
SUPABASE_ANON_KEY=your_anon_key                   # 备选：需要传递 auth token
# 或者使用旧的配置（向后兼容）
SUPABASE_KEY=your_supabase_key                    # 如果未设置 SERVICE_ROLE_KEY，将作为 ANON_KEY 使用
PORT=5001
```

**重要说明**：
- **推荐使用 `SUPABASE_SERVICE_ROLE_KEY`**：这是后端服务的推荐配置，可以绕过 Row Level Security (RLS) 限制，适合执行管理员操作
- 如果使用 `SUPABASE_ANON_KEY` 或 `SUPABASE_KEY`：需要在前端请求中传递 JWT token（通过 Authorization header），后端会使用该 token 创建带认证上下文的客户端
- Service Role Key 可以在 Supabase Dashboard 的 Settings > API 中找到

## 关键文件说明

### 后端核心文件

- `backend/index.js` - Express 服务器主文件，包含所有路由逻辑

### 前端核心文件

- `frontend/src/App.jsx` - 应用根组件，路由配置
- `frontend/src/context/AuthContext.jsx` - 认证状态管理
- `frontend/src/context/DogContext.jsx` - 宠物数据状态管理
- `frontend/src/pages/Home.jsx` - 首页卡片滑动实现
- `frontend/src/components/BottomNav.jsx` - 底部导航组件

## 安全特性

1. **路由保护**: 使用 `PrivateRoute` 组件保护需要登录的页面
2. **Row Level Security**: Supabase 数据库启用 RLS 策略
3. **CORS 配置**: 后端配置了 CORS 中间件

## 待优化点

1. **错误处理**: 前端缺少统一的错误处理机制
2. **加载状态**: 部分页面缺少加载状态提示
3. **API 错误响应**: 需要统一 API 错误响应格式
4. **类型安全**: 前端使用 JSX，可考虑迁移到 TypeScript
5. **测试覆盖**: 缺少单元测试和集成测试

## 数据流示例

### 用户登录流程

```
用户输入邮箱密码
  ↓
Login 页面调用 AuthContext.login()
  ↓
发送 POST /api/auth/login
  ↓
后端验证（Supabase Auth 或 Mock）
  ↓
返回用户数据
  ↓
保存到 localStorage
  ↓
更新 AuthContext 状态
  ↓
重定向到首页
```

### 收藏宠物流程

```
用户在首页点击收藏按钮
  ↓
Home 组件调用 DogContext.toggleFavorite()
  ↓
发送 POST /api/favorites
  ↓
后端更新数据库（或 Mock 数据）
  ↓
返回操作结果
  ↓
更新 DogContext 中的 favoriteIds
  ↓
UI 自动更新（React 响应式）
```
