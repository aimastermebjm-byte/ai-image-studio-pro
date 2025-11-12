# Technology Stack - AI Image Studio Pro (Free Version)

> **Version:** 2.0 (Free Forever + PWA)
> **Last Updated:** 2025-01-12
> **Philosophy:** 100% Free Services + PWA First

## 🏗 Overview Arsitektur Sistem (Free Stack)

### High-Level Architecture (Free Services)
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   PWA Layer     │    │   Vercel Edge   │
│   (Next.js 15)  │◄──►│  (Service Worker)│◄──►│   (Free Tier)   │
│   (Serverless)  │    │   (Manifest)    │    │   (Global CDN)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   API Layer     │
                    │  (API Routes)    │
                    │   (Edge Func)    │
                    └─────────────────┘
                              │
                    ┌─────────┼─────────┐
                    ▼         ▼         ▼
            ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
            │   Gemini    │ │ Supabase DB │ │Supabase Stor │
            │   API       │ │ (PostgreSQL)│ │  (1GB Free)   │
            │ (Your Key)  │ │ (Free Tier)  │ │   (CDN Inc)   │
            └─────────────┘ └─────────────┘ └─────────────┘
```

### Filosofi Teknologi (Free Version)
- **Free-First Strategy:** 100% free services, zero operational costs
- **PWA Native Experience:** Installable app dengan offline capability
- **Performance First:** Generasi gambar sub-5 detik
- **Developer Experience:** TypeScript everywhere, DX yang mantap
- **Scalable Free:** Dibuat untuk 500+ concurrent users pada free tier
- **Community Driven:** Open source dengan GitHub contributions

## 🎨 Frontend Stack (Free & PWA Optimized)

### Framework Inti
**Next.js 15.2** dengan App Router - Serverless PWA Ready

**Kenapa Next.js 15 (Free Tier):**
- **Performance:** 47% bundle size lebih cepat
- **Turbopack:** 10x lebih cepat build dan refreshes
- **App Router:** Optimized untuk PWA navigation
- **Server Components:** Mengurangi client-side JavaScript
- **Edge Runtime:** Perfect untuk Vercel free tier
- **PWA Support:** Built-in PWA capabilities

**Fitur PWA yang Digunakan:**
- App Router untuk offline navigation
- Server Actions untuk API calls
- Streaming UI untuk real-time generation progress
- Image Optimization untuk offline gallery
- Route Handlers untuk serverless API

### Language & Type Safety
**TypeScript 5.7** - Strict mode enabled

**Konfigurasi (Free Optimized):**
- Strict TypeScript configuration
- Path aliases (`@/components`, `@/lib`)
- Type-safe API routes dengan Zod validation
- End-to-end type safety dengan Supabase

### Styling & Design System
**Tailwind CSS 4.0** - JIT compilation untuk bundle kecil

**Kenapa Tailwind (Free Friendly):**
- **Bundle Size:** Optimal untuk Vercel free tier
- **Performance:** JIT compilation reduces CSS size
- **Mobile-First:** Perfect untuk PWA mobile experience
- **Dark Mode:** Built-in support
- **No Build Step Complexity:** Simpler setup

**PWA Design System:**
- PWA-optimized color palette
- Touch-friendly interaction patterns
- Offline-friendly loading states
- System font stack untuk consistent experience

### UI Components & PWA
**Radix UI 2.0** + **Native Web APIs**

**Komponen Library (Free Focus):**
- **Radix UI:** Headless, accessible components
  - Dialogs, modals, tooltips
  - Install prompts, offline indicators
  - Forms dengan validation
- **PWA APIs:** Native capabilities
  - Install Prompt API
  - Background Sync API
  - Share Target API
  - Screen Wake Lock API

### State Management
**Zustand 5.0** - Ultra-lightweight state management

**Kenapa Zustand (Free Optimized):**
- **Bundle Size:** <3kb (perfect untuk mobile)
- **Performance:** Minimal re-renders
- **TypeScript:** Full type safety
- **Simplicity:** Minimal boilerplate

**PWA State Structure:**
- User authentication state (simple)
- Image generation state + offline queue
- Gallery management (cached + cloud)
- PWA state (install status, connectivity)
- Rate limiting state

### Forms & Validation
**React Hook Form 7.0** + **Zod 3.5**

**Form Strategy (Mobile Optimized):**
- **Performance:** Optimized untuk mobile devices
- **Validation:** Client-first validation
- **Type Safety:** Zod schema inference
- **PWA:** Works offline with form caching

### Image Processing (Browser Native)
**Canvas API** + **Web APIs** - Zero dependency

**Browser Capabilities (Free):**
- Image cropping dan resizing
- Basic filters (Canvas 2D)
- Text overlay dengan custom fonts
- Real-time preview untuk mobile
- Image format conversion (PNG/JPG/WebP)
- **Cost:** 100% free, menggunakan browser capabilities

### Performance Optimization
**Optimasi Next.js 15:**
- Automatic image optimization (WebP, AVIF)
- Bundle analyzer integration
- Code splitting by routes
- Dynamic imports untuk heavy components
- Preloading untuk critical resources

## ⚙️ Backend Stack (Serverless & Free)

### Runtime & Framework
**Node.js 20** (Vercel Edge) + **Next.js API Routes** - Serverless PWA

**Kenapa Vercel Edge Functions:**
- **Cost:** 100% free tier dengan generous limits
- **Performance:** Global edge deployment
- **Auto-Scaling:** No server management needed
- **PWA Ready:** Edge functions perfect untuk PWA
- **Zero Maintenance:** No configuration required

**Next.js API Routes Configuration:**
- TypeScript support built-in
- Edge runtime optimization
- Built-in security middleware
- CORS dan headers management
- Simple rate limiting for free tier

### Database & ORM
**Supabase PostgreSQL** + **Supabase Client** - Free Auto-Managed

**Kenapa Supabase (Free Tier):**
- **Cost:** 100% free for development & small scale
- **Auto-Setup:** One-click database creation
- **Real-time:** Built-in WebSocket subscriptions
- **PostgreSQL:** Full PostgreSQL 15 features
- **Security:** Row-level security included
- **Auto-Backups:** Daily backups included

**Supabase Benefits:**
- **Type Safety:** Generated TypeScript clients
- **Migrations:** Database version control
- **Dashboard:** Built-in database management
- **Performance:** Optimized for free tier usage
- **Authentication:** Built-in auth system

### Database Schema (Free Version)
```sql
-- Users (Free tier only)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  generation_count_today INTEGER DEFAULT 0,
  generation_count_month INTEGER DEFAULT 0,
  last_generation_reset DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Generated images (simplified)
CREATE TABLE generated_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  prompt TEXT NOT NULL,
  style_template VARCHAR(100),
  image_url TEXT NOT NULL, -- Supabase Storage URL
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Style templates (free only)
CREATE TABLE style_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  parameters JSONB NOT NULL,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Authentication & Authorization
**NextAuth.js 5.0** + **Supabase Auth** - Simple & Free

**Kenapa PostgreSQL:**
- **Performance:** 20% lebih cepat dari PostgreSQL 14
- **JSON Support:** Native JSONB untuk flexible metadata
- **Full-Text Search:** Built-in search capabilities
- **ACID Compliance:** Reliable untuk financial transactions
- **Scalability:** Terbukti di scale

**Keuntungan Prisma ORM:**
- **Type Safety:** End-to-end type safety
- **Auto-Completion:** IDE support untuk database queries
- **Migrations:** Database schema management
- **Performance:** Optimized query generation
- **Developer Experience:** Excellent DX

### Database Schema Highlights
```sql
-- Users dengan subscription management
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  subscription_tier VARCHAR(20) DEFAULT 'free',
  credits_remaining INTEGER DEFAULT 50,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Generated images dengan metadata
CREATE TABLE generated_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  prompt TEXT NOT NULL,
  style_template VARCHAR(100),
  image_url TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Full-text search optimized
CREATE INDEX idx_images_search ON generated_images
USING GIN (to_tsvector('english', prompt || ' ' || COALESCE(style_template, '')));
```

### Authentication & Authorization
**NextAuth.js 5.0** (beta)

**Authentication Features:**
- **Multi-Provider:** Google, GitHub, Discord, Email
- **Session Management:** Secure JWT sessions
- **Role-Based Access:** User, Admin, Moderator roles
- **Security:** CSRF protection, session management
- **Database Integration:** PostgreSQL session storage

### File Storage & CDN
**AWS S3** + **CloudFront CDN**

**Storage Strategy:**
- **Original Images:** High-resolution storage
- **Thumbnails:** Multiple sizes digenerate
- **CDN Delivery:** Global edge caching
- **Lifecycle Policies:** Automatic old file cleanup
- **Cost Optimization:** Intelligent compression

**Konfigurasi:**
```javascript
const s3Config = {
  bucket: process.env.AWS_S3_BUCKET,
  region: 'us-east-1',
  signedUrlExpiry: 3600, // 1 jam
  thumbnailSizes: [150, 300, 800, 1920]
};
```

### Caching Strategy
**Redis 8.0** + **Memory Caching**

**Multi-Level Caching:**
- **L1:** In-memory cache (user sessions, frequent queries)
- **L2:** Redis cache (API responses, image metadata)
- **L3:** CDN cache (static assets, images)
- **Cache Invalidation:** Smart invalidation on data changes

**Cache Keys Strategy:**
```
user:{userId}:gallery -> Cache gallery user
image:{imageId}:metadata -> Cache metadata gambar
templates:active -> Cache template aktif
api:{endpoint}:{hash} -> Cache response API
```

### Queue System
**Bull Queue 4.0** + **Redis**

**Async Processing:**
- **Image Generation:** Queue generation requests
- **Email Sending:** Async email notifications
- **Thumbnail Generation:** Background processing
- **Analytics:** Async event processing
- **Cleanup:** Scheduled maintenance tasks

## 🤖 AI & Machine Learning Integration

### Primary AI Service
**Google Gemini Flash API**

**Integration Architecture:**
- **Direct API Integration:** REST API calls
- **Prompt Engineering:** Optimized prompts untuk quality
- **Rate Limiting:** Intelligent rate limiting
- **Fallback System:** Multiple AI providers
- **Cost Management:** Usage tracking dan optimization

**Gemini Integration Features:**
```typescript
interface GeminiConfig {
  model: 'gemini-1.5-flash';
  maxTokens: 8192;
  temperature: 0.7;
  topP: 0.8;
  topK: 40;
}

interface GenerationRequest {
  prompt: string;
  styleTemplate: string;
  aspectRatio: string;
  quality: 'standard' | 'high' | 'ultra' | '4k';
  negativePrompt?: string;
  seed?: number;
}
```

### Content Moderation
**OpenAI Moderation API** + **Custom Filters**

**Safety Layers:**
- **Pre-Generation:** Input validation dan filtering
- **Post-Generation:** Content moderation checks
- **User Reports:** Community moderation system
- **Automated Flags:** AI-powered inappropriate content detection

### Image Processing Pipeline
**Sharp** + **Canvas API** + **FFmpeg**

**Processing Workflow:**
1. **Upload Validation:** File type dan size checks
2. **Resize & Crop:** Multiple size generation
3. **Format Conversion:** PNG, JPG, WebP, AVIF
4. **Optimization:** Compression dan quality balance
5. **Metadata Extraction:** EXIF data dan analysis
6. **Storage:** Upload ke S3 dengan CDN distribution

## 🔧 Development Tools & DevOps

### Package Management
**pnpm 9.0** - Fast, efficient package manager

**Kenapa pnpm:**
- **Speed:** 2x lebih cepat dari npm
- **Space Efficiency:** Shared dependencies
- **Security:** Strict package verification
- **Monorepo Support:** Built-in workspace support

### Code Quality & Linting
**ESLint 9.0** + **Prettier 3.0** + **TypeScript Compiler**

**Quality Tools:**
- **ESLint:** Code quality dan style checks
- **Prettier:** Consistent code formatting
- **Husky:** Git hooks untuk pre-commit checks
- **lint-staged:** Run linters on staged files
- **TypeScript:** Static type checking

### Testing Framework
**Jest 30.0** + **Playwright 2.0** + **Testing Library**

**Testing Strategy:**
- **Unit Tests:** 80% code coverage target
- **Integration Tests:** API endpoint testing
- **E2E Tests:** Critical user journeys
- **Visual Regression:** UI component testing
- **Performance Testing:** Load testing dengan k6

**Test Configuration:**
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### CI/CD Pipeline
**GitHub Actions** + **Vercel** + **Railway**

**Deployment Workflow:**
1. **Push ke main** → Automated testing
2. **Build & Test** → Quality checks
3. **Deploy ke staging** → UAT testing
4. **Deploy ke production** → Manual approval
5. **Health Checks** → Post-deployment validation

**GitHub Actions Workflow:**
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### Monitoring & Observability
**Sentry** + **Vercel Analytics** + **Custom Metrics**

**Monitoring Stack:**
- **Error Tracking:** Sentry untuk production errors
- **Performance:** Vercel Analytics + Web Vitals
- **User Analytics:** Custom event tracking
- **Health Checks:** API uptime monitoring
- **Resource Monitoring:** Database dan queue monitoring

## 🚀 Deployment & Infrastructure

### Frontend Deployment
**Vercel Enterprise** - Global edge deployment

**Vercel Features:**
- **Edge Network:** Global CDN dengan 300+ PoPs
- **Automatic Scaling:** Zero-downtime deployments
- **Analytics:** Built-in performance metrics
- **Preview Deployments:** Branch-based deployments
- **Serverless Functions:** Edge computing ready

### Backend Deployment
**Railway** - Modern application deployment

**Railway Benefits:**
- **Managed Infrastructure:** No server maintenance
- **Auto-Scaling:** Automatic resource allocation
- **PostgreSQL:** Managed database service
- **Redis:** Managed caching service
- **CI/CD:** Built-in deployment pipeline

### Database Hosting
**Railway PostgreSQL** - Managed database service

**Database Configuration:**
- **High Availability:** Automated failover
- **Backups:** Daily automated backups
- **SSL/TLS:** Encrypted connections
- **Connection Pooling:** Performance optimization
- **Monitoring:** Built-in health checks

### Global Infrastructure
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Users Global  │    │  Vercel Edge    │    │  Railway US     │
│                 │◄──►│     Network     │◄──►│  (Backend)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                       │
                              ▼                       ▼
                    ┌─────────────────┐    ┌─────────────────┐
                    │   AWS S3 US     │    │  Railway EU     │
                    │   (Image CDN)   │    │   (Database)    │
                    └─────────────────┘    └─────────────────┘
```

## 🔒 Security Architecture

### Multi-Layer Security
**Application Security:**
- **Input Validation:** Zod schema validation
- **SQL Injection Prevention:** Parameterized queries
- **XSS Protection:** Content Security Policy
- **CSRF Protection:** CSRF tokens untuk forms

**Infrastructure Security:**
- **HTTPS Only:** TLS 1.3 encryption
- **API Key Management:** Encrypted storage
- **Environment Variables:** Secure configuration
- **Network Security:** Firewall dan DDoS protection

**Authentication Security:**
- **Password Security:** Bcrypt dengan salt rounds
- **Session Management:** Secure JWT tokens
- **Multi-Factor Auth:** Optional 2FA
- **Rate Limiting:** Abuse prevention

## 💰 Cost Analysis (Free Forever)

### Development Costs (One-Time)
- **Developer Time:** Rp 150,000,000 (8 minggu)
- **Tools & Services:** Rp 15,000,000 (design tools, domain)
- **Total Development:** Rp 165,000,000

### Monthly Operational Costs: **$0/month!**
- **Vercel:** $0 (100GB bandwidth free)
- **Supabase Database:** $0 (auto-scaling free tier)
- **Supabase Storage:** $0 (1GB free + CDN)
- **Vercel KV Cache:** $0 (free tier)
- **Resend Email:** $0 (3k emails/month free)
- **Gemini API:** $0 (user provides own key)

### API Costs: **User Responsibility**
- **Gemini API:** User's own API key (free tier available)
- **Cost Structure:** User manages their own API usage
- **Fair Use:** 50 generations/day per user limit
- **No Hidden Costs:** 100% transparent model

### Scalability (Free Model)
- **1000 Users:** $0 operational costs
- **10,000 Users:** $0 operational costs
- **100,000 Users:** $0 operational costs
- **Unlimited Scale:** No cost scaling with users!

**🎯 Business Model:** Sustainable via donations and community support

## 📊 Performance Targets & Benchmarks

### Performance Goals
- **First Paint:** <1.5 detik
- **Largest Contentful Paint:** <2.5 detik
- **Generation Time:** <5 detik untuk standard quality
- **API Response:** <200ms untuk non-generation endpoints
- **Gallery Load:** <2 detik untuk 50 images

### Optimization Strategies
- **Code Splitting:** Route-based code splitting
- **Image Optimization:** WebP/AVIF dengan fallbacks
- **Database Optimization:** Query optimization dan indexing
- **Caching:** Multi-level caching strategy
- **CDN:** Global content delivery

## 🔧 Development Workflow

### Environment Setup
```bash
# Clone dan setup
git clone <repository>
cd ai-image-studio-pro
pnpm install

# Environment setup
cp .env.example .env.local
# Configure API keys dan database URL

# Database setup
pnpm prisma migrate dev
pnpm prisma db:seed

# Start development
pnpm dev
```

### Branch Strategy
- **main:** Production-ready code
- **develop:** Integration branch
- **feature/***: Feature development
- **hotfix/***: Critical bug fixes

### Code Review Process
- **Pull Requests:** Semua changes via PR
- **Code Review:** Minimum satu reviewer
- **Automated Checks:** Tests, linting, build
- **Manual QA:** Feature testing before merge

## 📦 Technology Alternatives & Rationale

### Frontend Alternatives Considered
| Technology | Chosen | Considered | Reason |
|------------|--------|------------|--------|
| Framework | Next.js 15 | Remix 2.0 | Next.js has larger ecosystem |
| Styling | Tailwind CSS | Styled Components | Utility-first approach faster |
| State Management | Zustand | Redux Toolkit | Zustand simpler for our needs |
| UI Components | Radix UI | Material-UI | More customizable and accessible |

### Backend Alternatives Considered
| Technology | Chosen | Considered | Reason |
|------------|--------|------------|--------|
| Database | PostgreSQL | MongoDB | Complex queries and relationships |
| ORM | Prisma | Drizzle | Better TypeScript support |
| Authentication | NextAuth.js | Lucia Auth | More providers and features |
| File Storage | AWS S3 | Cloudinary | Better CDN integration |

---

**Document Owner:** Tech Lead
**Review Date:** 2025-02-12
**Last Updated:** 2025-01-12