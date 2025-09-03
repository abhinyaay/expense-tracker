'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Expenses', href: '/expenses' },
    { name: 'Categories', href: '/categories' },
    { name: 'Analytics', href: '/analytics' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-2xl mr-2">💰</span>
              <span className="font-bold text-xl text-gray-900">Expense Tracker</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {session?.user && (
              <>
                <div className="flex items-center space-x-3">
                  {session.user.image && (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                    />
                  )}
                  <span className="text-sm text-gray-700">
                    {session.user.name}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  title="Sign out"
                >
                  <FaSignOutAlt className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-500 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {session?.user && (
              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="flex items-center px-3 mb-3">
                  {session.user.image && (
                    <img
                      className="h-8 w-8 rounded-full mr-3"
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                    />
                  )}
                  <span className="text-base text-gray-700">
                    {session.user.name}
                  </span>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FaSignOutAlt className="h-5 w-5 mr-2" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
