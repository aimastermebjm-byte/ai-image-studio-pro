import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { InstallPrompt } from '@/components/pwa/install-prompt';
import { OfflineIndicator } from '@/components/pwa/offline-indicator';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'AI Image Studio Pro - Generator Gambar AI Gratis',
    template: '%s | AI Image Studio Pro',
  },
  description: 'Generate gambar AI berkualitas tinggi secara gratis dengan Google Gemini API. Progressive Web App dengan offline support.',
  keywords: [
    'AI Image Generator',
    'Gambar AI',
    'Google Gemini',
    'PWA',
    'Offline',
    'Gratis',
    'Image Studio',
    'Artificial Intelligence',
  ],
  authors: [{ name: 'AI Image Studio Pro Team' }],
  creator: 'AI Image Studio Pro',
  publisher: 'AI Image Studio Pro',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://ai-image-studio-pro.vercel.app',
    title: 'AI Image Studio Pro - Generator Gambar AI Gratis',
    description: 'Generate gambar AI berkualitas tinggi secara gratis dengan Google Gemini API.',
    siteName: 'AI Image Studio Pro',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Image Studio Pro - Generator Gambar AI Gratis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Image Studio Pro - Generator Gambar AI Gratis',
    description: 'Generate gambar AI berkualitas tinggi secara gratis dengan Google Gemini API.',
    images: ['/og-image.png'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: '#10b981',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    title: 'AI Image Studio Pro',
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
  applicationName: 'AI Image Studio Pro',
  appDescription: 'Generator Gambar AI Gratis dengan PWA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AI Studio Pro" />
        <meta name="application-name" content="AI Studio Pro" />
        <meta name="msapplication-TileColor" content="#10b981" />
        <meta name="theme-color" content="#10b981" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="mask-icon" href="/icons/icon-512x512.png" color="#10b981" />

        {/* PWA Setup */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />

        {/* Remove loading spinner for PWA */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              body {
                overflow-x: hidden;
              }

              /* Loading states */
              .loading-spinner {
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 2px solid rgba(0, 0, 0, 0.1);
                border-radius: 50%;
                border-top-color: #10b981;
                animation: spin 1s ease-in-out infinite;
              }

              @keyframes spin {
                to { transform: rotate(360deg); }
              }

              /* PWA Safe Area */
              .safe-area-inset-top {
                padding-top: env(safe-area-inset-top);
              }

              .safe-area-inset-bottom {
                padding-bottom: env(safe-area-inset-bottom);
              }

              .safe-area-inset-left {
                padding-left: env(safe-area-inset-left);
              }

              .safe-area-inset-right {
                padding-right: env(safe-area-inset-right);
              }
            `,
          }}
        />
      </head>

      <body className={`${inter.className} h-full bg-gray-50 text-gray-900 antialiased dark:bg-gray-900 dark:text-gray-100`}>
        <div className="flex h-full flex-col">
          {/* Offline Alert Banner */}
          <div id="offline-banner" className="hidden">
            {/* Populated by OfflineIndicator */}
          </div>

          {/* Main Content */}
          <main className="flex-1 safe-area-inset-top safe-area-inset-bottom">
            {children}
          </main>

          {/* PWA Components */}
          <InstallPrompt />
          <div className="fixed bottom-4 right-4 z-40">
            <OfflineIndicator showDetails={false} />
          </div>

          {/* Toast Notifications */}
          <Toaster />
        </div>

        {/* PWA Installation Scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Handle display mode changes
              window.addEventListener('DOMContentLoaded', () => {
                const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
                const isInWebApp = (window.navigator as any).standalone || isStandalone;

                if (isInWebApp) {
                  document.body.classList.add('pwa-installed');
                }
              });

              // Handle online/offline status
              window.addEventListener('online', () => {
                document.body.classList.remove('offline');
                document.body.classList.add('online');
              });

              window.addEventListener('offline', () => {
                document.body.classList.remove('online');
                document.body.classList.add('offline');
              });

              // Initialize connection status
              if (navigator.onLine) {
                document.body.classList.add('online');
              } else {
                document.body.classList.add('offline');
              }
            `,
          }}
        />
      </body>
    </html>
  );
}