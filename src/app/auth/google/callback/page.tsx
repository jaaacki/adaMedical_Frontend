'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import apiClient from '@/lib/api-client';

export default function GoogleCallback() {
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const processGoogleCallback = async () => {
      try {
        // In a real implementation, we'd handle the token exchange here
        // But for simplicity, we'll assume the backend handles this and returns tokens directly
        
        // Extract tokens from the URL if your backend redirects with tokens in URL params
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
          if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
          }
          
          // Redirect to dashboard
          router.push('/dashboard');
        } else {
          // If tokens are not in URL, assume the backend handled the OAuth flow and returned tokens in the response
          const code = searchParams.get('code');
          const state = searchParams.get('state');
          
          if (code && state) {
            // Backend directly provides tokens in the response
            // Redirect to the callback endpoint on our backend
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/callback?code=${code}&state=${state}`;
          } else {
            setError('Authentication failed: Missing parameters');
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to authenticate with Google');
      }
    };

    processGoogleCallback();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Authentication Failed</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <button
              onClick={() => router.push('/auth/login')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-primary-600 rounded-full animate-spin"></div>
          <h2 className="mt-6 text-center text-xl font-medium text-gray-900">
            Processing your Google sign-in...
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please wait while we authenticate your account.
          </p>
        </div>
      </div>
    </div>
  );
}