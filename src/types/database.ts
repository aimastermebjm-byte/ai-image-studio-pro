// Database types untuk Supabase

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Table users
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          generation_count_today: number
          generation_count_month: number
          last_generation_reset: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          generation_count_today?: number
          generation_count_month?: number
          last_generation_reset?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          generation_count_today?: number
          generation_count_month?: number
          last_generation_reset?: string
          updated_at?: string
        }
      }
      generated_images: {
        Row: {
          id: string
          user_id: string
          prompt: string
          negative_prompt?: string
          style_template: string
          aspect_ratio: string
          quality: 'standard' | 'high' | 'ultra' | '4k'
          image_url: string
          thumbnail_url?: string
          metadata: Json
          created_at: string
          updated_at?: string
          is_public?: boolean
          tags?: string[]
        }
        Insert: {
          id?: string
          user_id?: string
          prompt: string
          negative_prompt?: string
          style_template: string
          aspect_ratio: string
          quality: 'standard' | 'high' | 'ultra' | '4k'
          image_url: string
          thumbnail_url?: string
          metadata: Json
          created_at?: string
          updated_at?: string
          is_public?: boolean
          tags?: string[]
        }
        Update: {
          id?: string
          user_id?: string
          prompt?: string
          negative_prompt?: string
          style_template?: string
          aspect_ratio?: string
          quality?: 'standard' | 'high' | 'ultra' | '4k'
          image_url?: string
          thumbnail_url?: string
          metadata?: Json
          updated_at?: string
          is_public?: boolean
          tags?: string[]
        }
      }
      style_templates: {
        Row: {
          id: string
          name: string
          category: string
          description: string
          parameters: Json
          usage_count: number
          is_featured: boolean
          created_at: string
          updated_at?: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          description: string
          parameters: Json
          usage_count?: number
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string
          parameters?: Json
          usage_count?: number
          is_featured?: boolean
          updated_at?: string
        }
      }
      collections: {
        Row: {
          id: string
          user_id: string
          name: string
          description?: string
          image_ids: string[]
          created_at: string
          updated_at?: string
          is_public?: boolean
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string
          image_ids?: string[]
          created_at?: string
          updated_at?: string
          is_public?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string
          image_ids?: string[]
          updated_at?: string
          is_public?: boolean
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          theme: 'light' | 'dark' | 'system'
          language: 'id' | 'en'
          view_mode: 'grid' | 'list' | 'masonry'
          auto_save: boolean
          notifications: boolean
          created_at: string
          updated_at?: string
        }
        Insert: {
          id?: string
          user_id: string
          theme?: 'light' | 'dark' | 'system'
          language?: 'id' | 'en'
          view_mode?: 'grid' | 'list' | 'masonry'
          auto_save?: boolean
          notifications?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          theme?: 'light' | 'dark' | 'system'
          language?: 'id' | 'en'
          view_mode?: 'grid' | 'list' | 'masonry'
          auto_save?: boolean
          notifications?: boolean
          updated_at?: string
        }
      }
      usage_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          metadata?: Json
          ip_address?: string
          user_agent?: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          action: string
          metadata?: Json
          ip_address?: string
          user_agent?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          metadata?: Json
          ip_address?: string
          user_agent?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_generation_count: {
        Args: {
          user_id: string
        }
        Returns: {
          message: string
        }
      }
      increment_template_usage: {
        Args: {
          template_id: string
        }
        Returns: {
          message: string
        }
      }
      reset_daily_counts: {
        Args: Record<PropertyKey, never>
        Returns: {
          message: string
        }
      }
      get_user_stats: {
        Args: {
          user_id: string
        }
        Returns: {
          total_images: number
          total_generations_today: number
          total_generations_month: number
          favorite_template: string
          average_generation_time: number
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Type helpers
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']