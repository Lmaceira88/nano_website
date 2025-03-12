import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata = {
  title: 'Register | ProjectNano',
  description: 'Create a new account for ProjectNano'
};

export default function RegisterPage() {
  // Server-side redirect to the new unified onboarding flow
  redirect('/onboarding');

  // This code below won't execute due to the redirect, but is kept for fallback
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-12 w-12 bg-blue-600 flex items-center justify-center rounded-md">
              <span className="text-white text-2xl font-bold">P</span>
            </div>
            <span className="text-white text-xl font-bold">ProjectNano</span>
          </Link>
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Redirecting to onboarding...
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Please wait while we redirect you to our new unified onboarding experience
        </p>
        
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
        
        <div className="mt-6 text-center">
          <Link 
            href="/onboarding" 
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Click here if you're not redirected automatically
          </Link>
        </div>
      </div>
    </div>
  );
} 