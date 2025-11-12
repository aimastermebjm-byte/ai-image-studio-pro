// Tipe Data Dasar AI Image Studio Pro

export interface User {
  id: string;
  email: string;
  name: string;
  generation_count_today: number;
  generation_count_month: number;
  last_generation_reset: string;
  created_at: string;
}

export interface GeneratedImage {
  id: string;
  user_id?: string;
  prompt: string;
  negative_prompt?: string;
  style_template: string;
  aspect_ratio: string;
  quality: 'standard' | 'high' | 'ultra' | '4k';
  image_url: string;
  thumbnail_url?: string;
  metadata: ImageMetadata;
  created_at: string;
  updated_at?: string;
  is_public?: boolean;
  tags?: string[];
}

export interface ImageMetadata {
  model: string;
  width: number;
  height: number;
  steps: number;
  guidance_scale: number;
  seed?: number;
  generation_time: number;
  token_count?: number;
  file_size: number;
}

export interface StyleTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  parameters: TemplateParameters;
  usage_count: number;
  is_featured: boolean;
  created_at: string;
}

export interface TemplateParameters {
  prompt_prefix: string;
  prompt_suffix: string;
  negative_prompt: string;
  style_strength: number;
  aspect_ratio: string;
  quality: string;
  seed?: number;
}

export interface GenerationRequest {
  prompt: string;
  negative_prompt?: string;
  style_template: string;
  aspect_ratio: string;
  quality: 'standard' | 'high' | 'ultra' | '4k';
  seed?: number;
  user_id?: string;
}

export interface GenerationResponse {
  success: boolean;
  data?: {
    image_id: string;
    image_url: string;
    thumbnail_url: string;
    metadata: ImageMetadata;
    generation_time: number;
    user_limits?: {
      daily_remaining: number;
      monthly_remaining: number;
    };
  };
  error?: string;
  message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface UserLimits {
  daily_limit: number;
  monthly_limit: number;
  daily_used: number;
  monthly_used: number;
  daily_remaining: number;
  monthly_remaining: number;
  last_daily_reset: string;
  last_monthly_reset: string;
}

export interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface OfflineStatus {
  isOnline: boolean;
  connectionType: string;
  effectiveType: string;
  lastSync: string;
}

export interface CacheInfo {
  size: number;
  maxSize: number;
  usage: number;
  entries: number;
}

export interface GalleryFilter {
  style_template?: string;
  quality?: string;
  date_range?: {
    start: string;
    end: string;
  };
  tags?: string[];
}

export interface ShareOptions {
  title: string;
  text: string;
  url?: string;
  files?: File[];
}

// Tipe untuk PWA
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Tipe Error
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Tipe untuk Analytics (jika dibutuhkan)
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: string;
  user_id?: string;
}

// Tipe untuk Theme
export type Theme = 'light' | 'dark' | 'system';

// Tipe untuk Language
export type Language = 'id' | 'en';

// Tipe untuk Sort Options
export type SortOption = 'newest' | 'oldest' | 'most_liked' | 'most_used';

// Tipe untuk View Mode
export type ViewMode = 'grid' | 'list' | 'masonry';