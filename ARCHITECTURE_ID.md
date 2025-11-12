# Arsitektur Sistem - AI Image Studio Pro (Free Version)

> **Versi:** 2.0 (Free Tier + PWA)
> **Last Updated:** 2025-01-12
> **Arsitektur Lead:** Tech Lead
> **Focus:** 100% Free Services + PWA Implementation

## 🏗 Overview Sistem

### High-Level Architecture (Free Services + PWA)
```
┌─────────────────────────────────────────────────────────┐
│                Client Layer (PWA)                        │
├─────────────────┬─────────────────┬─────────────────────┤
│   Web Browser   │   Mobile PWA    │   Desktop Web       │
│   (React SPA)   │   (Installable) │   (PWA Ready)       │
│   + Service     │   + Offline     │   + Offline         │
│   Worker        │   + Cache       │   + Cache           │
└─────────────────┴─────────────────┴─────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                PWA & Edge Layer                          │
├─────────────────┬─────────────────┬─────────────────────┤
│   Vercel Edge   │   Service       │   Offline Cache     │
│   Network       │   Worker        │   (Generated Imgs)  │
│   (Free Tier)   │   (PWA)         │   (Local + CDN)     │
└─────────────────┴─────────────────┴─────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                Application Layer                         │
├─────────────────┬─────────────────┬─────────────────────┤
│   Frontend      │   API Layer     │   Background        │
│   (Next.js 15)  │   (API Routes)  │   Jobs (Free)       │
│   (Serverless)  │   (Edge Func)   │   (Vercel Cron)      │
└─────────────────┴─────────────────┴─────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                 Free Integration Layer                   │
├─────────────────┬─────────────────┬─────────────────────┤
│   Gemini AI     │   Email Service │   Social APIs       │
│   (Your API)    │   (Resend)      │   (Direct Share)    │
│   (Free Tier)   │   (3k/mo free) │   (No Cost)         │
└─────────────────┴─────────────────┴─────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                  Free Data Layer                         │
├─────────────────┬─────────────────┬─────────────────────┤
│   Supabase PG   │   Vercel KV     │   Supabase Storage  │
│   (Free Tier)   │   (Cache)       │   (1GB Free)        │
│   (Auto-mgmt)   │   (Free Tier)   │   (CDN Included)    │
└─────────────────┴─────────────────┴─────────────────────┘
```

### Prinsip Arsitektur (Free Version)

1. **Free-First Strategy:** 100% free services, zero operational costs
2. **PWA Native Experience:** Installable app dengan offline capability
3. **Performance First:** Generasi gambar sub-5 detik
4. **Scalable Free:** Dibuat untuk 1000+ concurrent users pada free tier
5. **Security:** Essential security untuk public platform
6. **Developer Experience:** Maintainable dan extensible codebase
7. **Community Driven:** Growth melalui user engagement bukan monetization

## 🎨 Arsitektur Frontend

### Struktur Komponen (PWA Optimized)
```
src/
├── app/                    # Next.js 15 App Router (PWA)
│   ├── (auth)/            # Authentication routes
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/         # User dashboard
│   │   ├── page.tsx
│   │   └── components/
│   ├── generate/          # Image generation
│   │   ├── page.tsx
│   │   └── components/
│   ├── gallery/           # User gallery (offline ready)
│   │   ├── page.tsx
│   │   └── components/
│   └── api/               # API routes (serverless)
│       ├── generate/
│       ├── gallery/
│       └── auth/
├── components/            # Reusable React components
│   ├── ui/               # Base UI components (PWA ready)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   ├── forms/            # Form components
│   │   ├── PromptForm.tsx
│   │   └── SettingsForm.tsx
│   ├── image/            # Image-specific components
│   │   ├── ImageEditor.tsx
│   │   ├── ImageViewer.tsx
│   │   └── FilterPanel.tsx
│   ├── pwa/              # PWA-specific components
│   │   ├── InstallPrompt.tsx
│   │   ├── OfflineIndicator.tsx
│   │   └── CacheManager.tsx
│   └── layout/           # Layout components
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
├── lib/                  # Utilities dan configurations
│   ├── gemini/           # Gemini API integration (free)
│   ├── supabase/         # Supabase client
│   ├── pwa/              # PWA utilities
│   │   ├── serviceWorker.ts
│   │   └── cacheStrategy.ts
│   ├── db/               # Database utilities
│   ├── utils/            # Helper functions
│   └── hooks/            # Custom React hooks
│       ├── useOffline.ts
│       └── useInstallPrompt.ts
└── types/                # TypeScript definitions
    ├── auth.ts
    ├── image.ts
    └── api.ts

public/
├── manifest.json         # PWA manifest
├── sw.js                 # Service worker
├── icons/               # PWA icons (multiple sizes)
└── offline.html         # Offline fallback page
```

### Strategi State Management
```
┌─────────────────────────────────────────────────────────┐
│                    Global State                          │
├─────────────────┬─────────────────┬─────────────────────┤
│   User State    │   Image State   │   UI State          │
│   - Auth        │   - Gallery     │   - Modals          │
│   - Profile     │   - Generation  │   - Loading         │
│   - Settings    │   - Editing     │   - Errors          │
└─────────────────┴─────────────────┴─────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                Component State                          │
│  Local component states yang tidak perlu di-sharing     │
└─────────────────────────────────────────────────────────┘
```

### Data Flow Pattern
```
User Interaction → Component → Hook/Service → API → Backend → Database
       ▲                                                    │
       └────────────────── Response ← ← ← ← ← ← ← ← ← ← ───┘
```

### Optimasi Performa

#### 1. Code Splitting Strategy
```typescript
// Route-based code splitting
const Gallery = lazy(() => import('./components/Gallery'));
const ImageEditor = lazy(() => import('./components/ImageEditor'));

// Dynamic imports untuk heavy components
const AdvancedEditor = dynamic(
  () => import('./components/AdvancedEditor'),
  { loading: () => <LoadingSpinner /> }
);
```

#### 2. Image Optimization
```typescript
// Next.js Image component optimization
<Image
  src={imageUrl}
  alt={altText}
  width={800}
  height={600}
  placeholder="blur"
  blurDataURL={blurDataUrl}
  priority={isAboveFold}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

#### 3. State Management Optimization
```typescript
// Zustand optimized selectors
const useImageStore = create<ImageState>()(
  devtools(
    persist(
      (set, get) => ({
        images: [],
        loading: false,

        // Optimized actions
        addImage: (image) => set((state) => ({
          images: [...state.images, image]
        })),

        // Selective updates
        updateImage: (id, updates) => set((state) => ({
          images: state.images.map(img =>
            img.id === id ? { ...img, ...updates } : img
          )
        }))
      }),
      {
        name: 'image-storage',
        partialize: (state) => ({ images: state.images })
      }
    )
  )
);
```

## ⚙️ Arsitektur Backend

### API Design Pattern
```
┌─────────────────────────────────────────────────────────┐
│                API Gateway Layer                         │
│                    (Express.js)                          │
├─────────────────┬─────────────────┬─────────────────────┤
│   Authentication│   Rate Limiting │   Request Logging   │
│   (NextAuth)    │   (Redis)       │   (Winston)         │
└─────────────────┴─────────────────┴─────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                Service Layer                            │
├─────────────────┬─────────────────┬─────────────────────┤
│   Generation    │   Gallery       │   User Management   │
│   Service       │   Service       │   Service           │
└─────────────────┴─────────────────┴─────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                 Data Access Layer                        │
│                 (Prisma ORM)                            │
└─────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                  Database Layer                           │
│                (PostgreSQL 15)                           │
└─────────────────────────────────────────────────────────┘
```

### Struktur Modul Backend
```
backend/
├── src/
│   ├── controllers/        # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── image.controller.ts
│   │   ├── gallery.controller.ts
│   │   └── user.controller.ts
│   ├── services/          # Business logic
│   │   ├── gemini.service.ts
│   │   ├── image.service.ts
│   │   ├── storage.service.ts
│   │   └── moderation.service.ts
│   ├── middleware/        # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── rate-limit.middleware.ts
│   │   └── error.middleware.ts
│   ├── models/            # Data models
│   │   ├── user.model.ts
│   │   ├── image.model.ts
│   │   └── template.model.ts
│   ├── routes/            # API routes
│   │   ├── auth.routes.ts
│   │   ├── image.routes.ts
│   │   ├── gallery.routes.ts
│   │   └── user.routes.ts
│   ├── utils/             # Helper functions
│   │   ├── logger.ts
│   │   ├── validation.ts
│   │   └── error-handling.ts
│   └── config/            # Configuration
│       ├── database.ts
│       ├── redis.ts
│       └── environment.ts
├── tests/                 # Backend tests
└── docs/                  # API documentation
```

### Standar API Design

#### Struktur RESTful API
```
/api/v1/
├── auth/
│   ├── POST /register          # User registration
│   ├── POST /login             # User login
│   ├── POST /logout            # User logout
│   ├── POST /refresh           # Refresh token
│   └── GET /profile           # Get user profile
├── images/
│   ├── POST /generate          # Generate image
│   ├── GET /                   # List images
│   ├── GET /:id               # Get image by ID
│   ├── PUT /:id               # Update image
│   ├── DELETE /:id            # Delete image
│   └── POST /:id/edit         # Edit image
├── gallery/
│   ├── GET /                  # Get user gallery
│   ├── POST /collections      # Create collection
│   ├── GET /collections       # List collections
│   └── DELETE /collections/:id # Delete collection
└── templates/
    ├── GET /                  # Get style templates
    ├── GET /:id               # Get template by ID
    └── GET /categories       # Get template categories
```

#### Standar Request/Response
```typescript
// Standard API Response
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    timestamp: string;
    requestId: string;
  };
}
```

### Arsitektur Service

#### Image Generation Service
```typescript
export class ImageGenerationService {
  constructor(
    private geminiClient: GeminiClient,
    private storageService: StorageService,
    private moderationService: ModerationService
  ) {}

  async generateImage(request: GenerationRequest): Promise<GeneratedImage> {
    // 1. Validate request
    this.validateRequest(request);

    // 2. Content moderation check
    await this.moderationService.checkContent(request.prompt);

    // 3. Call Gemini API
    const result = await this.geminiClient.generateImage({
      prompt: this.optimizePrompt(request.prompt),
      style: request.styleTemplate,
      aspectRatio: request.aspectRatio,
      quality: request.quality
    });

    // 4. Process and store image
    const imageData = await this.storageService.uploadImage(result.image);

    // 5. Save to database
    const savedImage = await this.saveImage({
      ...request,
      imageUrl: imageData.url,
      metadata: result.metadata
    });

    return savedImage;
  }
}
```

#### Storage Service
```typescript
export class StorageService {
  private s3Client: S3Client;

  async uploadImage(imageBuffer: Buffer, metadata: ImageMetadata): Promise<UploadResult> {
    // 1. Generate unique filename
    const filename = this.generateFilename(metadata);

    // 2. Upload original ke S3
    const originalUrl = await this.uploadToS3(imageBuffer, filename, 'original');

    // 3. Generate thumbnails
    const thumbnails = await this.generateThumbnails(imageBuffer, filename);

    // 4. Return all URLs
    return {
      originalUrl,
      thumbnails,
      metadata: {
        size: imageBuffer.length,
        format: metadata.format,
        uploadedAt: new Date()
      }
    };
  }

  private async generateThumbnails(buffer: Buffer, filename: string): Promise<Thumbnail[]> {
    const sizes = [150, 300, 800, 1920];
    const thumbnails: Thumbnail[] = [];

    for (const size of sizes) {
      const resizedBuffer = await this.resizeImage(buffer, size);
      const url = await this.uploadToS3(resizedBuffer, `${filename}_${size}`, 'thumbnails');
      thumbnails.push({ size, url });
    }

    return thumbnails;
  }
}
```

## 🗄️ Arsitektur Database

### Database Schema Design (Free Version - Simplified)
```sql
-- Users (Free tier only)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  email_verified BOOLEAN DEFAULT false,
  generation_count_today INTEGER DEFAULT 0,
  generation_count_month INTEGER DEFAULT 0,
  last_generation_reset DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP
);

-- User preferences dan settings (simplified)
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  default_quality VARCHAR(10) DEFAULT 'standard' CHECK (default_quality IN ('standard', 'high')),
  default_aspect_ratio VARCHAR(10) DEFAULT '1:1',
  auto_save_gallery BOOLEAN DEFAULT true,
  enable_offline_cache BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Style templates (free only)
CREATE TABLE style_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  thumbnail_url VARCHAR(500),
  parameters JSONB NOT NULL, -- Style parameters untuk Gemini API
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Generated images dengan metadata (simplified)
CREATE TABLE generated_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  negative_prompt TEXT,
  style_template_id UUID REFERENCES style_templates(id),
  aspect_ratio VARCHAR(10) DEFAULT '1:1',
  quality VARCHAR(10) DEFAULT 'standard' CHECK (quality IN ('standard', 'high')),
  width INTEGER NOT NULL CHECK (width > 0),
  height INTEGER NOT NULL CHECK (height > 0),
  original_url VARCHAR(500) NOT NULL, -- Supabase Storage URL
  thumbnail_url VARCHAR(500) NOT NULL, -- Supabase Storage URL
  metadata JSONB NOT NULL, -- Generation metadata dari Gemini
  tags TEXT[], -- User-defined tags
  ai_tags TEXT[], -- AI-generated tags (simplified)
  generation_time INTEGER, -- Generation time in milliseconds
  tokens_used INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT false,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Image collections untuk organization (simplified)
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  cover_image_id UUID REFERENCES generated_images(id),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Collection-image relationships
CREATE TABLE collection_images (
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  image_id UUID REFERENCES generated_images(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (collection_id, image_id)
);

-- Usage tracking untuk free tier limits
CREATE TABLE usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL, -- generate, download, share, cache_hit
  resource_type VARCHAR(50) NOT NULL, -- image, collection, template
  resource_id UUID,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Database Indexing Strategy (Free Version)
```sql
-- Performance indexes (optimized for free tier)
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_generation_limits ON users(generation_count_today, last_generation_reset);
CREATE INDEX idx_images_user_id ON generated_images(user_id);
CREATE INDEX idx_images_created_at ON generated_images(created_at DESC);
CREATE INDEX idx_images_public ON generated_images(is_public, created_at DESC);
CREATE INDEX idx_images_quality ON generated_images(quality);
CREATE INDEX idx_images_tags ON generated_images USING GIN(tags);

-- Simplified full-text search (for free tier performance)
CREATE INDEX idx_images_search ON generated_images
USING GIN(to_tsvector('english', prompt || ' ' || array_to_string(tags, ' ')));

-- Collection indexes
CREATE INDEX idx_collections_user_id ON collections(user_id);
CREATE INDEX idx_collections_public ON collections(is_public, created_at DESC);

-- Usage tracking (simplified)
CREATE INDEX idx_usage_logs_user_date ON usage_logs(user_id, created_at DESC);
CREATE INDEX idx_usage_logs_action_date ON usage_logs(action, created_at DESC);
```

### Data Retention Strategy (Free Tier)
```sql
-- Cleanup old usage logs untuk free tier performance
-- Delete logs setelah 30 hari
DELETE FROM usage_logs WHERE created_at < NOW() - INTERVAL '30 days';

-- Optional: Cleanup non-public images setelah 90 hari
-- (untuk menghemat storage space)
DELETE FROM generated_images
WHERE created_at < NOW() - INTERVAL '90 days'
AND is_public = false;

-- Update user generation counters daily
UPDATE users
SET generation_count_today = 0, last_generation_reset = CURRENT_DATE
WHERE last_generation_reset < CURRENT_DATE;
```

## 🔐 Arsitektur Security

### Security Layers
```
┌─────────────────────────────────────────────────────────┐
│                Security Layers                          │
├─────────────────┬─────────────────┬─────────────────────┤
│ Network Security│ Application     │ Data Security        │
│                 │ Security        │                     │
│ - HTTPS/TLS     │ - Authentication│ - Encryption        │
│ - WAF           │ - Authorization│ - Access Control     │
│ - DDoS Protection│ - Input Validation│ - Backup            │
│ - Firewall      │ - Rate Limiting │ - Auditing           │
└─────────────────┴─────────────────┴─────────────────────┘
```

### Authentication & Authorization
```typescript
// JWT Token Structure
interface JWTPayload {
  sub: string; // User ID
  email: string;
  tier: 'free' | 'pro' | 'enterprise';
  permissions: string[];
  iat: number;
  exp: number;
}

// Authorization Middleware
export function authorize(requiredPermissions: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
      req.user = decoded;

      // Check permissions
      const hasPermissions = requiredPermissions.every(permission =>
        decoded.permissions.includes(permission)
      );

      if (!hasPermissions) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}
```

### API Key Security
```typescript
export class APIKeyService {
  generateAPIKey(): { key: string; hash: string } {
    const key = `ais_${randomBytes(32).toString('hex')}`;
    const hash = createHash('sha256').update(key).digest('hex');

    return { key, hash };
  }

  async validateAPIKey(keyHash: string): Promise<APIKey | null> {
    const apiKey = await db.api_keys.findFirst({
      where: {
        keyHash,
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      }
    });

    return apiKey;
  }
}
```

### Input Validation & Sanitization
```typescript
// Zod schemas untuk validation
export const GenerateImageSchema = z.object({
  prompt: z.string()
    .min(1, 'Prompt is required')
    .max(1000, 'Prompt too long')
    .regex(/^[a-zA-Z0-9\s\.,!?()\-_]+$/, 'Invalid characters in prompt'),
  styleTemplate: z.string().optional(),
  aspectRatio: z.enum(['1:1', '16:9', '9:16', '4:3', '3:4']).default('1:1'),
  quality: z.enum(['standard', 'high', 'ultra', '4k']).default('standard'),
  negativePrompt: z.string().max(500).optional(),
  seed: z.number().optional()
});

// Validation middleware
export function validateInput(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: error.errors
          }
        });
      }
      next(error);
    }
  };
}
```

## 🚀 Arsitektur Deployment

### Infrastruktur Arsitektur (Free Version)
```
┌─────────────────────────────────────────────────────────┐
│                Vercel Edge Network                       │
│              (Free Tier - 100GB bandwidth)              │
│                   Global CDN                            │
└─────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│            Free Application Infrastructure                │
├─────────────────┬─────────────────┬─────────────────────┤
│   Frontend      │   API Layer     │   Database          │
│   (Vercel)      │   (Vercel)      │   (Supabase)        │
│   - Serverless  │   - Edge Func   │   - PostgreSQL      │
│   - Global CDN  │   - API Routes  │   - Auto-mgmt        │
│   - Edge Functions│ - Free Tier    │   - Free Tier        │
│   - PWA Ready   │                 │   - Auto-backups     │
└─────────────────┴─────────────────┴─────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│               Free Storage & Services                    │
├─────────────────┬─────────────────┬─────────────────────┤
│   File Storage  │   Cache         │   Free APIs         │
│   (Supabase)    │   (Vercel KV)   │   (Gemini)          │
│   - 1GB Free    │   - Free Tier   │   - Your API Key    │
│   - CDN Included│   - Sessions    │   - Rate limiting    │
│   - Auto-backup │   - API cache   │   - Resend Email    │
│   - Free Domain │   - PWA Cache   │   - Community       │
└─────────────────┴─────────────────┴─────────────────────┘
```

### Deployment Pipeline
```
GitHub Repository
        │
        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Push Event    │───►│   GitHub Actions│───►│   Testing       │
│   (Main Branch) │    │   (CI Pipeline) │    │   (Unit, Int,   │
└─────────────────┘    └─────────────────┘    │    E2E)         │
                                             └─────────────────┘
                                                      │
                                                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Deploy to     │───►│   Staging       │───►│   Production    │
│   Staging       │    │   Environment  │    │   Deployment    │
│   (Vercel)      │    │   (UAT)         │    │   (Manual)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Environment Configuration
```typescript
// Environment-specific configuration
export const config = {
  development: {
    database: {
      url: process.env.DATABASE_URL_DEV,
      ssl: false
    },
    redis: {
      url: process.env.REDIS_URL_DEV,
      maxConnections: 10
    },
    gemini: {
      apiKey: process.env.GEMINI_API_KEY_DEV,
      rateLimit: 10 // requests per minute
    },
    storage: {
      provider: 'local',
      path: './uploads'
    }
  },

  production: {
    database: {
      url: process.env.DATABASE_URL_PROD,
      ssl: true,
      poolSize: 20
    },
    redis: {
      url: process.env.REDIS_URL_PROD,
      maxConnections: 100
    },
    gemini: {
      apiKey: process.env.GEMINI_API_KEY_PROD,
      rateLimit: 100 // requests per minute
    },
    storage: {
      provider: 's3',
      bucket: process.env.AWS_S3_BUCKET,
      region: process.env.AWS_REGION
    }
  }
};
```

## 🔍 Monitoring & Observability

### Monitoring Stack (Free Version)
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Application   │    │   Performance   │    │   Usage          │
│   Metrics       │◄──►│   (Vercel)      │◄──►│   (Custom DB)    │
│   (Basic)       │    │   (Free Tier)   │    │   (Free)         │
└─────────────────┘    └─────────────────┘    └─────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PWA Metrics   │    │   Error         │    │   Logging       │
│   (Offline)     │◄──►│   (Vercel Logs) │◄──►│   (Console)     │
│   (Cache)       │    │   (Free)        │    │   (Simple)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Metrics untuk Monitor (Free Version)
```typescript
// Performance Metrics (free tier optimized)
const performanceMetrics = {
  // Response Times
  averageResponseTime: '<200ms',
  imageGenerationTime: '<5s',
  databaseQueryTime: '<100ms',

  // Availability (Vercel free tier)
  uptime: '99.5%',
  errorRate: '<2%',

  // Free Tier Usage Metrics
  dailyActiveUsers: 1000,
  imagesGeneratedPerDay: 50, // per user limit
  storageUsed: '1GB', // Supabase limit
  monthlyBandwidth: '100GB', // Vercel limit

  // Community Metrics
  userRegistrationRate: 'per day',
  socialSharesPerDay: 'count',
  cacheHitRate: '80%'
};
```

### Free Tier Alert Configuration
```typescript
// Simple alert rules (no paid monitoring)
const alertRules = {
  critical: {
    'uptime < 95%': 'email notification',
    'error rate > 10%': 'email notification',
    'image generation time > 15s': 'email notification',
    'storage usage > 90%': 'email notification'
  },

  warning: {
    'daily generation limit > 80%': 'email notification',
    'monthly bandwidth > 80%': 'email notification',
    'PWA cache errors > 5%': 'email notification'
  },

  info: {
    'new user registration': 'daily email',
    'generation limit reached': 'real-time user notification',
    'PWA installed': 'weekly summary'
  }
};
```

## 🚀 Roadmap Evolusi (Free Version)

### Phase 2: Enhanced Free Features (3-6 bulan)
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Offline AI    │    │ Advanced PWA    │    │ Community       │
│   (Local Models)│    │ (Background)    │    │ (GitHub)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
                    ┌─────────────────┐
                    │   Free Service  │
                    │   (Scale Up)    │
                    └─────────────────┘
```

### Phase 3: Sustainability (6-12 bulan)
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Donations     │    │   Premium       │    │   API for       │
│   (GitHub Spon) │    │   (Optional)    │    │   Developers    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Free Forever  │    │   Advanced      │    │   Ecosystem     │
│   (Core)        │    │   (Supporters)  │    │   (Integrations)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Free Tier Scaling Strategy
```typescript
// Free-first scaling strategy
const freeScalingPlan = {
  database: {
    provider: 'supabase',
    plan: 'free_tier_optimized',
    caching: 'vercel_kv',
    retention: 'automated_cleanup'
  },

  application: {
    platform: 'vercel_serverless',
    scaling: 'auto_free_tier',
    edge_functions: true,
    geographic_distribution: 'global'
  },

  storage: {
    primary: 'supabase_storage',
    plan: '1gb_free_tier',
    cdn: 'supabase_cdn',
    backup: 'github_release_assets'
  },

  ai_processing: {
    provider: 'gemini_api',
    plan: 'user_provided_key',
    rate_limiting: '50_per_day',
    fallback: 'offline_queue'
  }
};
```

---

**Document Owner:** Architecture Team
**Version:** 2.0 (Free Tier + PWA)
**Review Date:** 2025-02-12
**Last Updated:** 2025-01-12
**GitHub:** https://github.com/aimastermebjm-byte/ai-image-studio-pro