# API Documentation - AI Image Studio Pro (Free Version)

> **Versi:** v2.0.0 (Free Tier)
> **Base URL:** `https://api.ai-image-studio.com/v1`
> **Last Updated:** 2025-01-12
> **Model:** Free Forever - 50 images/day per user

## 📋 Daftar Isi

1. [Introduction](#introduction)
2. [Authentication](#authentication)
3. [Common Responses](#common-responses)
4. [Rate Limiting](#rate-limiting)
5. [Endpoints](#endpoints)
6. [Error Codes](#error-codes)
7. [Webhooks](#webhooks)
8. [SDKs & Libraries](#sdks--libraries)

## 🎯 Introduction

### API Overview (Free Version)
AI Image Studio Pro API menyediakan akses **gratis** ke kemampuan generasi gambar AI-powered, editing dasar, dan manajemen offline-ready. RESTful API ini memungkinkan developer untuk mengintegrasikan generasi gambar menggunakan Google's Gemini API dengan **usage limits yang fair**.

### Key Features (100% Free)
- ✅ Generasi gambar text-to-image dengan 20+ templates
- ✅ Editing dasar gambar (crop, filters, text)
- ✅ Manajemen gallery dengan offline capability
- ✅ Support download 3 formats (PNG, JPG, WebP)
- ✅ Simple generation progress tracking
- ✅ Basic error handling
- ✅ Rate limiting (50 images/day per user)
- ✅ **No watermarks** pada generated images

### Getting Started (Gratis)
1. [Create a simple account](#authentication) (optional)
2. [Use your own Gemini API key](#authentication)
3. [Make your first generation request](#generation-endpoints)

### Philosophy
- **Free Forever:** No payment required, ever
- **Fair Use:** 50 generations per day per user
- **User Keys:** You provide your own Gemini API key
- **No Lock-in:** Generated images are yours to keep

## 🔐 Authentication

### Authentication Methods

#### 1. API Key (Recommended)
```http
Authorization: Bearer YOUR_API_KEY
```

#### 2. JWT Token (Web App)
```http
Authorization: Bearer YOUR_JWT_TOKEN
```

#### 3. Session Cookie (Web App)
```http
Cookie: next-auth.session-token=YOUR_SESSION_TOKEN
```

### Getting API Credentials

#### Register Account
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

#### Login for API Key
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_1234567890abcdef",
      "email": "user@example.com",
      "name": "John Doe",
      "subscriptionTier": "pro"
    },
    "apiKey": "ais_live_1234567890abcdef",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

### API Key Management
```http
# Create new API key
POST /api/v1/keys
Authorization: Bearer YOUR_JWT_TOKEN

# List API keys
GET /api/v1/keys
Authorization: Bearer YOUR_JWT_TOKEN

# Delete API key
DELETE /api/v1/keys/:keyId
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📊 Common Response Formats

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "meta": {
    "timestamp": "2025-01-12T10:30:00Z",
    "requestId": "req_1234567890abcdef"
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "items": [...],
    "meta": {
      "pagination": {
        "page": 1,
        "limit": 20,
        "total": 150,
        "totalPages": 8,
        "hasNext": true,
        "hasPrev": false
      }
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": {
      "field": "prompt",
      "issue": "Prompt is required and must be between 1-1000 characters"
    }
  },
  "meta": {
    "timestamp": "2025-01-12T10:30:00Z",
    "requestId": "req_1234567890abcdef"
  }
}
```

## ⚡ Rate Limiting (Free Tier Only)

### Rate Limits (Fair Use Policy)
- **Free:** 50 images per day, 100 API requests per hour
- **Daily Reset:** Reset at 00:00 UTC
- **Rate Per IP:** Additional rate limiting per IP address
- **Concurrent:** Maximum 5 concurrent generations per user

### Rate Limit Headers
```http
X-RateLimit-Limit: 50
X-RateLimit-Remaining: 49
X-RateLimit-Reset: 1640995200
X-RateLimit-Daily-Remaining: 45
```

### Rate Limit Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
X-RateLimit-Retry-After: 60
```

### Rate Limit Exceeded Response
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please try again later.",
    "details": {
      "retryAfter": 60,
      "limit": 1000,
      "resetTime": "2025-01-12T11:00:00Z"
    }
  }
}
```

## 🔌 Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_1234567890abcdef",
      "email": "user@example.com",
      "name": "John Doe",
      "subscriptionTier": "free",
      "creditsRemaining": 50,
      "emailVerified": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### Get Current User
```http
GET /api/v1/auth/profile
Authorization: Bearer YOUR_TOKEN
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_1234567890abcdef",
      "email": "user@example.com",
      "name": "John Doe",
      "avatarUrl": "https://example.com/avatar.jpg",
      "subscriptionTier": "pro",
      "creditsRemaining": 450,
      "settings": {
        "defaultQuality": "high",
        "defaultAspectRatio": "1:1",
        "emailNotifications": true,
        "autoSaveGallery": true
      },
      "createdAt": "2025-01-01T00:00:00Z",
      "lastLoginAt": "2025-01-12T10:00:00Z"
    }
  }
}
```

#### Update User Profile
```http
PUT /api/v1/auth/profile
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "John Updated",
  "settings": {
    "defaultQuality": "ultra",
    "emailNotifications": false
  }
}
```

### Image Generation Endpoints

#### Generate Image (Free Version)
```http
POST /api/v1/images/generate
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "prompt": "Sebuah kota futuristik di senja dengan gaya cyberpunk, lampu neon memantul di jalanan basah",
  "negativePrompt": "orang, mobil, text",
  "styleTemplate": "photorealistic",
  "aspectRatio": "16:9",
  "quality": "high",
  "geminiApiKey": "AIzaSyBF10AXp7nmjFMCQoAWDAzomgWEuJPhW2Y"
}
```

**Response (202 Accepted):**
```json
{
  "success": true,
  "data": {
    "generationId": "gen_1234567890abcdef",
    "status": "processing",
    "estimatedTime": 4,
    "queuePosition": 2
  }
}
```

#### Get Generation Status
```http
GET /api/v1/images/generate/gen_1234567890abcdef
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "generationId": "gen_1234567890abcdef",
    "status": "completed",
    "progress": 100,
    "results": [
      {
        "id": "img_1234567890abcdef",
        "url": "https://cdn.ai-image-studio.com/images/generated/1234567890.jpg",
        "thumbnailUrl": "https://cdn.ai-image-studio.com/images/thumbnails/1234567890_300.jpg",
        "metadata": {
          "prompt": "Sebuah kota futuristik...",
          "styleTemplate": "photorealistic",
          "aspectRatio": "16:9",
          "quality": "high",
          "width": 1920,
          "height": 1080,
          "seed": 12345,
          "generationTime": 3500,
          "tokensUsed": 85
        }
      },
      {
        "id": "img_1234567890abcde1",
        "url": "https://cdn.ai-image-studio.com/images/generated/1234567891.jpg",
        "thumbnailUrl": "https://cdn.ai-image-studio.com/images/thumbnails/1234567891_300.jpg",
        "metadata": {
          "seed": 12346
        }
      }
    ]
  }
}
```

#### Real-time Generation Progress (WebSocket)
```javascript
// Connect ke WebSocket untuk real-time updates
const ws = new WebSocket('wss://api.ai-image-studio.com/v1/ws/generate');

ws.onopen = () => {
  ws.send(JSON.stringify({
    action: 'subscribe',
    generationId: 'gen_1234567890abcdef'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Generation progress:', data.progress);

  // Progress updates:
  // { status: 'processing', progress: 25, stage: 'analyzing_prompt' }
  // { status: 'processing', progress: 60, stage: 'generating' }
  // { status: 'completed', progress: 100, results: [...] }
};
```

### Image Management Endpoints

#### List User Images
```http
GET /api/v1/images?page=1&limit=20&sort=createdAt&order=desc&style=photorealistic&search=futuristik
Authorization: Bearer YOUR_API_KEY
```

**Query Parameters:**
- `page` (integer): Nomor halaman (default: 1)
- `limit` (integer): Items per halaman (default: 20, max: 100)
- `sort` (string): Sort field (createdAt, quality, downloadCount)
- `order` (string): Sort order (asc, desc)
- `style` (string): Filter by style template
- `quality` (string): Filter by quality
- `search` (string): Search in prompts dan tags
- `tags` (string): Filter by tags (comma-separated)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "img_1234567890abcdef",
        "prompt": "Sebuah kota futuristik...",
        "styleTemplate": "photorealistic",
        "quality": "high",
        "thumbnailUrl": "https://cdn.../thumbnails/123.jpg",
        "originalUrl": "https://cdn.../original/123.jpg",
        "tags": ["futuristik", "kota", "cyberpunk"],
        "aiTags": ["arsitektur", "urban", "night"],
        "downloadCount": 15,
        "isPublic": false,
        "createdAt": "2025-01-12T09:30:00Z"
      }
    ],
    "meta": {
      "pagination": {
        "page": 1,
        "limit": 20,
        "total": 85,
        "totalPages": 5,
        "hasNext": true,
        "hasPrev": false
      }
    }
  }
}
```

#### Get Image Details
```http
GET /api/v1/images/img_1234567890abcdef
Authorization: Bearer YOUR_API_KEY
```

#### Update Image
```http
PUT /api/v1/images/img_1234567890abcdef
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "tags": ["updated", "tags"],
  "isPublic": true,
  "prompt": "Updated prompt description"
}
```

#### Delete Image
```http
DELETE /api/v1/images/img_1234567890abcdef
Authorization: Bearer YOUR_API_KEY
```

### Image Editing Endpoints

#### Edit Image
```http
POST /api/v1/images/img_1234567890abcdef/edit
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "operations": [
    {
      "type": "crop",
      "x": 100,
      "y": 100,
      "width": 800,
      "height": 600
    },
    {
      "type": "filter",
      "filter": "vintage",
      "intensity": 0.7
    },
    {
      "type": "text",
      "text": "My Caption",
      "font": "Arial",
      "fontSize": 24,
      "color": "#ffffff",
      "x": 50,
      "y": 50
    },
    {
      "type": "adjust",
      "brightness": 1.1,
      "contrast": 1.2,
      "saturation": 1.1
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "editedImageId": "img_1234567890abcde1",
    "url": "https://cdn.../edited/1234567890.jpg",
    "thumbnailUrl": "https://cdn.../thumbnails/edited_1234567890_300.jpg",
    "operations": [
      {
        "type": "crop",
        "applied": true
      },
      {
        "type": "filter",
        "applied": true
      }
    ]
  }
}
```

#### Get Image Editing History
```http
GET /api/v1/images/img_1234567890abcdef/edits
Authorization: Bearer YOUR_API_KEY
```

### Download Endpoints

#### Download Image
```http
POST /api/v1/images/img_1234567890abcdef/download
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "format": "png",
  "quality": "high",
  "size": "original",
  "includeMetadata": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://cdn.../download/1234567890.png?token=abc123",
    "expiresAt": "2025-01-12T11:00:00Z",
    "fileSize": 2048576,
    "format": "png",
    "quality": "high"
  }
}
```

#### Batch Download
```http
POST /api/v1/images/download
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "imageIds": [
    "img_1234567890abcdef",
    "img_1234567890abcde1",
    "img_1234567890abcde2"
  ],
  "format": "jpg",
  "quality": "high"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://cdn.../download/batch_1234567890.zip",
    "expiresAt": "2025-01-12T11:00:00Z",
    "fileSize": 15728640,
    "imageCount": 3
  }
}
```

### Style Templates Endpoints

#### List Style Templates
```http
GET /api/v1/templates?category=all&isPremium=false
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "template_1234567890abcdef",
        "name": "Photorealistic",
        "description": "Ultra-realistic photographic style dengan natural lighting",
        "category": "realistic",
        "thumbnailUrl": "https://cdn.../templates/photorealistic.jpg",
        "parameters": {
          "style": "photorealistic",
          "lighting": "natural",
          "color": "balanced",
          "detail": "high"
        },
        "isPremium": false,
        "usageCount": 15420,
        "compatibleQualities": ["standard", "high", "ultra", "4k"]
      }
    ],
    "categories": [
      {
        "name": "realistic",
        "count": 15,
        "description": "Photographic dan realistic styles"
      },
      {
        "name": "artistic",
        "count": 20,
        "description": "Art dan painting styles"
      }
    ]
  }
}
```

#### Get Template Details
```http
GET /api/v1/templates/template_1234567890abcdef
Authorization: Bearer YOUR_API_KEY
```

### Gallery & Collections Endpoints

#### Create Collection
```http
POST /api/v1/collections
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "name": "Cyberpunk Collection",
  "description": "Futuristic dan cyberpunk themed images",
  "coverImageId": "img_1234567890abcdef",
  "isPublic": false
}
```

#### List Collections
```http
GET /api/v1/collections?public=true
Authorization: Bearer YOUR_API_KEY
```

#### Add Images to Collection
```http
POST /api/v1/collections/collection_1234567890abcdef/images
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "imageIds": [
    "img_1234567890abcdef",
    "img_1234567890abcde1"
  ]
}
```

### Analytics Endpoints

#### Get Usage Statistics
```http
GET /api/v1/analytics/usage?period=month
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "period": "month",
    "totalImagesGenerated": 245,
    "totalTokensUsed": 18500,
    "averageGenerationTime": 3.2,
    "topStyleTemplates": [
      {
        "templateId": "template_1234567890abcdef",
        "name": "Photorealistic",
        "usageCount": 45
      }
    ],
    "dailyUsage": [
      {
        "date": "2025-01-01",
        "imagesGenerated": 12,
        "tokensUsed": 900
      }
    ],
    "subscriptionUsage": {
      "limit": 500,
      "used": 245,
      "remaining": 255
    }
  }
}
```

#### Get Account Information
```http
GET /api/v1/account
Authorization: Bearer YOUR_API_KEY
```

## ❌ Error Codes

### HTTP Status Codes
| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 202 | Accepted | Request accepted, processing |
| 204 | No Content | Resource deleted successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Permission denied |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 502 | Bad Gateway | External service error |
| 503 | Service Unavailable | Service temporarily unavailable |

### Error Code Reference

#### Authentication Errors
- `AUTH_001` - Invalid credentials
- `AUTH_002` - Token expired
- `AUTH_003` - Token invalid
- `AUTH_004` - Account locked
- `AUTH_005` - Email not verified
- `AUTH_006` - Insufficient permissions

#### Generation Errors
- `GEN_001` - Invalid prompt
- `GEN_002` - Content not allowed
- `GEN_003` - Template not found
- `GEN_004` - Quality not available
- `GEN_005` - Insufficient credits
- `GEN_006` - Generation failed
- `GEN_007` - External API error

#### Image Management Errors
- `IMG_001` - Image not found
- `IMG_002` - Invalid operation
- `IMG_003` - File too large
- `IMG_004` - Unsupported format
- `IMG_005` - Storage error

#### Rate Limiting Errors
- `RATE_001` - Rate limit exceeded
- `RATE_002` - Daily limit exceeded
- `RATE_003` - Monthly limit exceeded

#### Payment Errors
- `PAY_001` - Payment required
- `PAY_002` - Invalid subscription
- `PAY_003` - Billing error
- `PAY_004` - Payment failed

### Error Response Examples

#### Validation Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": {
      "field": "prompt",
      "issue": "Prompt must be between 1-1000 characters",
      "currentLength": 0
    }
  }
}
```

#### Generation Error
```json
{
  "success": false,
  "error": {
    "code": "GEN_002",
    "message": "Content policy violation detected",
    "details": {
      "policy": "harmful_content",
      "suggestion": "Please modify your prompt to comply with content policies"
    }
  }
}
```

## 🪝 Webhooks

### Webhook Configuration

#### Create Webhook
```http
POST /api/v1/webhooks
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "url": "https://yourapp.com/webhooks/ai-studio",
  "events": [
    "image.generated",
    "image.completed",
    "generation.failed",
    "billing.payment_succeeded"
  ],
  "secret": "your_webhook_secret_key",
  "active": true
}
```

#### Webhook Events
- `image.generated` - Image generation started
- `image.completed` - Image generation completed
- `generation.failed` - Image generation failed
- `image.downloaded` - Image was downloaded
- `collection.created` - Collection was created
- `user.registered` - New user registered
- `billing.payment_succeeded` - Payment successful
- `billing.payment_failed` - Payment failed

#### Webhook Payload Example
```json
{
  "eventId": "evt_1234567890abcdef",
  "event": "image.completed",
  "data": {
    "imageId": "img_1234567890abcdef",
    "userId": "user_1234567890abcdef",
    "generationTime": 3500,
    "quality": "high",
    "styleTemplate": "photorealistic"
  },
  "timestamp": "2025-01-12T10:30:00Z",
  "signature": "sha256=5d41402abc4b2a76b9719d911017c592"
}
```

#### Webhook Security
- Verify signature using HMAC-SHA256
- Use HTTPS endpoint
- Implement idempotency

```javascript
// Example signature verification
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return `sha256=${expectedSignature}` === signature;
}
```

## 📚 SDKs & Libraries

### Official SDKs

#### JavaScript/TypeScript
```bash
npm install @ai-image-studio/sdk
```

```typescript
import { AIImageStudio } from '@ai-image-studio/sdk';

const client = new AIImageStudio({
  apiKey: process.env.AI_STUDIO_API_KEY,
  baseURL: 'https://api.ai-image-studio.com/v1'
});

// Generate image
const generation = await client.images.generate({
  prompt: 'Sebuah kota futuristik',
  styleTemplate: 'photorealistic',
  quality: 'high'
});

// Wait for completion
const result = await client.images.waitForCompletion(generation.generationId);
console.log('Generated image:', result.results[0].url);
```

#### Python
```bash
pip install ai-image-studio
```

```python
from ai_image_studio import AIImageStudio

client = AIImageStudio(api_key='your_api_key')

# Generate image
generation = client.images.generate(
    prompt='Sebuah kota futuristik',
    style_template='photorealistic',
    quality='high'
)

# Wait for completion
result = client.images.wait_for_completion(generation.generation_id)
print('Generated image:', result.results[0].url)
```

#### PHP
```bash
composer require ai-image-studio/sdk
```

```php
use AIImageStudio\AIImageStudio;

$client = new AIImageStudio([
    'api_key' => 'your_api_key'
]);

$generation = $client->images->generate([
    'prompt' => 'Sebuah kota futuristik',
    'style_template' => 'photorealistic',
    'quality' => 'high'
]);

$result = $client->images->waitForCompletion($generation['generationId']);
echo 'Generated image: ' . $result['results'][0]['url'];
```

### Third-party Integrations

#### Postman Collection
[Download Postman Collection](https://api.ai-image-studio.com/postman-collection)

#### OpenAPI Specification
[Download OpenAPI Spec](https://api.ai-image-studio.com/openapi.yaml)

#### Insomnia Collection
[Download Insomnia Collection](https://api.ai-image-studio.com/insomnia-collection)

## 📝 Examples & Use Cases

### Basic Example - Single Image Generation
```javascript
// Generate single image
const result = await fetch('/api/v1/images/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  },
  body: JSON.stringify({
    prompt: 'Sebuah sunset yang indah di atas danau',
    styleTemplate: 'photorealistic',
    aspectRatio: '16:9',
    quality: 'high'
  })
});

const { data } = await result.json();
console.log('Generation ID:', data.generationId);
```

### Advanced Example - Batch Generation with Variations
```javascript
// Generate multiple variations
const batchResult = await fetch('/api/v1/images/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  },
  body: JSON.stringify({
    prompt: 'Living room modern dengan natural light',
    styleTemplate: 'photorealistic',
    aspectRatio: '16:9',
    quality: 'ultra',
    variations: 4,
    seed: 12345
  })
});

const { data } = await batchResult.json();

// Monitor progress dengan WebSocket
const ws = new WebSocket(`wss://api.ai-image-studio.com/v1/ws/generate`);
ws.onmessage = (event) => {
  const progress = JSON.parse(event.data);
  console.log('Progress:', progress.progress);

  if (progress.status === 'completed') {
    // Handle completed generation
    console.log('All images generated:', progress.results);
  }
};
```

### E-commerce Integration Example
```javascript
class ProductImageGenerator {
  constructor(apiKey) {
    this.client = new AIImageStudio({ apiKey });
  }

  async generateProductImage(productName, category, brand) {
    const prompt = `Product photography dari ${productName}, ${category}, pada background putih, studio lighting, ${brand} brand style`;

    const generation = await this.client.images.generate({
      prompt,
      styleTemplate: 'photorealistic',
      aspectRatio: '1:1',
      quality: 'ultra',
      negativePrompt: 'text, watermarks, logos, people'
    });

    const result = await this.client.images.waitForCompletion(generation.generationId);

    return {
      imageUrl: result.results[0].url,
      thumbnailUrl: result.results[0].thumbnailUrl,
      metadata: result.results[0].metadata
    };
  }

  async batchGenerateProducts(products) {
    const promises = products.map(product =>
      this.generateProductImage(product.name, product.category, product.brand)
    );

    return Promise.all(promises);
  }
}

// Usage
const generator = new ProductImageGenerator('your_api_key');
const images = await generator.batchGenerateProducts([
  { name: 'Wireless Headphones', category: 'electronics', brand: 'TechBrand' },
  { name: 'Running Shoes', category: 'footwear', brand: 'SportGear' }
]);
```

### Social Media Integration Example
```javascript
class SocialMediaContentGenerator {
  constructor(apiKey) {
    this.client = new AIImageStudio({ apiKey });
  }

  async generateInstagramPost(topic, style, audience) {
    const aspectRatios = {
      'post': '1:1',
      'story': '9:16',
      'carousel': '1:1'
    };

    const prompt = `Instagram-worthy ${topic} content untuk ${audience}, trending style, high engagement potential, professional photography`;

    const generation = await this.client.images.generate({
      prompt,
      styleTemplate: style,
      aspectRatio: aspectRatios.post,
      quality: 'high',
      negativePrompt: 'text, watermarks, grainy, blurry'
    });

    return this.client.images.waitForCompletion(generation.generationId);
  }

  async generateContentCalendar(posts) {
    const calendar = [];

    for (const post of posts) {
      const image = await this.generateInstagramPost(
        post.topic,
        post.style,
        post.audience
      );

      calendar.push({
        ...post,
        image: image.results[0],
        scheduledDate: post.scheduledDate
      });
    }

    return calendar;
  }
}
```

## 📞 Support & Resources

### Documentation
- **API Reference:** [https://docs.ai-image-studio.com/api](https://docs.ai-image-studio.com/api)
- **Guides:** [https://docs.ai-image-studio.com/guides](https://docs.ai-image-studio.com/guides)
- **Examples:** [https://docs.ai-image-studio.com/examples](https://docs.ai-image-studio.com/examples)
- **SDK Documentation:** [https://docs.ai-image-studio.com/sdk](https://docs.ai-image-studio.com/sdk)

### Support Channels
- **Email:** api-support@ai-image-studio.com
- **Support Portal:** [https://support.ai-image-studio.com](https://support.ai-image-studio.com)
- **Community Forum:** [https://community.ai-image-studio.com](https://community.ai-image-studio.com)
- **Status Page:** [https://status.ai-image-studio.com](https://status.ai-image-studio.com)

### Rate Limit Support
- **Tier Upgrade Requests:** [Contact Sales](mailto:sales@ai-image-studio.com)
- **Enterprise Custom Limits:** [Contact Sales](mailto:enterprise@ai-image-studio.com)
- **Rate Limit Appeals:** [Submit Ticket](https://support.ai-image-studio.com/tickets)

### Change Log
- **Version 1.0.0:** Initial API release
- **Version 1.1.0:** Added batch generation (planned)
- **Version 1.2.0:** Enhanced editing capabilities (planned)

---

## 🎯 Free API Summary

### What's Included (Free Forever):
- **50 generations per day** per user
- **20+ style templates** for free use
- **Basic image editing** (crop, filters, text)
- **No watermarks** on generated images
- **Unlimited gallery** storage
- **Full API access** within limits
- **Community support** via GitHub

### Rate Limits:
- **Daily:** 50 image generations
- **Hourly:** 100 API requests
- **Concurrent:** 5 generations at once
- **Reset:** Daily at 00:00 UTC

### Tips for Free API Users:
1. **Batch your requests:** Generate multiple images in sequence
2. **Use caching:** Store generated images locally
3. **Optimize prompts:** Better prompts = better results
4. **Use templates:** Pre-made templates save time
5. **Join community:** Get help and share tips

---

**© 2025 AI Image Studio Pro. All rights reserved.**
**Version:** v2.0.0 (Free Forever)
**Last updated:** 2025-01-12
**GitHub:** https://github.com/aimastermebjm-byte/ai-image-studio-pro

**🌟 Free API - Community Powered - Open Source**