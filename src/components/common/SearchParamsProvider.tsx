'use client';

import React, { Suspense, ReactNode } from 'react';

interface SearchParamsProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * A wrapper component that provides a Suspense boundary for components that use useSearchParams
 * Resolves the "useSearchParams() should be wrapped in a suspense boundary" error
 */
export default function SearchParamsProvider({ 
  children, 
  fallback = <div>Loading...</div> 
}: SearchParamsProviderProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
} 