'use client';

import { useState, useEffect } from 'react';
import { X, Download, Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface InstallPromptProps {
  className?: string;
}

export function InstallPrompt({ className }: InstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      // Check for standalone mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebApp = (window.navigator as any).standalone || isStandalone;
      const isInWebAppiOS = (window.navigator as any).standalone === true;

      return isStandalone || isInWebAppiOS || isInWebApp;
    };

    setIsInstalled(checkInstalled());

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();

      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);

      // Show prompt after delay
      setTimeout(() => {
        if (!dismissed && !checkInstalled()) {
          setShowPrompt(true);
        }
      }, 5000); // Show after 5 seconds
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);

      toast({
        title: 'Aplikasi Terinstal! 🎉',
        description: 'AI Image Studio Pro berhasil diinstal di perangkat Anda.',
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if previously dismissed
    const previouslyDismissed = localStorage.getItem('pwa-install-dismissed');
    if (previouslyDismissed) {
      const dismissedTime = parseInt(previouslyDismissed);
      const oneWeek = 7 * 24 * 60 * 60 * 1000;

      // Show again after 1 week
      if (Date.now() - dismissedTime > oneWeek) {
        localStorage.removeItem('pwa-install-dismissed');
      } else {
        setDismissed(true);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [dismissed, toast]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      // Show the install prompt
      await deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        toast({
          title: 'Menginstal Aplikasi...',
          description: 'Aplikasi sedang diinstal. Mohon tunggu sebentar.',
        });
      } else {
        // User dismissed, don't show again for a while
        handleDismiss();
      }

      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('Error installing PWA:', error);
      toast({
        title: 'Gagal Menginstal',
        description: 'Terjadi kesalahan saat menginstal aplikasi. Silakan coba lagi.',
        variant: 'destructive',
      });
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  const handleInstallClick = () => {
    // For iOS devices that don't support beforeinstallprompt
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIOS) {
      // Show iOS install instructions
      toast({
        title: 'Instal di iOS',
        description: 'Tekan tombol Share lalu pilih "Add to Home Screen"',
        duration: 10000,
      });
      handleDismiss();
    } else {
      handleInstall();
    }
  };

  // Don't show if already installed or dismissed
  if (isInstalled || !showPrompt || dismissed) {
    return null;
  }

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  return (
    <div
      className={cn(
        'fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm animate-slide-in md:left-auto md:right-4',
        className
      )}
    >
      <div className="rounded-lg border bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
              {isMobile ? (
                <Smartphone className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              ) : (
                <Monitor className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Instal Aplikasi
              </h3>
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 rounded-md p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Tutup</span>
              </button>
            </div>

            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {isIOS
                ? 'Instal aplikasi untuk akses cepat dan mode offline.'
                : 'Pasang AI Image Studio Pro di perangkat Anda untuk pengalaman terbaik.'
              }
            </p>

            <div className="mt-3 flex gap-2">
              <Button
                onClick={handleInstallClick}
                size="sm"
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                {isIOS ? 'Petunjuk' : 'Instal'}
              </Button>

              <Button
                onClick={handleDismiss}
                variant="outline"
                size="sm"
              >
                Nanti
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}