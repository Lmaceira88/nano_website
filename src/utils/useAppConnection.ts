'use client';

import { useState, useEffect } from 'react';

interface ConnectionStatus {
  isConnected: boolean;
  isAttempting: boolean;
  error: string | null;
  targetUrl: string;
}

/**
 * Custom hook to manage connection between auth system and ProjectNano app
 */
export function useAppConnection() {
  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: false,
    isAttempting: false,
    error: null,
    targetUrl: process.env.NEXT_PUBLIC_PROJECTNANO_URL || 'http://localhost:5174'
  });

  // Check if ProjectNano is reachable
  const checkConnection = async () => {
    setStatus(prev => ({ ...prev, isAttempting: true, error: null }));
    
    try {
      const targetUrl = process.env.NEXT_PUBLIC_PROJECTNANO_URL || 'http://localhost:5174';
      
      // Use a ping approach - try to fetch from the target with a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${targetUrl}/ping`, {
        method: 'HEAD',
        signal: controller.signal,
        mode: 'no-cors' // This allows us to ping without CORS issues
      }).catch(() => null); // Catch network errors
      
      clearTimeout(timeoutId);
      
      // If we get here without an abort, the server is responding
      setStatus({
        isConnected: true,
        isAttempting: false,
        error: null,
        targetUrl
      });
      
      return true;
    } catch (err) {
      console.error('Connection error:', err);
      setStatus(prev => ({
        ...prev,
        isConnected: false,
        isAttempting: false,
        error: 'Could not connect to ProjectNano application'
      }));
      
      return false;
    }
  };

  // Function to connect to ProjectNano with auth data
  const connectWithAuth = async (userData: any, sessionData: any) => {
    setStatus(prev => ({ ...prev, isAttempting: true }));
    
    try {
      const targetUrl = process.env.NEXT_PUBLIC_PROJECTNANO_URL || 'http://localhost:5174';
      const isAuthSharingEnabled = process.env.NEXT_PUBLIC_AUTH_SHARING_ENABLED === 'true';
      
      // Store session and user data in localStorage for ProjectNano to access
      if (isAuthSharingEnabled) {
        // Set auth data in localStorage using configured keys
        const sessionKey = process.env.NEXT_PUBLIC_SESSION_STORAGE_KEY || 'supabase.auth.token';
        const userKey = process.env.NEXT_PUBLIC_USER_STORAGE_KEY || 'supabase.auth.user';
        
        if (sessionData) {
          localStorage.setItem(sessionKey, JSON.stringify(sessionData));
        }
        
        if (userData) {
          localStorage.setItem(userKey, JSON.stringify(userData));
        }
        
        // Set a flag indicating the auth source
        localStorage.setItem('auth_source', 'projectnano_auth_system');
      }
      
      // Build URL with query parameters as fallback
      const url = new URL(targetUrl);
      if (userData?.id) {
        url.searchParams.set('user_id', userData.id);
      }
      if (sessionData?.access_token) {
        url.searchParams.set('access_token', sessionData.access_token);
      }
      
      setStatus({
        isConnected: true,
        isAttempting: false,
        error: null,
        targetUrl: url.toString()
      });
      
      return url.toString();
    } catch (err) {
      console.error('Error preparing connection:', err);
      setStatus(prev => ({
        ...prev,
        isConnected: false,
        isAttempting: false,
        error: 'Failed to prepare connection data'
      }));
      
      return null;
    }
  };

  return {
    status,
    checkConnection,
    connectWithAuth
  };
} 