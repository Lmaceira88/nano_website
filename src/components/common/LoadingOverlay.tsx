import React from 'react';

interface LoadingOverlayProps {
  message: string;
}

export default function LoadingOverlay({ message }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
        <h3 className="text-xl font-semibold mb-2">Please Wait</h3>
        <p className="text-gray-600">
          {message || 'Loading...'}
        </p>
      </div>
    </div>
  );
} 