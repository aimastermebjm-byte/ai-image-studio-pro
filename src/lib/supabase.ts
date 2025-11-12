import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { User, GeneratedImage, StyleTemplate } from '@/types';

// Singleton Supabase client
let supabase: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseClient() {
  if (supabase) return supabase;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase configuration. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
  }

  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });

  return supabase;
}

// Service client untuk admin operations
export function getSupabaseServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase service configuration');
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// User operations
export const userService = {
  async getUserById(userId: string): Promise<User | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data as User;
  },

  async createUser(userData: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return data as User;
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }

    return data as User;
  },

  async getUserLimits(userId: string) {
    const supabase = getSupabaseClient();
    const { data: user, error } = await supabase
      .from('users')
      .select('generation_count_today, generation_count_month, last_generation_reset')
      .eq('id', userId)
      .single();

    if (error) {
      throw new Error(`Failed to get user limits: ${error.message}`);
    }

    const dailyLimit = parseInt(process.env.DAILY_GENERATION_LIMIT || '50');
    const monthlyLimit = parseInt(process.env.MONTHLY_GENERATION_LIMIT || '1500');

    const lastReset = new Date(user.last_generation_reset);
    const today = new Date();
    const currentMonth = today.getMonth();
    const resetMonth = lastReset.getMonth();

    // Reset daily count if needed
    let dailyUsed = user.generation_count_today;
    if (today.toDateString() !== lastReset.toDateString()) {
      dailyUsed = 0;
    }

    // Reset monthly count if needed
    let monthlyUsed = user.generation_count_month;
    if (currentMonth !== resetMonth || today.getFullYear() !== lastReset.getFullYear()) {
      monthlyUsed = 0;
    }

    return {
      daily_limit: dailyLimit,
      monthly_limit: monthlyLimit,
      daily_used: dailyUsed,
      monthly_used: monthlyUsed,
      daily_remaining: Math.max(0, dailyLimit - dailyUsed),
      monthly_remaining: Math.max(0, monthlyLimit - monthlyUsed),
      last_daily_reset: user.last_generation_reset,
      last_monthly_reset: user.last_generation_reset,
    };
  },

  async incrementGenerationCount(userId: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase.rpc('increment_generation_count', {
      user_id: userId,
    });

    if (error) {
      throw new Error(`Failed to increment generation count: ${error.message}`);
    }
  },
};

// Generated images operations
export const imageService = {
  async createImage(imageData: Omit<GeneratedImage, 'id' | 'created_at'>): Promise<GeneratedImage> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('generated_images')
      .insert([imageData])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create image: ${error.message}`);
    }

    return data as GeneratedImage;
  },

  async getUserImages(
    userId: string,
    page = 1,
    limit = 20,
    filters?: {
      style_template?: string;
      quality?: string;
      date_range?: { start: string; end: string };
    }
  ) {
    const supabase = getSupabaseClient();
    let query = supabase
      .from('generated_images')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters?.style_template) {
      query = query.eq('style_template', filters.style_template);
    }

    if (filters?.quality) {
      query = query.eq('quality', filters.quality);
    }

    if (filters?.date_range) {
      query = query
        .gte('created_at', filters.date_range.start)
        .lte('created_at', filters.date_range.end);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch images: ${error.message}`);
    }

    return {
      images: data as GeneratedImage[],
      pagination: {
        page,
        limit,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / limit),
        has_next: offset + limit < (count || 0),
        has_prev: page > 1,
      },
    };
  },

  async getImageById(imageId: string): Promise<GeneratedImage | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('generated_images')
      .select('*')
      .eq('id', imageId)
      .single();

    if (error) {
      console.error('Error fetching image:', error);
      return null;
    }

    return data as GeneratedImage;
  },

  async deleteImage(imageId: string, userId: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('generated_images')
      .delete()
      .eq('id', imageId)
      .eq('user_id', userId); // Ensure user can only delete their own images

    if (error) {
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  },

  async updateImage(imageId: string, updates: Partial<GeneratedImage>): Promise<GeneratedImage> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('generated_images')
      .update(updates)
      .eq('id', imageId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update image: ${error.message}`);
    }

    return data as GeneratedImage;
  },
};

// Style templates operations
export const templateService = {
  async getTemplates(category?: string): Promise<StyleTemplate[]> {
    const supabase = getSupabaseClient();
    let query = supabase
      .from('style_templates')
      .select('*')
      .order('usage_count', { ascending: false })
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch templates: ${error.message}`);
    }

    return data as StyleTemplate[];
  },

  async getTemplateById(templateId: string): Promise<StyleTemplate | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('style_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (error) {
      console.error('Error fetching template:', error);
      return null;
    }

    return data as StyleTemplate;
  },

  async incrementTemplateUsage(templateId: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase.rpc('increment_template_usage', {
      template_id: templateId,
    });

    if (error) {
      console.error('Failed to increment template usage:', error);
    }
  },

  async getFeaturedTemplates(): Promise<StyleTemplate[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('style_templates')
      .select('*')
      .eq('is_featured', true)
      .order('usage_count', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch featured templates: ${error.message}`);
    }

    return data as StyleTemplate[];
  },
};

// Export default client
export default getSupabaseClient;