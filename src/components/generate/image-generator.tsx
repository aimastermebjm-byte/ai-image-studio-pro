'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Sparkles,
  Download,
  Image as ImageIcon,
  Settings,
  Zap,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Info
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import type { GenerationRequest, GenerationResponse, UserLimits } from '@/types';
import { getStyleTemplates, getAspectRatioOptions, getQualityOptions } from '@/lib/gemini';

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [styleTemplate, setStyleTemplate] = useState('realistic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [quality, setQuality] = useState('standard');
  const [seed, setSeed] = useState<number | undefined>();
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [result, setResult] = useState<GenerationResponse | null>(null);
  const [userLimits, setUserLimits] = useState<UserLimits | null>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [aspectRatioOptions, setAspectRatioOptions] = useState<any[]>([]);
  const [qualityOptions, setQualityOptions] = useState<any[]>([]);
  const { toast } = useToast();

  // Load templates and options
  useEffect(() => {
    setTemplates(getStyleTemplates());
    setAspectRatioOptions(getAspectRatioOptions());
    setQualityOptions(getQualityOptions());
  }, []);

  // Load saved API key from localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }

    // Load user limits
    const userId = localStorage.getItem('user-id');
    if (userId) {
      fetchUserLimits(userId);
    }
  }, []);

  const fetchUserLimits = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/limits?user_id=${userId}`);
      const data = await response.json();
      if (data.success) {
        setUserLimits(data.data);
      }
    } catch (error) {
      console.error('Error fetching user limits:', error);
    }
  };

  const handleGenerate = async () => {
    // Validate inputs
    if (!prompt.trim()) {
      toast({
        title: 'Error',
        description: 'Prompt tidak boleh kosong',
        variant: 'destructive',
      });
      return;
    }

    if (!apiKey.trim()) {
      toast({
        title: 'Error',
        description: 'API Key Gemini diperlukan',
        variant: 'destructive',
      });
      return;
    }

    // Check user limits
    if (userLimits && userLimits.daily_remaining <= 0) {
      toast({
        title: 'Batas Harian Terlampaui',
        description: 'Anda telah mencapai batas generate hari ini. Coba lagi besok.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setResult(null);

    // Save API key
    localStorage.setItem('gemini-api-key', apiKey);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const request: GenerationRequest = {
        prompt: prompt.trim(),
        negative_prompt: negativePrompt.trim() || undefined,
        style_template: styleTemplate,
        aspect_ratio: aspectRatio,
        quality: quality as any,
        seed,
        user_id: localStorage.getItem('user-id') || undefined,
        api_key: apiKey,
      };

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);

      const data: GenerationResponse = await response.json();

      if (data.success && data.data) {
        setResult(data);
        toast({
          title: 'Berhasil!',
          description: 'Gambar berhasil dibuat',
        });

        // Update user limits
        const userId = localStorage.getItem('user-id');
        if (userId) {
          fetchUserLimits(userId);
        }

        // Clear prompt
        setPrompt('');
        setNegativePrompt('');
      } else {
        throw new Error(data.error || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Gagal membuat gambar',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleDownload = () => {
    if (!result?.data?.image_url) return;

    const link = document.createElement('a');
    link.href = result.data.image_url;
    link.download = `ai-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Download Berhasil',
      description: 'Gambar telah diunduh',
    });
  };

  const handleRandomSeed = () => {
    setSeed(Math.floor(Math.random() * 1000000));
  };

  return (
    <div className="space-y-6">
      {/* API Key Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Konfigurasi API
          </CardTitle>
          <CardDescription>
            Masukkan Google Gemini API key Anda untuk mulai generate gambar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">Gemini API Key</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="api-key"
                  type={showApiKey ? 'text' : 'password'}
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Dapatkan API key gratis di{' '}
              <a
                href="https://makersuite.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-500"
              >
                Google AI Studio
              </a>
            </p>
          </div>

          {/* User Limits Info */}
          {userLimits && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Batas Penggunaan</AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-1 text-sm">
                  <p>
                    Harian: {userLimits.daily_used}/{userLimits.daily_limit} (
                    {userLimits.daily_remaining} tersisa)
                  </p>
                  <p>
                    Bulanan: {userLimits.monthly_used}/{userLimits.monthly_limit} (
                    {userLimits.monthly_remaining} tersisa)
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Main Generator Form */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Input */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Prompt Utama
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Deskripsi Gambar</Label>
                <Textarea
                  id="prompt"
                  placeholder="Deskripsikan gambar yang ingin Anda buat..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  maxLength={1000}
                  className="resize-none"
                />
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Deskripsikan dengan detail untuk hasil terbaik</span>
                  <span>{prompt.length}/1000</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prompt Negatif</CardTitle>
              <CardDescription>
                Hal yang tidak ingin ada dalam gambar (opsional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Textarea
                  placeholder="Contoh: watermark, text, signature, blurry, low quality..."
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  rows={2}
                  maxLength={500}
                  className="resize-none"
                />
                <div className="text-sm text-gray-500 dark:text-gray-400 text-right">
                  {negativePrompt.length}/500
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Style</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Gaya Gambar</Label>
                <Select value={styleTemplate} onValueChange={setStyleTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih gaya" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex items-center gap-2">
                          <span>{template.name}</span>
                          {template.popularity > 500 && (
                            <Badge variant="secondary" className="text-xs">
                              Trending
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Aspect Ratio</Label>
                <Select value={aspectRatio} onValueChange={setAspectRatio}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {aspectRatioOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Kualitas</Label>
                <Select value={quality} onValueChange={setQuality}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {qualityOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        <div>
                          <div className="font-medium">{option.name}</div>
                          <div className="text-sm text-gray-500">{option.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Seed (untuk hasil konsisten)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRandomSeed}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Random
                  </Button>
                </div>
                <Input
                  type="number"
                  placeholder="Opsional"
                  value={seed || ''}
                  onChange={(e) => setSeed(e.target.value ? parseInt(e.target.value) : undefined)}
                  min={0}
                  max={999999999}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim() || !apiKey.trim()}
          size="lg"
          className="px-8 py-3 text-lg"
        >
          {isGenerating ? (
            <>
              <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Membuat Gambar...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-5 w-5" />
              Generate Gambar
            </>
          )}
        </Button>
      </div>

      {/* Generation Progress */}
      {isGenerating && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sedang membuat gambar...</span>
                <span>{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Result */}
      {result && result.data && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Hasil Generate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 lg:aspect-video">
              <img
                src={result.data.image_url}
                alt="Generated image"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>Quality: {result.data.metadata.quality}</span>
              <span>Size: {result.data.metadata.width}×{result.data.metadata.height}</span>
              <span>Time: {(result.data.generation_time / 1000).toFixed(1)}s</span>
              {result.data.metadata.seed && (
                <span>Seed: {result.data.metadata.seed}</span>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={handleDownload} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" onClick={() => setResult(null)}>
                Generate Lagi
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}