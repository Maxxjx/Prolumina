import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from './providers';
import { checkDatabaseConnection } from '@/lib/init';
import DatabaseStatus from '@/components/DatabaseStatus';

const inter = Inter({ subsets: ['latin'] });

// Check database connection on server startup
if (typeof window === 'undefined') {
  checkDatabaseConnection()
    .then(() => console.log('App initialized successfully'))
    .catch(err => console.error('App initialization error:', err));
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="ProjectPulse" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ProjectPulse" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#8B5CF6" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#8B5CF6" />

        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#8B5CF6" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} bg-[#1F2937] text-white antialiased`}>
        <Providers>
          <div className="flex h-screen overflow-hidden">
            <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
              <main>
                {children}
              </main>
            </div>
          </div>
          {/* Database status indicator */}
          <DatabaseStatus />
        </Providers>
      </body>
    </html>
  );
}
