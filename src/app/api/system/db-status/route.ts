import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getDatabaseStatus } from '@/lib/init';
import { errorResponse } from '@/lib/api-utils';

/**
 * API Route handler to check database connection status
 */
export async function GET(request: NextRequest) {
  try {
    // First check if the database connection has already been checked
    const status = getDatabaseStatus();
    
    // If it has already failed, return the failure
    if (status.hasCheckedConnection && !status.isConnected) {
      return NextResponse.json({
        connected: false,
        error: 'Database connection previously failed'
      });
    }
    
    // If it's already connected, return success
    if (status.hasCheckedConnection && status.isConnected) {
      return NextResponse.json({
        connected: true,
        status: 'Database connected'
      });
    }
    
    // Otherwise check connection now
    try {
      await prisma.$queryRaw`SELECT 1`;
      return NextResponse.json({
        connected: true,
        status: 'Database connected'
      });
    } catch (err) {
      console.error('Database connection check failed:', err);
      if (err instanceof Error) {
        return NextResponse.json({
          connected: false,
          error: `Database connection failed: ${err.message}`
        });
      }
      return NextResponse.json({
        connected: false,
        error: 'Unknown database error'
      });
    }
  } catch (error) {
    console.error('Error checking database status:', error);
    return errorResponse(
      'Failed to check database status',
      500,
      'SERVER_ERROR'
    );
  }
} 