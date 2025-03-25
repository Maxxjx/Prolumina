import { NextResponse } from 'next/server';

type ErrorResponse = {
  error: {
    code: string;
    message: string;
    details?: any;
  }
};

/**
 * Create a standardized error response for API endpoints
 */
export function errorResponse(
  message: string, 
  status: number = 500, 
  code: string = 'SERVER_ERROR',
  details?: any
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    { 
      error: { 
        code, 
        message,
        ...(details ? { details } : {})
      } 
    },
    { status }
  );
}

/**
 * Handle database-related errors in API endpoints
 */
export function handleDatabaseError(error: any): NextResponse {
  console.error('Database error:', error);
  
  // Check for Prisma-specific errors
  if (error.code) {
    // Handle common Prisma error codes
    switch (error.code) {
      case 'P2002': // Unique constraint failed
        return errorResponse(
          'A record with this information already exists.',
          409,
          'DUPLICATE_RECORD'
        );
      case 'P2025': // Record not found
        return errorResponse(
          'The requested record was not found.',
          404,
          'NOT_FOUND'
        );
      case 'P2003': // Foreign key constraint failed
        return errorResponse(
          'Operation failed due to related data constraints.',
          400,
          'CONSTRAINT_VIOLATION'
        );
      default:
        // Log the code for debugging unknown errors
        console.error(`Unhandled Prisma error code: ${error.code}`);
    }
  }
  
  // Generic database error
  return errorResponse(
    'A database error occurred. Please try again later.',
    500,
    'DATABASE_ERROR'
  );
}

/**
 * Handle validation errors in API endpoints
 */
export function handleValidationError(errors: Record<string, string[]>): NextResponse {
  return errorResponse(
    'Validation failed. Please check your input.',
    400,
    'VALIDATION_ERROR',
    { errors }
  );
}

/**
 * Handle authentication errors in API endpoints
 */
export function handleAuthError(message: string = 'Authentication required'): NextResponse {
  return errorResponse(
    message,
    401,
    'UNAUTHORIZED'
  );
}

/**
 * Handle permission errors in API endpoints
 */
export function handlePermissionError(message: string = 'You do not have permission to perform this action'): NextResponse {
  return errorResponse(
    message,
    403,
    'FORBIDDEN'
  );
} 