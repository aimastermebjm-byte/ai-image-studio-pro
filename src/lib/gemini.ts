import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import type { GenerationRequest, GenerationResponse, ImageMetadata } from '@/types';

// Konfigurasi Gemini API
const GEMINI_CONFIG = {
  model: 'gemini-1.5-flash',
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
  apiUrl: process.env.NEXT_PUBLIC_GEMINI_API_URL || 'https://generativelanguage.googleapis.com',

  // Safety settings
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],

  // Generation parameters
  generationConfig: {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: 'application/json',
  },
};

// Initialize Gemini client
function getGeminiClient() {
  if (!GEMINI_CONFIG.apiKey) {
    throw new Error('Gemini API key is required. Please set NEXT_PUBLIC_GEMINI_API_KEY environment variable.');
  }

  return new GoogleGenerativeAI(GEMINI_CONFIG.apiKey);
}

// Style prompts untuk berbagai jenis gambar
const STYLE_PROMPTS = {
  'anime': 'anime style, manga art, Japanese animation, vibrant colors, clean lines',
  'realistic': 'photorealistic, highly detailed, professional photography, DSLR, 8K resolution',
  'cartoon': 'cartoon style, Disney animation, cute, colorful, fun',
  'oil-painting': 'oil painting, classical art, textured brushstrokes, artistic masterpiece',
  'watercolor': 'watercolor painting, soft edges, flowing colors, artistic',
  'pixel-art': 'pixel art, 8-bit style, retro gaming, blocky pixels',
  'cyberpunk': 'cyberpunk style, neon lights, futuristic, sci-fi, dystopian',
  'fantasy': 'fantasy art, magical, ethereal, mythical creatures',
  'minimalist': 'minimalist style, clean, simple, modern design',
  'vintage': 'vintage style, retro, aged, nostalgic, classic photography',
};

// Aspect ratio configurations
const ASPECT_RATIOS = {
  '1:1': { width: 1024, height: 1024 },
  '16:9': { width: 1024, height: 576 },
  '9:16': { width: 576, height: 1024 },
  '4:3': { width: 1024, height: 768 },
  '3:4': { width: 768, height: 1024 },
  '21:9': { width: 1024, height: 440 },
};

// Quality configurations
const QUALITY_SETTINGS = {
  standard: { steps: 20, guidance_scale: 7.5 },
  high: { steps: 30, guidance_scale: 8.0 },
  ultra: { steps: 40, guidance_scale: 8.5 },
  '4k': { steps: 50, guidance_scale: 9.0 },
};

// Prompt enhancement system
function enhancePrompt(
  originalPrompt: string,
  styleTemplate: string,
  negativePrompt?: string
): string {
  const stylePrefix = STYLE_PROMPTS[styleTemplate as keyof typeof STYLE_PROMPTS] || '';

  let enhancedPrompt = originalPrompt;

  // Add style prefix
  if (stylePrefix) {
    enhancedPrompt = `${stylePrefix}, ${originalPrompt}`;
  }

  // Add quality descriptors
  enhancedPrompt += ', high quality, detailed, masterpiece';

  // Remove harmful content indicators
  const harmfulPatterns = [
    /violence/i,
    /gore/i,
    /adult/i,
    /nsfw/i,
    /explicit/i,
    /blood/i,
    /weapon/i,
  ];

  for (const pattern of harmfulPatterns) {
    if (pattern.test(originalPrompt)) {
      throw new Error('Prompt contains content that violates safety guidelines');
    }
  }

  return enhancedPrompt;
}

// Generate image using Gemini API
export async function generateImage(request: GenerationRequest): Promise<GenerationResponse> {
  const startTime = Date.now();

  try {
    // Validate request
    if (!request.prompt || request.prompt.trim().length === 0) {
      return {
        success: false,
        error: 'Prompt is required',
      };
    }

    if (request.prompt.length > 1000) {
      return {
        success: false,
        error: 'Prompt is too long (max 1000 characters)',
      };
    }

    // Enhance prompt
    const enhancedPrompt = enhancePrompt(
      request.prompt,
      request.style_template,
      request.negative_prompt
    );

    // Get dimensions
    const dimensions = ASPECT_RATIOS[request.aspect_ratio as keyof typeof ASPECT_RATIOS] || ASPECT_RATIOS['1:1'];
    const quality = QUALITY_SETTINGS[request.quality];

    // Initialize Gemini
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({
      model: GEMINI_CONFIG.model,
      ...GEMINI_CONFIG.generationConfig,
    });

    // Create generation prompt
    const generationPrompt = `
    Generate an image with the following specifications:

    **Prompt**: ${enhancedPrompt}
    **Aspect Ratio**: ${request.aspect_ratio}
    **Width**: ${dimensions.width}px
    **Height**: ${dimensions.height}px
    **Quality**: ${request.quality}
    **Steps**: ${quality.steps}
    **Guidance Scale**: ${quality.guidance_scale}
    ${request.seed ? `**Seed**: ${request.seed}` : ''}
    ${request.negative_prompt ? `**Negative Prompt**: ${request.negative_prompt}` : ''}

    Please respond with a JSON object containing the generated image data.
    Include base64 image data, metadata, and generation information.
    `;

    // Generate content
    const result = await model.generateContent(generationPrompt);
    const response = await result.response;
    const text = response.text();

    // Parse response
    let generationData;
    try {
      generationData = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      return {
        success: false,
        error: 'Failed to generate image. Please try again.',
      };
    }

    // Validate generation data
    if (!generationData.imageData) {
      return {
        success: false,
        error: 'No image data received from API',
      };
    }

    // Generate image URL (simulated - dalam implementasi nyata, upload ke storage)
    const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const imageUrl = `/api/images/${imageId}`;
    const thumbnailUrl = `/api/images/${imageId}/thumbnail`;

    // Create metadata
    const metadata: ImageMetadata = {
      model: GEMINI_CONFIG.model,
      width: dimensions.width,
      height: dimensions.height,
      steps: quality.steps,
      guidance_scale: quality.guidance_scale,
      seed: request.seed,
      generation_time: Date.now() - startTime,
      token_count: generationData.tokenCount || 0,
      file_size: Math.round((generationData.imageData.length * 3) / 4), // Base64 size estimate
    };

    return {
      success: true,
      data: {
        image_id: imageId,
        image_url: imageUrl,
        thumbnail_url: thumbnailUrl,
        metadata,
        generation_time: metadata.generation_time,
      },
    };

  } catch (error) {
    console.error('Generation error:', error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('quota')) {
        return {
          success: false,
          error: 'API quota exceeded. Please try again later.',
        };
      }

      if (error.message.includes('safety')) {
        return {
          success: false,
          error: 'Prompt violates safety guidelines',
        };
      }

      if (error.message.includes('key')) {
        return {
          success: false,
          error: 'Invalid API key configuration',
        };
      }
    }

    return {
      success: false,
      error: 'Failed to generate image. Please try again.',
    };
  }
}

// Validate Gemini API key
export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: GEMINI_CONFIG.model });

    // Simple test request
    const result = await model.generateContent('Test');
    return !!result.response;
  } catch (error) {
    console.error('API key validation error:', error);
    return false;
  }
}

// Get available style templates
export function getStyleTemplates() {
  return Object.entries(STYLE_PROMPTS).map(([key, description]) => ({
    id: key,
    name: key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    description,
    category: getCategoryForStyle(key),
  }));
}

// Get category for style
function getCategoryForStyle(styleKey: string): string {
  const categories = {
    'anime': 'Artistic',
    'realistic': 'Photography',
    'cartoon': 'Artistic',
    'oil-painting': 'Artistic',
    'watercolor': 'Artistic',
    'pixel-art': 'Digital Art',
    'cyberpunk': 'Sci-Fi',
    'fantasy': 'Artistic',
    'minimalist': 'Modern',
    'vintage': 'Photography',
  };

  return categories[styleKey as keyof typeof categories] || 'General';
}

// Get aspect ratio options
export function getAspectRatioOptions() {
  return Object.entries(ASPECT_RATIOS).map(([ratio, dimensions]) => ({
    id: ratio,
    name: ratio,
    width: dimensions.width,
    height: dimensions.height,
    label: `${ratio} (${dimensions.width}×${dimensions.height})`,
  }));
}

// Get quality options
export function getQualityOptions() {
  return Object.entries(QUALITY_SETTINGS).map(([quality, settings]) => ({
    id: quality,
    name: quality.charAt(0).toUpperCase() + quality.slice(1),
    label: `${quality.charAt(0).toUpperCase() + quality.slice(1)} Quality`,
    steps: settings.steps,
    guidance_scale: settings.guidance_scale,
    description: getQualityDescription(quality),
  }));
}

// Get quality description
function getQualityDescription(quality: string): string {
  const descriptions = {
    standard: 'Good quality, fast generation',
    high: 'Better quality, moderate time',
    ultra: 'Excellent quality, longer time',
    '4k': 'Best quality, longest time',
  };

  return descriptions[quality as keyof typeof descriptions] || '';
}

// Analyze prompt for content moderation
export function analyzePrompt(prompt: string): {
  isSafe: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  warnings: string[];
} {
  const warnings: string[] = [];
  let riskLevel: 'low' | 'medium' | 'high' = 'low';

  // Check for potentially problematic content
  const problematicPatterns = [
    { pattern: /weapon|gun|knife|sword/i, risk: 'medium', message: 'Contains weapons' },
    { pattern: /violence|fight|war/i, risk: 'medium', message: 'Contains violence' },
    { pattern: /blood|gore|killing/i, risk: 'high', message: 'Contains graphic content' },
    { pattern: /adult|nude|explicit/i, risk: 'high', message: 'Contains adult content' },
    { pattern: /hate|racist|discrimination/i, risk: 'high', message: 'Contains hate content' },
    { pattern: /drug|alcohol|smoking/i, risk: 'medium', message: 'Contains substance use' },
  ];

  for (const { pattern, risk, message } of problematicPatterns) {
    if (pattern.test(prompt)) {
      warnings.push(message);
      if (risk === 'high' || riskLevel === 'medium') {
        riskLevel = 'high';
      } else if (risk === 'medium') {
        riskLevel = 'medium';
      }
    }
  }

  // Check prompt length
  if (prompt.length < 5) {
    warnings.push('Prompt is too short');
  } else if (prompt.length > 500) {
    warnings.push('Prompt is very long and may take longer to process');
  }

  return {
    isSafe: riskLevel !== 'high',
    riskLevel,
    warnings,
  };
}

// Export configuration
export { GEMINI_CONFIG };