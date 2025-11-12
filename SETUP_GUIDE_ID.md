# Setup & Installation Guide - AI Image Studio Pro (Free Version)

> **Versi:** 2.0 (Free Forever + PWA)
> **Last Updated:** 2025-01-12
> **Platform:** Web-based + PWA - Works on any device with browser!

## 🎯 Quick Start (5 Minutes Setup)

### System Requirements (Minimal)
- **Browser:** Any modern browser (Chrome, Firefox, Safari, Edge)
- **Internet:** Connection for initial setup
- **Device:** Phone, tablet, laptop, desktop - anything works!

### One-Click Deployment (Recommended)
**No local setup required!**

1. **Click the button below:**
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aimastermebjm-byte/ai-image-studio-pro)

2. **Add your Gemini API Key:**
   - Get your FREE API key: [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Enter: `AIzaSyBF10AXp7nmjFMCQoAWDAzomgWEuJPhW2Y`

3. **Deploy!** ⏱️ Takes 2 minutes max

4. **Install as PWA:** 📱 Tap "Add to Home Screen" on mobile

**That's it!** 🎉 Your AI Image Studio is ready to use.

---

## 🛠 Local Development (Optional)

### Prerequisites (Simple)
- **Node.js 18+** (for local development only)
- **GitHub Account** (for deployment)

#### 1. Node.js (Only for Local Development)
**Quick Install:**
- Download from [nodejs.org](https://nodejs.org)
- Or use package manager: `brew install node@20`

#### 2. Git (For Code Management)
**Quick Install:**
- Download from [git-scm.com](https://git-scm.com)
- Or use: `brew install git`

## 🛠 Local Development Setup (Optional)

### 1. Clone Repository
```bash
git clone https://github.com/aimastermebjm-byte/ai-image-studio-pro.git
cd ai-image-studio-pro
```

### 2. Install Dependencies
```bash
# Install dependencies
npm install

# Or use pnpm (faster)
npm install -g pnpm
pnpm install
```

### 3. Environment Setup (Super Simple)
```bash
# Copy environment template
cp .env.example .env.local

# Edit with your API key
```

### 4. Start Local Development
```bash
# Start development server
npm run dev

# Or with pnpm
pnpm dev
```

### 5. Verify Installation
- **Frontend:** Buka [http://localhost:3000](http://localhost:3000)
- **PWA Test:** Check console for PWA compatibility

---

## 🔧 Environment Configuration (FREE)

### Setup Requirements (Just One API Key!)

#### Frontend Environment (.env.local)
```env
# Gemini API Configuration (REQUIRED)
NEXT_PUBLIC_GEMINI_API_URL=https://generativelanguage.googleapis.com
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyBF10AXp7nmjFMCQoAWDAzomgWEuJPhW2Y

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="AI Image Studio Pro"
NEXT_PUBLIC_APP_DESCRIPTION="Free AI Image Generator"

# PWA Configuration
NEXT_PUBLIC_PWA_ENABLED=true
NEXT_PUBLIC_OFFLINE_SUPPORTED=true

# Feature Flags
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

#### Backend Environment (.env.local)
```env
# Gemini API (Your Key - REQUIRED)
GEMINI_API_KEY=AIzaSyBF10AXp7nmjFMCQoAWDAzomgWEuJPhW2Y
GEMINI_API_URL=https://generativelanguage.googleapis.com

# Supabase (Auto-setup saat deploy)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_key

# Authentication (Simple)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_jwt_key_minimum_32_chars

# Development
NODE_ENV=development
```

## 📁 Project Setup Details

### Environment Configuration

#### Frontend Environment (.env.local)
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000/ws

# Gemini API Configuration
NEXT_PUBLIC_GEMINI_API_URL=https://generativelanguage.googleapis.com

# Third-party Services
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_BETA_FEATURES=false
NEXT_PUBLIC_DEBUG_MODE=false
```

#### Backend Environment (.env.local)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ai_image_studio"

# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_API_URL=https://generativelanguage.googleapis.com

# Redis
REDIS_URL=redis://localhost:6379

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_jwt_key_here_at_least_32_characters_long

# Email Service (SendGrid)
EMAIL_FROM=noreply@ai-image-studio.com
EMAIL_SERVER_HOST=smtp.sendgrid.net
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=apikey
EMAIL_SERVER_PASSWORD=your_sendgrid_api_key

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# AWS S3 (untuk image storage)
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-image-storage-bucket

# OpenAI (untuk content moderation)
OPENAI_API_KEY=sk-your_openai_api_key

# Monitoring
SENTRY_DSN=your_sentry_dsn_here
LOG_LEVEL=info
```

### Database Setup

#### PostgreSQL Configuration
```bash
# Connect ke PostgreSQL
psql -U postgres

# Create database user (optional)
CREATE USER ai_image_user WITH PASSWORD 'secure_password';
CREATE DATABASE ai_image_studio OWNER ai_image_user;

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ai_image_studio TO ai_image_user;

# Exit psql
\q

# Test connection
psql -U ai_image_user -d ai_image_studio -h localhost
```

#### Database Schema
```sql
-- Main tables (auto-created by Prisma migrations)
users
generated_images
style_templates
collections
user_settings
usage_logs

-- Indexes untuk performance
CREATE INDEX CONCURRENTLY idx_images_user_created_at
ON generated_images(user_id, created_at DESC);

CREATE INDEX CONCURRENTLY idx_images_public_created_at
ON generated_images(is_public, created_at DESC);

-- Full-text search index
CREATE INDEX CONCURRENTLY idx_images_search
ON generated_images USING GIN(to_tsvector('english', prompt || ' ' || COALESCE(negative_prompt, '') || ' ' || COALESCE(array_to_string(tags, ' '), '')));
```

#### Redis Configuration
```bash
# Edit Redis configuration
sudo nano /etc/redis/redis.conf

# Key settings:
maxmemory 1gb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000

# Restart Redis
sudo systemctl restart redis
```

## 🔧 Development Tools Setup

### VS Code Extensions
Install recommended extensions untuk optimal development:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-json",
    "prisma.prisma",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-git-graph",
    "ms-vscode-remote.remote-containers",
    "ms-vscode.vscode-docker"
  ]
}
```

### VS Code Settings
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.includeLanguages": [
    "typescript",
    "typescriptreact",
    "javascript",
    "javascriptreact"
  ],
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "**/node_modules": true,
    "**/dist": true,
    "**/build": true
  }
}
```

### Git Hooks Setup
```json
// package.json
{
  "scripts": {
    "prepare": "husky install",
    "lint": "next lint --max-warnings 0",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write"
    ]
  }
}
```

### Husky Hooks
```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint-staged

# .husky/pre-push
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm type-check && pnpm test
```

## 🧪 Testing Setup

### Testing Framework Configuration

#### Jest Configuration
```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

#### Playwright Configuration
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Testing Commands
```bash
# Run unit tests
pnpm test

# Run tests dengan coverage
pnpm test:coverage

# Run tests dalam watch mode
pnpm test:watch

# Run E2E tests
pnpm test:e2e

# Run specific test file
pnpm test tests/components/Button.test.tsx

# Debug tests
pnpm test:debug
```

## 🚀 Build & Deployment

### Development Build
```bash
# Type checking
pnpm type-check

# Linting
pnpm lint

# Build untuk development
pnpm build:dev

# Start development build
pnpm start:dev
```

### Production Build
```bash
# Build untuk production
pnpm build

# Start production server
pnpm start

# Build dengan analysis
pnpm build:analyze

# Check build size
pnpm build:size
```

### Environment Variables untuk Production
```env
# Production .env
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
DATABASE_URL=postgresql://user:pass@host:5432/ai_image_studio_prod
GEMINI_API_KEY=production_key
STRIPE_SECRET_KEY=sk_live_your_stripe_key
AWS_S3_BUCKET=your-production-bucket
SENTRY_DSN=production_sentry_dsn
```

## 📦 Package Management

### Project Dependencies
```json
{
  "dependencies": {
    // Core frameworks
    "next": "^15.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.7.0",

    // Backend
    "express": "^5.0.0",
    "@prisma/client": "^5.8.0",
    "prisma": "^5.8.0",

    // Authentication & Security
    "next-auth": "^5.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",

    // Database & Caching
    "redis": "^4.7.0",
    "bull": "^4.12.0",

    // Image Processing
    "sharp": "^0.33.0",
    "konva": "^9.3.0",

    // UI & Styling
    "@radix-ui/react-*/": "latest",
    "framer-motion": "^11.0.0",
    "tailwindcss": "^4.0.0",

    // State Management
    "zustand": "^5.0.0",
    "react-hook-form": "^7.51.0",
    "zod": "^3.5.0",

    // External Services
    "@google/generative-ai": "^0.2.0",
    "stripe": "^14.18.0",
    "aws-sdk": "^2.1690.0"
  },

  "devDependencies": {
    // Development tools
    "@types/*": "latest",
    "eslint": "^8.57.0",
    "prettier": "^3.2.0",
    "husky": "^8.0.0",
    "lint-staged": "^15.2.0",

    // Testing
    "jest": "^30.0.0",
    "@testing-library/react": "^14.3.0",
    "@testing-library/jest-dom": "^6.5.0",
    "playwright": "^2.0.0",

    // Build tools
    "@next/bundle-analyzer": "^14.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

### Common Package Management Commands
```bash
# Install dependencies
pnpm install

# Add new package
pnpm add package-name

# Add dev package
pnpm add -D package-name

# Update dependencies
pnpm update

# Check for outdated packages
pnpm outdated

# Clean node_modules
pnpm clean
```

## 🔧 Development Workflow

### 1. Environment Setup
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

### 2. Development Cycle
```bash
# Make changes

# Run tests
pnpm test

# Type checking
pnpm type-check

# Linting
pnpm lint:fix

# Build check
pnpm build

# Commit changes
git add .
git commit -m "feat: add your feature"

# Push branch
git push origin feature/your-feature-name
```

### 3. Pull Request Process
```bash
# Create pull request on GitHub

# Wait for CI/CD checks
# Request code review
# Address feedback
# Merge to main
```

## 🚀 Deployment

### Local Deployment
```bash
# Build untuk production
pnpm build

# Start production server
pnpm start

# Check health endpoint
curl http://localhost:3000/api/health
```

### Docker Deployment
```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
CMD ["node", "server.js"]
```

```bash
# Docker Compose
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/ai_image_studio
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=ai_image_studio
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### Deployment Commands
```bash
# Build Docker image
docker build -t ai-image-studio .

# Run dengan Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Port Already in Use
**Error:** `Error: listen EADDRINUSE :::3000`

**Solution:**
```bash
# Find process using port
netstat -tulpn | grep :3000
# or on Windows
netstat -ano | findstr :3000

# Kill process
sudo kill -9 <PID>
# or on Windows
taskkill /PID <PID> /F
```

#### 2. Database Connection Failed
**Error:** `ECONNREFUSED 127.0.0.1:5432`

**Solution:**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Check connection
psql -U postgres -h localhost
```

#### 3. Module Not Found
**Error:** `Module not found: Can't resolve 'module-name'`

**Solution:**
```bash
# Clear npm cache
pnpm store prune

# Delete node_modules dan lock files
rm -rf node_modules pnpm-lock.yaml

# Reinstall dependencies
pnpm install
```

#### 4. Redis Connection Issues
**Error:** `Redis connection failed`

**Solution:**
```bash
# Check if Redis is running
redis-cli ping

# Start Redis
redis-server

# Check Redis configuration
redis-cli config get maxmemory
```

#### 5. TypeScript Errors
**Error:** `TypeScript compilation errors`

**Solution:**
```bash
# Check TypeScript version
pnpm list typescript

# Update TypeScript
pnpm add -D typescript@latest

# Clear TypeScript cache
rm -rf .next

# Rebuild
pnpm build
```

#### 6. API Key Issues
**Error:** `Invalid API key`

**Solution:**
```bash
# Verify API key in .env.local
echo $GEMINI_API_KEY

# Test API key dengan curl
curl -H "Authorization: Bearer $GEMINI_API_KEY" \
     "https://generativelanguage.googleapis.com/v1beta/models"
```

### Development Tips

#### 1. Performance Monitoring
```bash
# Monitor memory usage
npm run dev:profile

# Analyze bundle size
pnpm build:analyze

# Check network requests in browser dev tools
```

#### 2. Debug Setup
```bash
# Debug Next.js
NODE_OPTIONS='--inspect' pnpm dev

# Debug tests
pnpm test:debug
```

#### 3. Database Operations
```bash
# Reset database
pnpm prisma migrate reset

# Seed database
pnpm prisma db:seed

# View database
pnpm prisma studio
```

## 📞 Support & Resources

### Documentation
- **API Documentation:** [API_DOCS_ID.md](./API_DOCS.md)
- **Architecture:** [ARCHITECTURE_ID.md](./ARCHITECTURE.md)
- **Tech Stack:** [TECH_STACK_ID.md](./TECH_STACK_ID.md)
- **Requirements:** [REQUIREMENTS_ID.md](./REQUIREMENTS_ID.md)

### Getting Help
- **GitHub Issues:** [Report a problem](https://github.com/your-username/ai-image-studio-pro/issues)
- **Discord:** [Join our community](https://discord.gg/your-server)
- **Email:** support@ai-image-studio.com

### Additional Resources
- **Prisma Documentation:** [prisma.io](https://prisma.io)
- **Next.js Documentation:** [nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind CSS:** [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Redis:** [redis.io/documentation](https://redis.io/documentation)

## 🎉 You're All Set!

### Quick Verification Checklist:
- [ ] ✅ PWA installed on device
- [ ] ✅ Gemini API key working
- [ ] ✅ Can generate first image
- [ ] ✅ Images saved to gallery
- [ ] ✅ Offline mode working

### 📱 PWA Installation Guide:
1. **Mobile:** Open app → Tap menu → "Add to Home Screen"
2. **Desktop:** Chrome → Click icon → "Install App"
3. **Benefits:** Works offline, native feel, instant launch

### 🚀 Next Steps:
1. **Generate your first AI image**
2. **Explore 20+ free templates**
3. **Try offline mode** (disconnect internet)
4. **Share your creations** (no watermark!)

---

## 🆘 Need Help?

### Free Support Channels:
- **GitHub Issues:** [Report problems](https://github.com/aimastermebjm-byte/ai-image-studio-pro/issues)
- **GitHub Discussions:** [Ask questions](https://github.com/aimastermebjm-byte/ai-image-studio-pro/discussions)
- **Documentation:** [All guides](https://github.com/aimastermebjm-byte/ai-image-studio-pro/tree/main/docs)

### Community Resources:
- **Tutorials:** [YouTube playlist](https://youtube.com/playlist)
- **Examples:** [GitHub examples](https://github.com/aimastermebjm-byte/ai-image-studio-pro/tree/main/examples)
- **Templates:** [Free templates repo](https://github.com/aimastermebjm-byte/ai-image-studio-pro-templates)

---

**🌟 Free Forever - No Hidden Costs - Community Powered**

**Document version:** 2.0 (Free Forever)
**Last updated:** 2025-01-12
**GitHub:** https://github.com/aimastermebjm-byte/ai-image-studio-pro

**Made with ❤️ for the free AI community**