import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateImage } from '@/lib/gemini';
import { userService, imageService } from '@/lib/supabase';
import type { GenerationRequest, GenerationResponse } from '@/types';

// Schema untuk validasi input
const generateSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(1000, 'Prompt is too long'),
  negative_prompt: z.string().max(500, 'Negative prompt is too long').optional(),
  style_template: z.string().default('realistic'),
  aspect_ratio: z.enum(['1:1', '16:9', '9:16', '4:3', '3:4', '21:9']).default('1:1'),
  quality: z.enum(['standard', 'high', 'ultra', '4k']).default('standard'),
  seed: z.number().int().min(0).max(999999999).optional(),
  user_id: z.string().uuid().optional(),
  api_key: z.string().min(1, 'API key is required'),
});

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours
const DAILY_LIMIT = 50;
const MONTHLY_LIMIT = 1500;

// Simple in-memory rate limiter (gunakan Redis di production)
const rateLimitCache = new Map<string, { count: number; resetTime: number; type: 'daily' | 'monthly' }>();

// Rate limiting helper
function checkRateLimit(userId: string, type: 'daily' | 'monthly', limit: number): boolean {
  const key = `${userId}:${type}`;
  const now = Date.now();
  const cache = rateLimitCache.get(key);

  if (!cache || now > cache.resetTime) {
    rateLimitCache.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW, type });
    return true;
  }

  if (cache.count >= limit) {
    return false;
  }

  cache.count++;
  return true;
}

// Error response helper
function errorResponse(message: string, status = 400) {
  return addHeaders(NextResponse.json(
    { success: false, error: message },
    { status }
  ));
}

// POST /api/generate
export async function POST(request: NextRequest) {
  try {
    // Parse dan validate request body
    const body = await request.json();
    const validatedData = generateSchema.parse(body);

    // Extract API key untuk temporary usage
    const { api_key, user_id, ...generationRequest } = validatedData;

    // Set API key ke environment variable untuk request ini
    const originalApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    process.env.NEXT_PUBLIC_GEMINI_API_KEY = api_key;

    try {
      // Validate user limits jika user_id disediakan
      let userLimits = null;
      if (user_id) {
        try {
          userLimits = await userService.getUserLimits(user_id);

          // Check daily limit
          if (!checkRateLimit(user_id, 'daily', DAILY_LIMIT)) {
            return errorResponse(
              `Daily generation limit exceeded (${DAILY_LIMIT} images/day). Try again tomorrow.`,
              429
            );
          }

          // Check monthly limit
          if (!checkRateLimit(user_id, 'monthly', MONTHLY_LIMIT)) {
            return errorResponse(
              `Monthly generation limit exceeded (${MONTHLY_LIMIT} images/month).`,
              429
            );
          }
        } catch (limitError) {
          console.error('Error checking user limits:', limitError);
          // Continue tanpa rate limiting jika error
        }
      }

      // Validate prompt
      if (!generationRequest.prompt.trim()) {
        return errorResponse('Prompt cannot be empty');
      }

      // Check for inappropriate content
      const promptLower = generationRequest.prompt.toLowerCase();
      const blockedKeywords = [
        'violence', 'gore', 'adult', 'nsfw', 'explicit',
        'blood', 'weapon', 'kill', 'death', 'terror'
      ];

      for (const keyword of blockedKeywords) {
        if (promptLower.includes(keyword)) {
          return errorResponse(
            'Prompt contains inappropriate content that violates our safety guidelines.',
            403
          );
        }
      }

      // Generate image
      const generationResult = await generateImage({
        ...generationRequest,
        user_id,
      });

      if (!generationResult.success || !generationResult.data) {
        return errorResponse(
          generationResult.error || 'Failed to generate image',
          500
        );
      }

      // Save to database jika user_id disediakan
      let savedImage = null;
      if (user_id) {
        try {
          savedImage = await imageService.createImage({
            user_id,
            prompt: generationRequest.prompt,
            negative_prompt: generationRequest.negative_prompt,
            style_template: generationRequest.style_template,
            aspect_ratio: generationRequest.aspect_ratio,
            quality: generationRequest.quality,
            image_url: generationResult.data.image_url,
            thumbnail_url: generationResult.data.thumbnail_url,
            metadata: generationResult.data.metadata,
          });

          // Update user generation count
          await userService.incrementGenerationCount(user_id);
        } catch (dbError) {
          console.error('Error saving image to database:', dbError);
          // Continue even if database save fails
        }
      }

      // Update template usage count
      if (generationRequest.style_template) {
        try {
          const { templateService } = await import('@/lib/supabase');
          await templateService.incrementTemplateUsage(generationRequest.style_template);
        } catch (templateError) {
          console.error('Error updating template usage:', templateError);
        }
      }

      // Success response
      const response: GenerationResponse = {
        success: true,
        data: {
          image_id: generationResult.data.image_id,
          image_url: generationResult.data.image_url,
          thumbnail_url: generationResult.data.thumbnail_url,
          metadata: generationResult.data.metadata,
          generation_time: generationResult.data.generation_time,
        },
        message: savedImage
          ? 'Image generated and saved successfully!'
          : 'Image generated successfully!',
      };

      // Add user limits info if available
      if (userLimits) {
        response.data = {
          ...response.data,
          user_limits: {
            daily_remaining: Math.max(0, DAILY_LIMIT - userLimits.daily_used),
            monthly_remaining: Math.max(0, MONTHLY_LIMIT - userLimits.monthly_used),
          },
        };
      }

      return addHeaders(NextResponse.json(response));

    } finally {
      // Restore original API key
      if (originalApiKey) {
        process.env.NEXT_PUBLIC_GEMINI_API_KEY = originalApiKey;
      } else {
        delete process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      }
    }

  } catch (error) {
    console.error('Generation API error:', error);

    if (error instanceof z.ZodError) {
      return errorResponse(
        `Validation error: ${error.errors.map(e => e.message).join(', ')}`,
        400
      );
    }

    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes('quota')) {
        return errorResponse(
          'API quota exceeded. Please check your Gemini API key and try again.',
          429
        );
      }

      if (error.message.includes('safety')) {
        return errorResponse(
          'Prompt violates safety guidelines. Please modify your prompt and try again.',
          403
        );
      }

      if (error.message.includes('API key')) {
        return errorResponse(
          'Invalid API key. Please check your Gemini API key and try again.',
          401
        );
      }

      return errorResponse(
        'Internal server error. Please try again later.',
        500
      );
    }

    return errorResponse('Unknown error occurred', 500);
  }
}

// GET /api/generate (untuk mendapatkan info endpoint)
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      endpoint: '/api/generate',
      method: 'POST',
      description: 'Generate AI images using Google Gemini API',
      parameters: {
        prompt: {
          type: 'string',
          required: true,
          description: 'Text prompt for image generation (max 1000 characters)',
        },
        negative_prompt: {
          type: 'string',
          required: false,
          description: 'Negative prompt (max 500 characters)',
        },
        style_template: {
          type: 'string',
          required: false,
          default: 'realistic',
          options: ['anime', 'realistic', 'cartoon', 'oil-painting', 'watercolor', 'pixel-art', 'cyberpunk', 'fantasy', 'minimalist', 'vintage'],
        },
        aspect_ratio: {
          type: 'string',
          required: false,
          default: '1:1',
          options: ['1:1', '16:9', '9:16', '4:3', '3:4', '21:9'],
        },
        quality: {
          type: 'string',
          required: false,
          default: 'standard',
          options: ['standard', 'high', 'ultra', '4k'],
        },
        seed: {
          type: 'number',
          required: false,
          description: 'Seed for reproducible results',
        },
        user_id: {
          type: 'string',
          required: false,
          description: 'User ID for tracking and rate limiting',
        },
        api_key: {
          type: 'string',
          required: true,
          description: 'Google Gemini API key',
        },
      },
      limits: {
        daily_limit: DAILY_LIMIT,
        monthly_limit: MONTHLY_LIMIT,
        max_prompt_length: 1000,
        max_negative_prompt_length: 500,
      },
    },
  });
}

export const runtime = 'edge';

// Helper untuk menambah headers ke response
function addHeaders(response: NextResponse) {
  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit-Daily', DAILY_LIMIT.toString());
  response.headers.set('X-RateLimit-Limit-Monthly', MONTHLY_LIMIT.toString());

  return response;
}

// OPTIONS method untuk CORS
export async function OPTIONS() {
  return addHeaders(new NextResponse(null, { status: 200 }));
}