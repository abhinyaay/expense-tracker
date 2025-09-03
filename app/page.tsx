'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <span className="text-2xl mr-2">💰</span>
              <h1 className="text-xl font-bold text-gray-900">Expense Tracker</h1>
            </div>
            <Link
              href="/auth/signin"
              className="btn-primary"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Track Your Expenses
            <span className="block text-primary-600">With Ease</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Get insights into your spending habits, categorize your expenses, and make informed financial decisions with our intuitive expense tracker.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Link
              href="/auth/signin"
              className="btn-primary text-lg px-8 py-3"
            >
              Start Tracking Now
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Analytics & Insights
              </h3>
              <p className="text-gray-500">
                Get detailed analytics about your spending patterns and track expenses by category and time period.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-3xl mb-4">🏷️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Custom Categories
              </h3>
              <p className="text-gray-500">
                Create and manage custom categories to organize your expenses exactly how you want.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Mobile Responsive
              </h3>
              <p className="text-gray-500">
                Access your expense tracker from anywhere with our fully responsive mobile-friendly design.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Secure Login
              </h3>
              <p className="text-gray-500">
                Sign in securely with your Google account. Your data is protected and private.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-3xl mb-4">📅</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Date Tracking
              </h3>
              <p className="text-gray-500">
                Automatic date tracking with the ability to customize dates for accurate expense recording.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-3xl mb-4">🌍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Location Tracking
              </h3>
              <p className="text-gray-500">
                Track where you spend your money by adding location information to your expenses.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 Expense Tracker. Built with Next.js and MongoDB.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
