import { Metadata } from 'next';
import Link from 'next/link';
import {
  Sparkles,
  Palette,
  Zap,
  Download,
  Smartphone,
  Shield,
  ArrowRight,
  Image as ImageIcon,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Beranda - Generator Gambar AI Gratis',
  description: 'Buat gambar AI berkualitas tinggi secara gratis dengan Google Gemini API. Progressive Web App dengan offline support.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-900 dark:to-primary-900/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container-responsive py-20 sm:py-24 lg:py-32">
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center rounded-full bg-primary-100 px-4 py-2 text-sm font-medium text-primary-800 ring-1 ring-primary-200 dark:bg-primary-900/30 dark:text-primary-200 dark:ring-primary-800">
              <Sparkles className="mr-2 h-4 w-4" />
              Powered by Google Gemini AI
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
              Generator Gambar
              <span className="gradient-text ml-2">AI Gratis</span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-600 dark:text-gray-300 sm:text-2xl">
              Buat gambar berkualitas tinggi dengan AI secara gratis.
              Tidak ada watermark, bisa diinstall sebagai aplikasi, dan bekerja offline!
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-3">
                <Link href="/generate">
                  <ImageIcon className="mr-2 h-5 w-5" />
                  Mulai Generate
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
                <Link href="#features">
                  Pelajari Lebih Lanjut
                </Link>
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span>4.9 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-green-500" />
                <span>10K+ Downloads</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                <span>100% Gratis</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="relative mt-16 lg:mt-24">
            <div className="mx-auto max-w-5xl">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-gradient-to-r from-primary-400 to-primary-600 p-1 shadow-2xl dark:from-primary-600 dark:to-primary-800">
                <div className="h-full w-full rounded-2xl bg-white/95 p-8 backdrop-blur-sm dark:bg-gray-900/95">
                  <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* Placeholder for generated images preview */}
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700"
                      >
                        <div className="text-center">
                          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Gambar AI {i}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary-200/20 blur-3xl dark:bg-primary-800/20"></div>
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-200/20 blur-3xl dark:bg-blue-800/20"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32">
        <div className="container-responsive">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Mengapa Memilih AI Image Studio Pro?
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Fitur lengkap untuk kebutuhan generasi gambar AI Anda
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-primary-200 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-700"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                  <feature.icon className="h-6 w-6" />
                </div>

                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>

                <div className="mt-4">
                  <Link
                    href={feature.link}
                    className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Pelajari lebih lanjut
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 sm:py-32 bg-gray-50 dark:bg-gray-900/50">
        <div className="container-responsive">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Cara Kerja
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              3 langkah mudah untuk membuat gambar AI berkualitas tinggi
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600 text-lg font-bold dark:bg-primary-900/30 dark:text-primary-400">
                  {index + 1}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg" className="text-lg px-8 py-3">
              <Link href="/generate">
                <Zap className="mr-2 h-5 w-5" />
                Mulai Sekarang
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32">
        <div className="container-responsive">
          <div className="mx-auto max-w-2xl rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 p-8 text-center shadow-2xl dark:from-primary-700 dark:to-primary-900">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Siap Membuat Gambar AI?
            </h2>
            <p className="mt-4 text-lg text-primary-100">
              Gratis selamanya, tanpa watermark, dan bekerja offline
            </p>
            <div className="mt-8">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-3 bg-white text-primary-600 hover:bg-gray-50">
                <Link href="/generate">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Mulai Generate Gratis
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Data
const features = [
  {
    title: '100% Gratis',
    description: 'Tidak ada biaya tersembunyi. Generate gambar tanpa batasan dengan API key Anda sendiri.',
    icon: Sparkles,
    link: '/pricing',
  },
  {
    title: 'PWA Ready',
    description: 'Install sebagai aplikasi di desktop dan mobile. Bekerja offline dengan cache.',
    icon: Smartphone,
    link: '#features',
  },
  {
    title: 'Tanpa Watermark',
    description: 'Hasil generate murni tanpa watermark. Download dalam resolusi tinggi.',
    icon: Download,
    link: '#features',
  },
  {
    title: 'Multiple Styles',
    description: 'Berbagai template gaya: anime, realistic, cartoon, oil painting, dan lainnya.',
    icon: Palette,
    link: '/templates',
  },
  {
    title: 'Super Cepat',
    description: 'Generate gambar dalam hitungan detik dengan optimasi terbaru.',
    icon: Zap,
    link: '#features',
  },
  {
    title: 'Privacy First',
    description: 'Data Anda aman. Tidak ada penyimpanan data pribadi tanpa persetujuan.',
    icon: Shield,
    link: '/privacy',
  },
];

const steps = [
  {
    title: 'Masukkan API Key',
    description: 'Gunakan Google Gemini API key Anda (gratis untuk uji coba).',
  },
  {
    title: 'Tulis Prompt',
    description: 'Deskripsikan gambar yang ingin Anda buat, pilih gaya dan kualitas.',
  },
  {
    title: 'Generate & Download',
    description: 'Klik generate dan download hasilnya dalam resolusi tinggi.',
  },
];