'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { getNetworkStatus } from '@/lib/utils';

interface OfflineIndicatorProps {
  className?: string;
  showDetails?: boolean;
}

export function OfflineIndicator({ className, showDetails = false }: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string>('');
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [lastOnline, setLastOnline] = useState<Date | null>(null);
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Initial status
    setIsOnline(navigator.onLine);
    setLastOnline(new Date());

    // Get connection info
    const networkStatus = getNetworkStatus();
    setConnectionType(networkStatus.effectiveType || 'unknown');

    // Handle online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineAlert(false);
      setLastOnline(new Date());

      const networkStatus = getNetworkStatus();
      setConnectionType(networkStatus.effectiveType || 'unknown');

      toast({
        title: 'Koneksi Tersambung',
        description: 'Anda kembali online. Data akan disinkronkan.',
        duration: 3000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      setLastOnline(new Date());
      setShowOfflineAlert(true);

      toast({
        title: 'Koneksi Terputus',
        description: 'Anda sedang offline. Beberapa fitur mungkin tidak tersedia.',
        variant: 'destructive',
        duration: 5000,
      });
    };

    // Listen for connection changes
    const handleConnectionChange = () => {
      const networkStatus = getNetworkStatus();
      setConnectionType(networkStatus.effectiveType || 'unknown');

      if (networkStatus.effectiveType === 'slow-2g' || networkStatus.effectiveType === '2g') {
        toast({
          title: 'Koneksi Lambat',
          description: 'Koneksi internet Anda lambat. Mungkin ada penundaan.',
          variant: 'destructive',
          duration: 3000,
        });
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const connection = (navigator as any).connection ||
                      (navigator as any).mozConnection ||
                      (navigator as any).webkitConnection;

    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);

      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, [toast]);

  const handleRetryConnection = async () => {
    setIsReconnecting(true);

    try {
      // Try to fetch a small file to test connection
      const response = await fetch('/api/health', {
        method: 'HEAD',
        cache: 'no-cache',
      });

      if (response.ok) {
        // Connection is restored
        window.location.reload();
      } else {
        throw new Error('Network still unavailable');
      }
    } catch (error) {
      toast({
        title: 'Masih Offline',
        description: 'Tidak dapat terhubung ke server. Silakan coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setIsReconnecting(false);
    }
  };

  const getConnectionIcon = () => {
    if (!isOnline) {
      return <WifiOff className="h-4 w-4" />;
    }

    switch (connectionType) {
      case 'slow-2g':
      case '2g':
        return <WifiOff className="h-4 w-4 text-yellow-500" />;
      case '3g':
        return <Wifi className="h-4 w-4 text-yellow-500" />;
      case '4g':
        return <Wifi className="h-4 w-4 text-green-500" />;
      default:
        return <Wifi className="h-4 w-4 text-blue-500" />;
    }
  };

  const getConnectionStatus = () => {
    if (!isOnline) return 'Offline';

    switch (connectionType) {
      case 'slow-2g':
        return 'Sangat Lambat';
      case '2g':
        return 'Lambat';
      case '3g':
        return 'Sedang';
      case '4g':
        return 'Cepat';
      default:
        return 'Online';
    }
  };

  const getConnectionColor = () => {
    if (!isOnline) return 'text-red-500';

    switch (connectionType) {
      case 'slow-2g':
      case '2g':
        return 'text-yellow-500';
      case '3g':
        return 'text-yellow-500';
      case '4g':
        return 'text-green-500';
      default:
        return 'text-blue-500';
    }
  };

  // Compact indicator for header
  if (!showDetails) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 rounded-md px-2 py-1 text-sm',
          getConnectionColor(),
          className
        )}
        title={`Status: ${getConnectionStatus()}`}
      >
        {getConnectionIcon()}
        <span className="hidden sm:inline">{getConnectionStatus()}</span>
      </div>
    );
  }

  // Detailed indicator
  return (
    <>
      {/* Status Bar */}
      <div
        className={cn(
          'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm',
          isOnline
            ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200'
            : 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200',
          className
        )}
      >
        {getConnectionIcon()}

        <div className="flex-1 min-w-0">
          <div className="font-medium">
            {isOnline ? 'Online' : 'Offline'}
          </div>
          {isOnline && connectionType && (
            <div className="text-xs opacity-75">
              Koneksi {connectionType.toUpperCase()}
            </div>
          )}
        </div>

        {!isOnline && (
          <Button
            onClick={handleRetryConnection}
            disabled={isReconnecting}
            size="sm"
            variant="outline"
            className="h-8"
          >
            {isReconnecting ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2 hidden sm:inline">Coba Lagi</span>
          </Button>
        )}
      </div>

      {/* Offline Alert Banner */}
      {showOfflineAlert && !isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 border-b border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
          <div className="mx-auto flex max-w-4xl items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Mode Offline Aktif
              </p>
              <p className="text-xs text-red-600 dark:text-red-300">
                Anda sedang offline. Gambar yang telah dibuat tetap dapat diakses dari galeri.
              </p>
            </div>
            <Button
              onClick={() => setShowOfflineAlert(false)}
              variant="outline"
              size="sm"
              className="h-8 border-red-200 text-red-600 hover:bg-red-100 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              Tutup
            </Button>
          </div>
        </div>
      )}

      {/* Last Sync Info */}
      {lastOnline && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Terakhir online: {lastOnline.toLocaleTimeString('id-ID')}
        </div>
      )}
    </>
  );
}