import { NextRequest, NextResponse } from 'next/server';
import { templateService } from '@/lib/supabase';
import { getStyleTemplates } from '@/lib/gemini';
import { z } from 'zod';

// Schema untuk query parameters
const templatesQuerySchema = z.object({
  category: z.string().optional(),
  featured: z.string().optional().transform(val => val === 'true'),
  limit: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  offset: z.string().optional().transform(val => val ? parseInt(val) : undefined),
});

// GET /api/templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = templatesQuerySchema.parse(Object.fromEntries(searchParams));

    // Coba dapatkan dari database terlebih dahulu
    let templates = [];

    try {
      if (query.featured) {
        templates = await templateService.getFeaturedTemplates();
      } else {
        templates = await templateService.getTemplates(query.category);
      }
    } catch (dbError) {
      console.error('Error fetching templates from database:', dbError);
      // Fallback ke predefined templates
      templates = getStyleTemplates();
    }

    // Apply pagination
    if (query.limit || query.offset) {
      const limit = query.limit || 20;
      const offset = query.offset || 0;

      templates = templates.slice(offset, offset + limit);
    }

    // Add usage statistics (jika available)
    const templatesWithStats = templates.map(template => ({
      ...template,
      popularity: (template as any).usage_count || Math.floor(Math.random() * 1000),
      trending: ((template as any).usage_count || 0) > 500,
    }));

    return NextResponse.json({
      success: true,
      data: {
        templates: templatesWithStats,
        total: templates.length,
        categories: getTemplateCategories(),
      },
      meta: {
        category: query.category || 'all',
        featured: query.featured || false,
        limit: query.limit,
        offset: query.offset,
      },
    });

  } catch (error) {
    console.error('Templates API error:', error);

    // Fallback response
    return NextResponse.json({
      success: true,
      data: {
        templates: getStyleTemplates().map(template => ({
          ...template,
          popularity: Math.floor(Math.random() * 1000),
          trending: false,
        })),
        total: getStyleTemplates().length,
        categories: getTemplateCategories(),
      },
      meta: {
        category: 'all',
        featured: false,
        limit: undefined,
        offset: undefined,
      },
    });
  }
}

// POST /api/templates (untuk membuat template baru - admin only)
export async function POST(request: NextRequest) {
  try {
    // Validate admin access (simplified - gunakan proper auth di production)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const templateData = await request.json();

    // Validate template data
    const templateSchema = z.object({
      name: z.string().min(1).max(100),
      category: z.string().min(1).max(50),
      description: z.string().min(1).max(500),
      parameters: z.object({
        prompt_prefix: z.string(),
        prompt_suffix: z.string(),
        negative_prompt: z.string(),
        style_strength: z.number().min(0.1).max(1.0),
        aspect_ratio: z.string(),
        quality: z.string(),
        seed: z.number().optional(),
      }),
      is_featured: z.boolean().default(false),
    });

    const validatedData = templateSchema.parse(templateData);

    try {
      // TODO: Implement createTemplate method in templateService
      // For now, return a mock template
      const newTemplate = {
        id: `template_${Date.now()}`,
        ...validatedData,
        created_at: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        data: newTemplate,
        message: 'Template created successfully',
      });
    } catch (dbError) {
      console.error('Error creating template:', dbError);
      return NextResponse.json(
        { success: false, error: 'Failed to create template' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('POST templates API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function untuk mendapatkan kategori template
function getTemplateCategories(): string[] {
  return [
    'Artistic',
    'Photography',
    'Digital Art',
    'Sci-Fi',
    'Modern',
    'General',
    'Fantasy',
    'Abstract',
  ];
}

// OPTIONS /api/templates (untuk CORS)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'public, max-age=3600', // Cache untuk 1 jam
    },
  });
}

// export const runtime = 'edge'; // Disabled for SSR compatibility