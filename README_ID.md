# AI Image Studio Pro (Free Version)

> **Platform Generasi Gambar AI Gratis + PWA**
>
> Generate gambar menakjubkan dengan Google Gemini API • Progressive Web App • Offline capability • 100% Free

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-Free%20Forever-green)
![PWA](https://img.shields.io/badge/PWA-Ready-blue)

## 🎯 Overview

AI Image Studio Pro adalah aplikasi web **gratis** yang memanfaatkan Google's Gemini API untuk menghasilkan gambar berkualitas tinggi dari text prompts. Didesain sebagai **Progressive Web App (PWA)** yang bisa di-install dan digunakan offline. Sempurna untuk content creators, marketers, designers, dan siapa saja yang membutuhkan gambar AI-generated **tanpa biaya**.

### ✨ Fitur Utama (100% Gratis)

- 🎨 **Generasi AI Gratis** Gunakan Gemini API key Anda sendiri
- ⚡ **Super Cepat** Waktu generasi sub-5 detik
- 📱 **PWA Installable** Install seperti aplikasi native di mobile/desktop
- 🚫 **Offline First** Akses gambar yang sudah di-generate tanpa internet
- 🎭 **20+ Template Style** Preset profesional (gratis)
- 🔧 **Editing Dasar** Crop, filters, text overlay
- 💾 **Multi-Format Export** Support PNG, JPG, WebP
- 🗂️ **Smart Gallery** Organisasi dengan auto-tagging
- 🔄 **Auto Cache** Generated images tersimpan otomatis
- 📊 **50 Images/Hari** Limit generous untuk free usage

## 🚀 Quick Start (Gratis Setup)

### Prerequisites (Minimal)

- **Gemini API Key** (Dapatkan gratis dari [Google AI Studio](https://makersuite.google.com/app/apikey))
- **Node.js 18+**
- **GitHub Account** (untuk deployment)

### 🎯 One-Click Deployment (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aimastermebjm-byte/ai-image-studio-pro)

1. Klik tombol "Deploy with Vercel"
2. Masukkan Gemini API key Anda: `AIzaSyBF10AXp7nmjFMCQoAWDAzomgWEuJPhW2Y`
3. Deploy selesai dalam 2 menit! 🎉

### 🛠 Local Development

```bash
# Clone repository
git clone https://github.com/aimastermebjm-byte/ai-image-studio-pro.git
cd ai-image-studio-pro

# Install dependencies
npm install

# Setup environment (hanya API key yang dibutuhkan)
cp .env.example .env.local
```

### Environment Setup (Super Simple)

Buat file `.env.local` dengan berikut:

```env
# Gemini API Configuration (REQUIRED)
GEMINI_API_KEY=AIzaSyBF10AXp7nmjFMCQoAWDAzomgWEuJPhW2Y
GEMINI_API_URL=https://generativelanguage.googleapis.com

# Supabase (Auto-setup saat deploy)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_key

# Development URLs
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key_min_32_chars
```

### Start Development

```bash
# Start development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk mulai membuat! 🚀

### 📱 PWA Installation

Setelah deploy:
1. **Mobile:** Buka website → Tap "Add to Home Screen"
2. **Desktop:** Buka Chrome → Klik icon install → "Install App"
3. **Offline:** Generated images otomatis tersimpan untuk akses offline

## 📁 Struktur Proyek (PWA Optimized)

```
ai-image-studio-pro/
├── src/
│   ├── app/                    # Next.js 15 App Router (PWA)
│   │   ├── (auth)/            # Authentication
│   │   ├── dashboard/         # User dashboard
│   │   ├── generate/          # Image generation
│   │   └── gallery/           # Offline-ready gallery
│   ├── components/            # Reusable React components
│   │   ├── ui/               # Base UI components
│   │   ├── forms/            # Form components
│   │   ├── image/            # Image-specific components
│   │   └── pwa/              # PWA components
│   │       ├── InstallPrompt.tsx
│   │       ├── OfflineIndicator.tsx
│   │       └── CacheManager.tsx
│   ├── lib/                  # Utilities and configurations
│   │   ├── gemini/           # Gemini API integration
│   │   ├── supabase/         # Supabase client
│   │   ├── pwa/              # PWA utilities
│   │   └── utils/            # Helper functions
│   └── types/                # TypeScript definitions
├── public/                   # Static assets
│   ├── manifest.json         # PWA manifest
│   ├── sw.js                 # Service worker
│   ├── icons/               # PWA icons (multiple sizes)
│   └── offline.html         # Offline fallback
├── docs/                     # Documentation
└── supabase/                 # Database migrations (auto-setup)
```

## 🛠 Tech Stack (100% Free)

### Frontend (PWA)
- **Framework:** Next.js 15 dengan App Router
- **Language:** TypeScript 5.0+
- **Styling:** Tailwind CSS 4.0
- **State Management:** Zustand (lightweight)
- **Forms:** React Hook Form + Zod
- **UI Components:** Radix UI (accessible)
- **PWA:** Service Worker + Manifest
- **Image Processing:** Canvas API (browser native)

### Backend (Serverless)
- **Runtime:** Node.js 20 (Vercel)
- **Framework:** Next.js API Routes
- **Database:** Supabase PostgreSQL (free tier)
- **Authentication:** NextAuth.js
- **File Storage:** Supabase Storage (1GB free)
- **Caching:** Vercel KV (free tier)
- **Email:** Resend (3k/mo free)

### AI & APIs (Free)
- **AI Generation:** Google Gemini API (your key)
- **Image Processing:** Canvas API (browser)
- **Content Moderation:** Simple filters (no API cost)
- **Analytics:** Vercel Analytics (free)

### Infrastructure (Free)
- **Deployment:** Vercel (100GB bandwidth free)
- **Database:** Supabase (auto-scaling free tier)
- **Storage:** Supabase Storage (1GB + CDN)
- **Monitoring:** Vercel Logs (free)
- **CI/CD:** GitHub Actions (free)

## 🎨 Contoh Penggunaan (Free Version)

### Generasi Gambar Dasar

```typescript
import { generateImage } from '@/lib/gemini';

const imageData = await generateImage({
  prompt: "Sebuah kota futuristik di senja dengan gaya cyberpunk",
  style: "photorealistic",
  aspectRatio: "16:9",
  quality: "high" // Tersedia: standard, high (free tier)
});
```

### Generasi dengan Template Style

```typescript
const styledImage = await generateImage({
  prompt: "Gunung Fuji di pagi hari dengan bunga sakura",
  styleTemplate: "anime-style", // 20+ free templates
  aspectRatio: "1:1",
  quality: "standard"
});
```

### Offline Cache Management

```typescript
import { cacheImage, getCachedImages } from '@/lib/pwa/cache';

// Cache generated image untuk offline access
await cacheImage({
  id: 'img_123',
  url: imageData.url,
  prompt: imageData.prompt
});

// Get cached images untuk offline viewing
const cachedImages = await getCachedImages();
```

### PWA Install Check

```typescript
import { usePWAInstall } from '@/hooks/usePWAInstall';

function App() {
  const { isInstallable, install } = usePWAInstall();

  if (isInstallable) {
    return <button onClick={install}>Install App</button>;
  }
  return null;
}
```

## 📊 Fitur dalam Detail (Free Version)

### AI Generation Engine (Gratis)
- **Direct Gemini API**: Gunakan API key Anda sendiri
- **Style Templates**: 20+ preset free templates
- **Prompt Enhancement**: Optimasi dasar untuk hasil terbaik
- **Single Generation**: Generate gambar satu per satu (quality focus)
- **Basic Variations**: Generate dengan seed yang sama untuk variasi

### Editing Tools (Basic tapi Powerful)
- **Cropping & Resizing**: Tools editing presisi
- **Basic Filters**: 10+ filter essential (vintage, B&W, blur)
- **Text Overlay**: Tambah text dengan fonts standar
- **Color Adjustment**: Brightness, contrast, saturation sederhana
- **Format Export**: PNG, JPG, WebP (multiple quality)

### PWA & Offline Features
- **Offline Gallery**: Akses semua generated images tanpa internet
- **Smart Caching**: Auto-cache untuk performa optimal
- **Install Prompt**: Native app installation
- **Background Sync**: Sync images saat online kembali
- **Offline Notifications**: Status generation yang pending

### Gallery Management (Simplified)
- **Auto-tagging**: Basic AI tags untuk organization
- **Simple Search**: Cari berdasarkan prompt dan tags
- **Collections**: Organisasi gambar ke folder
- **Local Storage**: Priority caching untuk user favorites
- **Export All**: Batch download dalam ZIP

### Free Usage Model
- **Daily Limit**: 50 images per hari per user
- **Fair Use**: Rate limiting untuk prevent abuse
- **Community Features**: Share ke social media langsung
- **No Watermarks**: Generated images murni tanpa watermark

## 🧪 Testing (Simplified)

```bash
# Run unit tests
npm test

# Test PWA functionality
npm run test:pwa

# Test offline functionality
npm run test:offline

# Lint code
npm run lint
```

## 📦 Build & Deployment (Free)

### Development
```bash
# Start development server
npm run dev

# Test PWA installability
npm run build && npm run start

# Check PWA manifest
npm run pwa:check
```

### Production Build
```bash
# Build untuk production (PWA optimized)
npm run build

# Start production server
npm run start

# Test service worker
npm run sw:test
```

### 🚀 One-Click Deployment

**Cara termudah (recommended):**

1. Fork repository ini
2. Buka [Vercel](https://vercel.com/new)
3. Import forked repository
4. Masukkan environment variables:
   - `GEMINI_API_KEY`: `AIzaSyBF10AXp7nmjFMCQoAWDAzomgWEuJPhW2Y`
5. Click "Deploy" ✅

**Manual Deployment:**
```bash
# Deploy ke Vercel (free tier)
vercel --prod

# Setup Supabase (free)
npm run supabase:init
```

## 🎯 API Documentation (Free Version)

Untuk dokumentasi API detail, kunjungi [API Docs](./API_DOCS_ID.md).

### Key Endpoints (Free Tier)

- `POST /api/generate` - Generate gambar dengan limit 50/hari
- `GET /api/gallery` - Retrieve user gallery (offline ready)
- `POST /api/edit` - Basic image edits
- `GET /api/templates` - Get 20+ free style templates
- `POST /api/download` - Download generated images (no watermark)

## 🔧 Configuration (Simplified)

### Gemini API Setup (Hanya ini yang dibutuhkan!)

1. Dapatkan **FREE API key** dari [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Gunakan API key ini: `AIzaSyBF10AXp7nmjFMCQoAWDAzomgWEuJPhW2Y`
3. Tambahkan ke environment variables

### Database Setup (Auto-magic)

```bash
# Supabase auto-setup saat deploy
npm run supabase:init

# Local development
npm run dev
# Database otomatis dibuat!
```

### PWA Configuration (Auto-generated)

```bash
# Generate PWA manifest
npm run pwa:generate

# Test service worker
npm run pwa:test
```

## 🤝 Contributing (Community Driven)

1. ⭐ **Star** repository ini
2. Fork repository
3. Create feature branch (`git checkout -b feature/amazing-feature`)
4. Commit changes (`git commit -m 'Add amazing free feature'`)
5. Push ke branch (`git push origin feature/amazing-feature`)
6. Open Pull Request

**Priority Areas:**
- 📱 Better PWA features
- 🎨 New free templates
- 🔧 Offline enhancements
- 🐛 Bug fixes
- 📚 Documentation improvements

## 📄 License

MIT License - Bisa digunakan untuk commercial projects!

## 🤝 Support (Free Community)

- **GitHub Issues:** [Report bugs/request features](https://github.com/aimastermebjm-byte/ai-image-studio-pro/issues)
- **Discussions:** [Community discussions](https://github.com/aimastermebjm-byte/ai-image-studio-pro/discussions)
- **GitHub Sponsors:** [Support development](https://github.com/sponsors/aimastermebjm-byte)

## 🚀 Roadmap (Free Forever)

### Phase 1 (Current)
- [x] PWA installation
- [x] Offline gallery access
- [x] 50 images/day limit
- [x] Basic editing tools

### Phase 2 (3 months)
- [ ] Offline AI generation (local models)
- [ ] Advanced filters
- [ ] Community templates
- [ ] Mobile app improvements

### Phase 3 (6 months)
- [ ] API for developers (free tier)
- [ ] Advanced PWA features
- [ ] Community marketplace
- [ ] Educational features

---

**🌟 Free Forever - No Hidden Costs - Community Powered**

Made with ❤️ menggunakan Next.js 15, TypeScript, dan Google Gemini API

**GitHub:** https://github.com/aimastermebjm-byte/ai-image-studio-pro