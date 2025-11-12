-- Initial schema for AI Image Studio Pro
-- Version: 2.0.0 (Free Version)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  generation_count_today INTEGER DEFAULT 0,
  generation_count_month INTEGER DEFAULT 0,
  last_generation_reset DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Generated images table
CREATE TABLE generated_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  negative_prompt TEXT,
  style_template VARCHAR(100) NOT NULL DEFAULT 'realistic',
  aspect_ratio VARCHAR(10) NOT NULL DEFAULT '1:1',
  quality VARCHAR(10) NOT NULL DEFAULT 'standard',
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_public BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[]
);

-- Style templates table
CREATE TABLE style_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'General',
  description TEXT,
  parameters JSONB NOT NULL DEFAULT '{}',
  usage_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Collections table
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_ids UUID[] DEFAULT ARRAY[]::UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_public BOOLEAN DEFAULT false
);

-- User settings table
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  theme VARCHAR(10) DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  language VARCHAR(5) DEFAULT 'id' CHECK (language IN ('id', 'en')),
  view_mode VARCHAR(10) DEFAULT 'grid' CHECK (view_mode IN ('grid', 'list', 'masonry')),
  auto_save BOOLEAN DEFAULT true,
  notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Usage logs table
CREATE TABLE usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes untuk performance
CREATE INDEX idx_generated_images_user_id ON generated_images(user_id);
CREATE INDEX idx_generated_images_created_at ON generated_images(created_at DESC);
CREATE INDEX idx_generated_images_style_template ON generated_images(style_template);
CREATE INDEX idx_generated_images_is_public ON generated_images(is_public);
CREATE INDEX idx_generated_images_tags ON generated_images USING GIN(tags);

-- Full-text search index untuk prompts
CREATE INDEX idx_generated_images_prompt_search ON generated_images
USING GIN(to_tsvector('english', prompt || ' ' || COALESCE(negative_prompt, '')));

CREATE INDEX idx_style_templates_category ON style_templates(category);
CREATE INDEX idx_style_templates_is_featured ON style_templates(is_featured);
CREATE INDEX idx_style_templates_usage_count ON style_templates(usage_count DESC);

CREATE INDEX idx_collections_user_id ON collections(user_id);
CREATE INDEX idx_collections_is_public ON collections(is_public);

CREATE INDEX idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX idx_usage_logs_action ON usage_logs(action);
CREATE INDEX idx_usage_logs_created_at ON usage_logs(created_at DESC);

-- Update timestamps trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers untuk update timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generated_images_updated_at BEFORE UPDATE ON generated_images
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_style_templates_updated_at BEFORE UPDATE ON style_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Stored procedures
-- Increment generation count
CREATE OR REPLACE FUNCTION increment_generation_count(user_uuid UUID)
RETURNS TEXT AS $$
BEGIN
    UPDATE users
    SET
        generation_count_today = CASE
            WHEN last_generation_reset < CURRENT_DATE THEN 1
            ELSE generation_count_today + 1
        END,
        generation_count_month = CASE
            WHEN DATE_PART('month', last_generation_reset) != DATE_PART('month', CURRENT_DATE)
            OR DATE_PART('year', last_generation_reset) != DATE_PART('year', CURRENT_DATE)
            THEN 1
            ELSE generation_count_month + 1
        END,
        last_generation_reset = CURRENT_DATE
    WHERE id = user_uuid;

    RETURN 'Generation count incremented';
END;
$$ LANGUAGE plpgsql;

-- Increment template usage
CREATE OR REPLACE FUNCTION increment_template_usage(template_uuid UUID)
RETURNS TEXT AS $$
BEGIN
    UPDATE style_templates
    SET usage_count = usage_count + 1
    WHERE id = template_uuid;

    RETURN 'Template usage incremented';
END;
$$ LANGUAGE plpgsql;

-- Reset daily counts (dijalankan oleh cron job)
CREATE OR REPLACE FUNCTION reset_daily_counts()
RETURNS TEXT AS $$
BEGIN
    UPDATE users
    SET generation_count_today = 0,
        last_generation_reset = CURRENT_DATE
    WHERE last_generation_reset < CURRENT_DATE;

    RETURN 'Daily counts reset';
END;
$$ LANGUAGE plpgsql;

-- Reset monthly counts (dijalankan oleh cron job)
CREATE OR REPLACE FUNCTION reset_monthly_counts()
RETURNS TEXT AS $$
BEGIN
    UPDATE users
    SET generation_count_month = 0
    WHERE DATE_PART('month', last_generation_reset) != DATE_PART('month', CURRENT_DATE)
    OR DATE_PART('year', last_generation_reset) != DATE_PART('year', CURRENT_DATE);

    RETURN 'Monthly counts reset';
END;
$$ LANGUAGE plpgsql;

-- Get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS JSONB AS $$
DECLARE
    total_images INTEGER;
    total_generations_today INTEGER;
    total_generations_month INTEGER;
    favorite_template VARCHAR(100);
    avg_generation_time DECIMAL;
BEGIN
    -- Total images
    SELECT COUNT(*) INTO total_images
    FROM generated_images
    WHERE user_id = user_uuid;

    -- Daily generations
    SELECT COALESCE(generation_count_today, 0) INTO total_generations_today
    FROM users
    WHERE id = user_uuid;

    -- Monthly generations
    SELECT COALESCE(generation_count_month, 0) INTO total_generations_month
    FROM users
    WHERE id = user_uuid;

    -- Favorite template
    SELECT style_template INTO favorite_template
    FROM generated_images
    WHERE user_id = user_uuid
    GROUP BY style_template
    ORDER BY COUNT(*) DESC
    LIMIT 1;

    -- Average generation time
    SELECT COALESCE(AVG((metadata->>'generation_time')::DECIMAL), 0) INTO avg_generation_time
    FROM generated_images
    WHERE user_id = user_uuid
    AND metadata ? 'generation_time';

    RETURN jsonb_build_object(
        'total_images', total_images,
        'total_generations_today', total_generations_today,
        'total_generations_month', total_generations_month,
        'favorite_template', COALESCE(favorite_template, 'none'),
        'average_generation_time', COALESCE(avg_generation_time, 0)
    );
END;
$$ LANGUAGE plpgsql;

-- Insert default style templates
INSERT INTO style_templates (name, category, description, parameters) VALUES
('Realistic', 'Photography', 'Highly realistic photographs with professional quality', '{"prompt_prefix": "photorealistic, highly detailed, professional photography", "prompt_suffix": "8K resolution, sharp focus, detailed", "negative_prompt": "cartoon, anime, painting", "style_strength": 0.9, "aspect_ratio": "1:1", "quality": "high"}'),
('Anime', 'Artistic', 'Japanese anime and manga style art', '{"prompt_prefix": "anime style, manga art, Japanese animation", "prompt_suffix": "vibrant colors, clean lines, anime aesthetics", "negative_prompt": "realistic, photorealistic, 3D", "style_strength": 0.8, "aspect_ratio": "1:1", "quality": "standard"}'),
('Cartoon', 'Artistic', 'Fun and colorful cartoon style', '{"prompt_prefix": "cartoon style, Disney animation style", "prompt_suffix": "cute, colorful, fun, cheerful", "negative_prompt": "realistic, photorealistic, dark", "style_strength": 0.7, "aspect_ratio": "1:1", "quality": "standard"}'),
('Oil Painting', 'Artistic', 'Classical oil painting with rich textures', '{"prompt_prefix": "oil painting, classical art style", "prompt_suffix": "textured brushstrokes, artistic masterpiece, canvas", "negative_prompt": "digital, photograph, modern", "style_strength": 0.8, "aspect_ratio": "4:3", "quality": "high"}'),
('Watercolor', 'Artistic', 'Soft and flowing watercolor paintings', '{"prompt_prefix": "watercolor painting, soft watercolors", "prompt_suffix": "flowing colors, artistic, paper texture", "negative_prompt": "digital, sharp lines, photorealistic", "style_strength": 0.7, "aspect_ratio": "3:4", "quality": "standard"}'),
('Pixel Art', 'Digital Art', 'Retro 8-bit and 16-bit pixel art style', '{"prompt_prefix": "pixel art, 8-bit style, retro gaming", "prompt_suffix": "blocky pixels, pixel perfect, retro", "negative_prompt": "realistic, 3D, modern graphics", "style_strength": 0.9, "aspect_ratio": "1:1", "quality": "standard"}'),
('Cyberpunk', 'Sci-Fi', 'Futuristic cyberpunk with neon lights', '{"prompt_prefix": "cyberpunk style, futuristic, sci-fi", "prompt_suffix": "neon lights, dystopian, high-tech, cybernetic", "negative_prompt": "natural, organic, vintage", "style_strength": 0.8, "aspect_ratio": "16:9", "quality": "high"}'),
('Fantasy', 'Artistic', 'Magical fantasy art with mythical elements', '{"prompt_prefix": "fantasy art, magical, ethereal", "prompt_suffix": "mythical creatures, enchanting, magical atmosphere", "negative_prompt": "modern, realistic, technological", "style_strength": 0.7, "aspect_ratio": "4:3", "quality": "high"}'),
('Minimalist', 'Modern', 'Clean and simple minimalist design', '{"prompt_prefix": "minimalist style, clean, simple", "prompt_suffix": "modern design, minimal elements, clean lines", "negative_prompt": "detailed, complex, busy", "style_strength": 0.6, "aspect_ratio": "1:1", "quality": "standard"}'),
('Vintage', 'Photography', ' nostalgic vintage and retro photography', '{"prompt_prefix": "vintage style, retro photography", "prompt_suffix": "aged, nostalgic, classic film look", "negative_prompt": "modern, digital, clean", "style_strength": 0.7, "aspect_ratio": "4:3", "quality": "standard"}');

-- Set featured templates
UPDATE style_templates SET is_featured = true WHERE name IN ('Realistic', 'Anime', 'Cyberpunk', 'Fantasy');

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can view own images" ON generated_images FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own images" ON generated_images FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own images" ON generated_images FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own images" ON generated_images FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view public images" ON generated_images FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own collections" ON collections FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own collections" ON collections FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own collections" ON collections FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own collections" ON collections FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view public collections" ON collections FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own settings" ON user_settings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own settings" ON user_settings FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own settings" ON user_settings FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can view own logs" ON usage_logs FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own logs" ON usage_logs FOR INSERT WITH CHECK (user_id = auth.uid());

-- Style templates are public readable
CREATE POLICY "Anyone can view style templates" ON style_templates FOR SELECT USING (true);

-- Comments untuk documentation
COMMENT ON TABLE users IS 'User accounts and generation limits';
COMMENT ON TABLE generated_images IS 'AI generated images with metadata';
COMMENT ON TABLE style_templates IS 'Predefined style templates for image generation';
COMMENT ON TABLE collections IS 'User image collections';
COMMENT ON TABLE user_settings IS 'User preferences and settings';
COMMENT ON TABLE usage_logs IS 'Usage analytics and logging';

COMMENT ON COLUMN generated_images.metadata IS 'JSON metadata including generation parameters and stats';
COMMENT ON COLUMN style_templates.parameters IS 'JSON object with template parameters';
COMMENT ON COLUMN usage_logs.metadata IS 'Additional context data for the action';