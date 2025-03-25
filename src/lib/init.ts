import { prisma } from '@/lib/prisma';

let hasCheckedConnection = false;
let isDatabaseConnected = false;

/**
 * Check if the database is connected
 * - This is executed only once at server startup
 * - Only runs on the server side
 */
export async function checkDatabaseConnection() {
  // Skip if already checked or in client
  if (hasCheckedConnection || typeof window !== 'undefined') {
    return isDatabaseConnected;
  }

  try {
    // Try a simple query to check the connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Log success
    console.log('✅ Database connection successful');
    
    // Try to get any users to verify schema access
    const userCount = await prisma.user.count();
    console.log(`Found ${userCount} users in database`);
    
    isDatabaseConnected = true;
    hasCheckedConnection = true;
    
    return true;
  } catch (error) {
    // Log detailed error information for debugging
    console.error('❌ Database connection failed:', error);
    
    if (error instanceof Error) {
      console.error(`Error details: ${error.message}`);
      if ('code' in error) {
        console.error(`Error code: ${(error as any).code}`);
      }
    }
    
    hasCheckedConnection = true;
    isDatabaseConnected = false;
    
    // Throw so it can be caught at app initialization
    throw new Error(`Failed to connect to database: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Returns the current database connection status
 */
export function getDatabaseStatus() {
  return {
    hasCheckedConnection,
    isConnected: isDatabaseConnected
  };
}

/**
 * Initializes the application
 * - Tests database connection
 * - Performs any other setup tasks
 * 
 * @returns Promise<boolean> - Whether initialization was successful
 */
export async function initializeApp(): Promise<{
  isInitialized: boolean;
  isDatabaseConnected: boolean;
}> {
  console.log('Initializing application...');

  try {
    // Test the database connection
    const isDatabaseConnected = await checkDatabaseConnection();
    
    if (!isDatabaseConnected) {
      console.error('Database connection failed during initialization');
      return { 
        isInitialized: false,
        isDatabaseConnected: false 
      };
    }
    
    console.log('✅ Database connection successful');
    
    // Perform any other initialization tasks here
    
    return { 
      isInitialized: true,
      isDatabaseConnected: true
    };
  } catch (error) {
    console.error('Error during application initialization:', error);
    return { 
      isInitialized: false,
      isDatabaseConnected: false
    };
  }
}
