import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/supabase';
import { z } from 'zod';

// Schema untuk query parameters
const limitsQuerySchema = z.object({
  user_id: z.string().uuid('Invalid user ID'),
});

// GET /api/user/limits
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { user_id } = limitsQuerySchema.parse(Object.fromEntries(searchParams));

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user limits
    const userLimits = await userService.getUserLimits(user_id);

    return NextResponse.json({
      success: true,
      data: {
        ...userLimits,
        limits: {
          daily: parseInt(process.env.DAILY_GENERATION_LIMIT || '50'),
          monthly: parseInt(process.env.MONTHLY_GENERATION_LIMIT || '1500'),
        },
        tier: 'free',
        features: [
          'unlimited_templates',
          'offline_gallery',
          'no_watermark',
          'high_quality',
        ],
      },
    });

  } catch (error) {
    console.error('User limits API error:', error);

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

    // Return default limits untuk error cases
    return NextResponse.json({
      success: true,
      data: {
        daily_limit: parseInt(process.env.DAILY_GENERATION_LIMIT || '50'),
        monthly_limit: parseInt(process.env.MONTHLY_GENERATION_LIMIT || '1500'),
        daily_used: 0,
        monthly_used: 0,
        daily_remaining: parseInt(process.env.DAILY_GENERATION_LIMIT || '50'),
        monthly_remaining: parseInt(process.env.MONTHLY_GENERATION_LIMIT || '1500'),
        last_daily_reset: new Date().toISOString(),
        last_monthly_reset: new Date().toISOString(),
        limits: {
          daily: parseInt(process.env.DAILY_GENERATION_LIMIT || '50'),
          monthly: parseInt(process.env.MONTHLY_GENERATION_LIMIT || '1500'),
        },
        tier: 'free',
        features: [
          'unlimited_templates',
          'offline_gallery',
          'no_watermark',
          'high_quality',
        ],
      },
    });
  }
}

// POST /api/user/limits (untuk reset limits - admin only)
export async function POST(request: NextRequest) {
  try {
    // Validate admin access
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { user_id, type } = await request.json();

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Reset user count
    if (type === 'daily' || type === 'all') {
      await userService.resetDailyCount(user_id);
    }

    if (type === 'monthly' || type === 'all') {
      await userService.resetMonthlyCount(user_id);
    }

    return NextResponse.json({
      success: true,
      message: `User ${type} limits reset successfully`,
    });

  } catch (error) {
    console.error('POST user limits API error:', error);

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// OPTIONS /api/user/limits (untuk CORS)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'no-cache',
    },
  });
}

export const runtime = 'edge';