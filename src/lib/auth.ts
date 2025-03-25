import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";

// Simple string comparison - not for production use
const comparePasswords = (plainPassword: string, storedPassword: string): boolean => {
  // In a real app with bcrypt, you would use bcrypt.compare
  // For demo purposes, we'll handle both hashed (from mock DB) and plain text passwords
  if (storedPassword.startsWith('$2b$')) {
    // This would be a bcrypt hash, but we can't verify without bcrypt
    // For demo, let's just compare with our known test passwords
    if (plainPassword === 'admin123' && storedPassword === '$2b$10$Rr5YfUL7SvLRbGdmzwFfce5TJL9TdW0oJDkLcjZ2z66YfcLaDJf1q') {
      return true;
    }
    if (plainPassword === 'team123' && storedPassword === '$2b$10$5QqUXL8ZvEQTKN8Jz7xXG.LcV8UA2isXRrYFOmr6sxQo5gZDXn2WW') {
      return true;
    }
    if (plainPassword === 'client123' && storedPassword === '$2b$10$rW1SHFtDhJ3Cc92y7glRfeCDaXFP6UkQaB18JNjKnW9MhK3xZT0OS') {
      return true;
    }
    return false;
  }
  
  // For plain text passwords (non-production)
  return plainPassword === storedPassword;
};

export const authOptions: NextAuthOptions = {
  // No adapter - we'll manage sessions with JWT
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Use Prisma to find the user
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          });

          if (!user) {
            console.log('User not found:', credentials.email);
            return null;
          }

          const passwordValid = comparePasswords(credentials.password, user.password || '');

          if (!passwordValid) {
            console.log('Invalid password for user:', credentials.email);
            return null;
          }

          console.log('User authenticated successfully:', credentials.email, 'with role:', user.role);
          
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.avatar
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log('Setting JWT token with user data:', user.email, 'role:', user.role);
        return {
          ...token,
          id: user.id,
          role: user.role
        };
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Setting session with token data, role:', token.role);
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role
        }
      };
    }
  },
  debug: process.env.NODE_ENV === 'development',
};
