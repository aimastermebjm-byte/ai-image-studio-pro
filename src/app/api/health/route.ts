import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

// GET /api/health
export async function GET() {
  const startTime = Date.now();
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    services: {} as Record<string, any>,
    runtime: {} as Record<string, any>,
    memory: {} as Record<string, any>,
    response_time: 0,
  };

  try {
    // Check Supabase connection
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from('users').select('id').limit(1);

      health.services.supabase = {
        status: error ? 'error' : 'ok',
        error: error?.message || null,
        response_time: Date.now() - startTime,
      };
    } catch (error) {
      health.services.supabase = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        response_time: Date.now() - startTime,
      };
    }

    // Check environment variables
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'SUPABASE_ANON_KEY',
      'NEXT_PUBLIC_GEMINI_API_URL',
    ];

    const missingEnvVars = requiredEnvVars.filter(
      (envVar) => !process.env[envVar]
    );

    if (missingEnvVars.length > 0) {
      health.services.environment = {
        status: 'error',
        error: `Missing environment variables: ${missingEnvVars.join(', ')}`,
      };
      health.status = 'degraded';
    } else {
      health.services.environment = {
        status: 'ok',
      };
    }

    // Check if it's running in Edge Runtime
    try {
      // EdgeRuntime check
      const isEdge = typeof process !== 'undefined' &&
                    typeof process.versions !== 'undefined' &&
                    typeof process.versions.edge !== 'undefined';

      if (isEdge) {
        health.runtime = {
          type: 'edge',
          platform: 'vercel-edge',
        };
      } else {
        health.runtime = {
          type: 'nodejs',
          version: process.version,
          platform: process.platform,
        };
      }
    } catch (error) {
      health.runtime = {
        type: 'unknown',
        platform: 'unknown',
      };
    }

    // Memory usage (jika available)
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memUsage = process.memoryUsage();
      health.memory = {
        rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
        heap_total: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
        heap_used: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
        external: `${Math.round(memUsage.external / 1024 / 1024)} MB`,
      };
    }

    // Total response time
    const totalResponseTime = Date.now() - startTime;
    health.response_time = totalResponseTime;

    // Determine overall health status
    const serviceStatuses = Object.values(health.services).map(
      (service: any) => service.status
    );

    if (serviceStatuses.includes('error')) {
      health.status = 'error';
    } else if (serviceStatuses.includes('degraded')) {
      health.status = 'degraded';
    }

    // Return appropriate HTTP status
    const statusCode = health.status === 'ok' ? 200 :
                     health.status === 'degraded' ? 200 : 503;

    return NextResponse.json(health, {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Response-Time': `${totalResponseTime}ms`,
      },
    });

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      response_time: Date.now() - startTime,
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }
}

// OPTIONS /api/health (untuk CORS)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}

// export const runtime = 'edge'; // Disabled for SSR compatibility