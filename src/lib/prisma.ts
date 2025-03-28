import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Function to test the database connection - only for server components
export async function testDatabaseConnection() {
  // Check if running on the server
  if (typeof window !== 'undefined') {
    console.warn('Database connection test attempted in browser environment');
    return false;
  }
  
  try {
    // Try a simple query to check if the database is connected
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Failed to connect to database. Please check your database configuration.');
  }
}

// Safe version that can be imported in client components
// This returns a boolean indicating if we're in a server environment
export function isDatabaseEnvironment() {
  return typeof window === 'undefined';
}

export { prisma };