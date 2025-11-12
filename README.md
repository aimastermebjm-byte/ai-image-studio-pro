# AI Image Studio Pro - Generator Gambar AI Gratis

> **Versi:** 2.0 (Free Forever + PWA)
> **Deskripsi:** Generator gambar AI berkualitas tinggi dengan Google Gemini API. Progressive Web App dengan offline support.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aimastermebjm-byte/ai-image-studio-pro)

## ✨ Fitur Utama

- 🎨 **Generate Gambar AI** - Powered by Google Gemini API
- 📱 **PWA Ready** - Install sebagai aplikasi di desktop & mobile
- 🌐 **Offline Support** - Bekerja tanpa internet
- 💰 **100% Gratis** - Tidak ada biaya tersembunyi
- 🚫 **No Watermark** - Hasil generate murni tanpa watermark
- 🎭 **10+ Style Templates** - Anime, realistic, cyberpunk, dll
- 📊 **50 Images/Hari** - Batas wajar untuk penggunaan adil
- ⚡ **Super Cepat** - Generate gambar dalam hitungan detik
- 🔒 **Privacy First** - Data Anda aman dan terlindungi

## 🚀 Quick Start (5 Menit)

### 1. Clone Repository

```bash
git clone https://github.com/aimastermebjm-byte/ai-image-studio-pro.git
cd ai-image-studio-pro
```

### 2. Setup Environment

```bash
# Copy environment template
cp .env.example .env.local

# Edit dengan konfigurasi Anda
nano .env.local
```

**Environment Variables:**

```env
# Gemini API (WAJIB)
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyBF10AXp7nmjFMCQoAWDAzomgWEuJPhW2Y

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install Dependencies

```bash
# Menggunakan npm
npm install

# Atau pnpm (lebih cepat)
pnpm install
```

### 4. Setup Database

1. Buat proyek baru di [Supabase](https://supabase.com)
2. Jalankan migration file `supabase/migrations/001_initial_schema.sql`
3. Copy Supabase URL dan keys ke `.env.local`

### 5. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

## 📱 PWA Installation

### Desktop (Chrome/Edge)
1. Buka aplikasi di browser
2. Klik icon install di address bar
3. Klik "Install"

### Mobile (Android/iOS)
1. Buka aplikasi di Chrome/Safari
2. Tap menu (3 titik) → "Add to Home Screen"
3. Tap "Add"

### iOS Manual Installation
1. Tap Share icon
2. Scroll dan tap "Add to Home Screen"
3. Tap "Add"

## 🎨 Cara Penggunaan

### 1. Dapatkan Gemini API Key

1. Kunjungi [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Login dengan Google account
3. Klik "Create API Key"
4. Copy API key

### 2. Generate Gambar

1. Masukkan API key Gemini Anda
2. Tulis prompt deskripsi gambar
3. Pilih style dan kualitas
4. Klik "Generate Gambar"

### 3. Download & Share

- Download gambar dalam resolusi tinggi
- Share ke media sosial
- Simpan ke galeri offline

## 🛠 Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **UI Components:** Radix UI, Lucide Icons
- **State Management:** Zustand
- **PWA:** Service Worker, Web App Manifest
- **Backend:** Next.js API Routes, Edge Functions
- **Database:** Supabase (PostgreSQL)
- **AI:** Google Gemini API
- **Deployment:** Vercel (Free Tier)

## 📦 Struktur Proyek

```
ai-image-studio-pro/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API endpoints
│   │   ├── generate/       # Generate page
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── ui/            # Base UI components
│   │   ├── pwa/           # PWA components
│   │   └── generate/      # Generator components
│   ├── lib/               # Utility libraries
│   │   ├── gemini.ts      # Gemini API integration
│   │   └── supabase.ts    # Supabase client
│   └── types/             # TypeScript types
├── public/                # Static assets
│   ├── manifest.json      # PWA manifest
│   └── sw.js             # Service worker
├── supabase/
│   └── migrations/        # Database schemas
└── docs/                  # Documentation
```

## 🔧 Development

### Scripts Tersedia

```bash
npm run dev          # Development server
npm run build        # Build untuk production
npm run start        # Start production server
npm run lint         # Linting code
npm run type-check   # TypeScript type checking
```

### Environment Variables

Lihat `.env.example` untuk environment variables lengkap:

```env
# API Configuration
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_GEMINI_API_URL=https://generativelanguage.googleapis.com

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="AI Image Studio Pro"

# PWA Configuration
NEXT_PUBLIC_PWA_ENABLED=true
NEXT_PUBLIC_OFFLINE_SUPPORTED=true

# Rate Limiting
DAILY_GENERATION_LIMIT=50
MONTHLY_GENERATION_LIMIT=1500
```

## 🚀 Deployment ke Vercel

### Automatic Deployment (Recommended)

1. Fork repository ini
2. Klik "Deploy with Vercel" di atas
3. Connect GitHub account
4. Add environment variables:
   - `NEXT_PUBLIC_GEMINI_API_KEY` (user akan input sendiri)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
5. Deploy! 🎉

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy
vercel --prod
```

## 📊 Rate Limiting

Untuk penggunaan yang adil:

- **50 images/hari** per user
- **1500 images/bulan** per user
- **Reset otomatis** setiap hari/bulan
- **User-provided API key** (tidak menggunakan quota kami)

## 🔒 Security Features

- **Row Level Security** di Supabase
- **Input validation** dengan Zod
- **Rate limiting** per user
- **Content moderation** otomatis
- **HTTPS only** di production
- **No API key storage** di server kami

## 🌐 Browser Support

- ✅ Chrome 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+
- ✅ Mobile Chrome
- ✅ Mobile Safari

## 📱 PWA Features

- **Installable** di desktop & mobile
- **Offline caching** untuk gallery
- **Background sync**
- **Push notifications** (optional)
- **App shortcuts**
- **Share target** untuk mobile
- **File handlers** untuk import gambar

## 🤝 Contributing

Contributions are welcome!

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - lihat [LICENSE](LICENSE) file untuk details.

## 🆘 Support & Help

### Documentation
- [Setup Guide](./SETUP_GUIDE_ID.md)
- [API Documentation](./API_DOCS_ID.md)
- [Architecture](./ARCHITECTURE_ID.md)

### Community
- [GitHub Issues](https://github.com/aimastermebjm-byte/ai-image-studio-pro/issues) - Report bugs
- [GitHub Discussions](https://github.com/aimastermebjm-byte/ai-image-studio-pro/discussions) - Ask questions

### Quick Help
- **API Key Issues:** Check Google AI Studio
- **Deployment Issues:** Check Vercel logs
- **Database Issues:** Check Supabase dashboard
- **PWA Issues:** Clear browser cache & retry

## 🎯 Roadmap

- [ ] More AI models (DALL-E, Midjourney, etc.)
- [ ] Advanced image editing tools
- [ ] Social sharing features
- [ ] Collaboration workspaces
- [ ] API for developers
- [ ] Mobile apps (React Native)

## 🚀 **Ready for Auto-Deploy**

Repository ini sudah siap untuk auto-deploy ke Vercel dengan GitHub integration.

**Latest Update**: Vercel deployment configuration optimized - January 2025

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=aimastermebjm-byte/ai-image-studio-pro&type=Date)](https://star-history.com/#aimastermebjm-byte/ai-image-studio-pro&Date)

---

**⚡ Made with ❤️ for the free AI community**

**🔗 GitHub:** https://github.com/aimastermebjm-byte/ai-image-studio-pro