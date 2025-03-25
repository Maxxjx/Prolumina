'use client';

import { useState, useEffect } from 'react';

/**
 * Component to display database connection status
 */
export default function DatabaseStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkStatus() {
      try {
        const response = await fetch('/api/system/db-status');
        
        if (!response.ok) {
          const data = await response.json();
          setStatus('error');
          setError(data.error?.message || 'Database connection failed');
          return;
        }
        
        const data = await response.json();
        setStatus(data.connected ? 'connected' : 'error');
        setError(data.error || null);
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Connection check failed');
      }
    }
    
    checkStatus();
  }, []);

  if (status === 'connected') {
    return null; // Don't show anything when connected
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-md shadow-lg ${
      status === 'checking' ? 'bg-yellow-500/10 border border-yellow-500/20' :
      'bg-red-500/10 border border-red-500/20'
    }`}>
      {status === 'checking' ? (
        <div className="flex items-center">
          <div className="animate-pulse mr-2 w-3 h-3 rounded-full bg-yellow-500"></div>
          <p className="text-yellow-500 text-sm font-medium">Checking database connection...</p>
        </div>
      ) : (
        <div>
          <div className="flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-red-500 mr-2" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
            <p className="text-red-500 text-sm font-medium">Database connection error</p>
          </div>
          {error && (
            <p className="text-gray-300 text-xs mt-1 ml-7">{error}</p>
          )}
          <div className="mt-2 ml-7">
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 