'use client';

import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaGoogle } from 'react-icons/fa';

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push('/dashboard');
      } else {
        setLoading(false);
      }
    };
    
    checkSession();
  }, [router]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Sign in error:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100">
            <span className="text-2xl">💰</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Expense Tracker
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Track your expenses with ease and get insights into your spending habits
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <button
            onClick={handleGoogleSignIn}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            <FaGoogle className="mr-3 h-5 w-5" />
            Continue with Google
          </button>
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our terms of service and privacy policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
