# 邃思 (SuisiThink)

深度思考，技术与人文。个人知识花园。

## 技术栈

| 层 | 技术 |
|----|------|
| 框架 | Next.js 16 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS v4 |
| 数据库 | PostgreSQL |
| ORM | Prisma 7 |
| 认证 | NextAuth.js v5 (Email) |
| 内容 | MDX / Markdown |
| 部署 | Vercel + Supabase |

## 快速开始

### 环境要求

- Node.js 18+
- Docker & Docker Compose
- npm

### 1. 克隆项目

```bash
git clone <repo-url>
cd suisi
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env`，填写必要的配置：

```env
DATABASE_URL="postgresql://suisi:suisi_dev_password@localhost:5432/suisi"
AUTH_SECRET="生成一个随机字符串"
AUTH_EMAIL_FROM="noreply@suisi.dev"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

> Email 魔法链接需要配置 SMTP。开发环境建议使用 [Resend](https://resend.com) 的免费额度。
> 配置后取消 `.env` 中 `EMAIL_SERVER_*` 的注释即可。

### 3. 启动 PostgreSQL

```bash
docker-compose up -d
```

这会启动：
- PostgreSQL (端口 5432)
- Adminer 数据库管理界面 (端口 8080)

### 4. 安装依赖 & 初始化数据库

```bash
npm install
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 6. 登录管理后台

1. 访问 http://localhost:3000/admin/login
2. 输入管理员邮箱 `admin@example.com`
3. 点击发送登录链接
4. 配置了 SMTP 后，邮件会发送到你的邮箱；未配置时，查看终端输出的 magic link

## 项目结构

```
suisi/
├── src/
│   ├── app/
│   │   ├── (main)/           # 访客页面
│   │   │   ├── page.tsx             # 首页
│   │   │   ├── blog/               # 文章
│   │   │   ├── projects/           # 项目
│   │   │   ├── categories/         # 分类
│   │   │   ├── tags/               # 标签
│   │   │   ├── search/             # 搜索
│   │   │   └── about/              # 关于
│   │   ├── (admin)/          # 管理后台
│   │   │   └── admin/
│   │   ├── api/              # API 路由
│   │   └── layout.tsx        # 根布局
│   ├── components/
│   │   ├── layout/           # Navbar, Footer
│   │   └── ui/               # PostCard, CommentSection, etc.
│   ├── lib/                  # 工具库
│   │   ├── prisma.ts         # Prisma 客户端
│   │   ├── auth.ts           # NextAuth 配置
│   │   ├── api-utils.ts      # API 辅助函数
│   │   ├── validations.ts    # Zod 校验
│   │   └── upload.ts         # 文件上传
│   └── middleware.ts         # 路由保护
├── prisma/
│   ├── schema.prisma         # 数据模型
│   └── seed.ts               # 种子脚本
├── public/uploads/           # 上传文件目录
├── docker-compose.yml        # 本地数据库
├── prisma.config.ts          # Prisma 配置
└── README.md
```

## 生产部署

### Vercel + Supabase

1. **创建 Supabase 项目**
   - 在 [supabase.com](https://supabase.com) 创建项目
   - 获取数据库连接字符串

2. **配置 Vercel 环境变量**
   - `DATABASE_URL` — Supabase 连接字符串
   - `AUTH_SECRET` — 随机密钥
   - `EMAIL_SERVER_HOST` — SMTP 服务器
   - `EMAIL_SERVER_PORT` — SMTP 端口
   - `EMAIL_SERVER_USER` — SMTP 用户名
   - `EMAIL_SERVER_PASSWORD` — SMTP 密码
   - `AUTH_EMAIL_FROM` — 发件邮箱
   - `NEXT_PUBLIC_SITE_URL` — 你的域名

3. **部署**
   - 将代码推送到 GitHub
   - 在 Vercel 中导入项目
   - Vercel 自动检测 Next.js 并配置构建设置

4. **运行数据库迁移**
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

### 图片存储

开发环境图片存储在 `public/uploads/`。生产环境建议切换到 S3 或 Cloudinary：
- 修改 `src/lib/upload.ts` 中的 `saveFile` 函数
- 设置 `UPLOAD_DRIVER=s3` 并配置对应的环境变量

## 命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run lint` | 运行 ESLint |
| `npx prisma studio` | 打开 Prisma 数据库管理界面 |
| `npx prisma migrate dev` | 创建并应用数据库迁移 |
| `npx prisma db seed` | 运行种子脚本 |
| `docker-compose up -d` | 启动 PostgreSQL |

## 许可证

MIT
