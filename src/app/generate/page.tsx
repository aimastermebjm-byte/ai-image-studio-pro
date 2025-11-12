import { Metadata } from 'next';
import ImageGenerator from '@/components/generate/image-generator';
import { Suspense } from 'react';
import ImageGeneratorSkeleton from '@/components/generate/image-generator-skeleton';

export const metadata: Metadata = {
  title: 'Generate Gambar AI - AI Image Studio Pro',
  description: 'Buat gambar AI berkualitas tinggi dengan berbagai gaya dan kualitas. Powered by Google Gemini API.',
};

export default function GeneratePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-responsive py-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Generate Gambar AI
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Buat gambar berkualitas tinggi dengan Google Gemini API
            </p>
          </div>

          {/* Generator Component */}
          <Suspense fallback={<ImageGeneratorSkeleton />}>
            <ImageGenerator />
          </Suspense>
        </div>
      </div>
    </div>
  );
}