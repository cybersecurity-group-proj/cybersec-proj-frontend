'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin, isModerator } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Desktop Nav */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--accent)] bg-clip-text text-transparent">
                Social Feed
              </span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:items-center md:space-x-4">
              <Link 
                href="/" 
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-[color:var(--primary)] hover:bg-[color:var(--primary-50)] transition-colors dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
              >
                Feed
              </Link>
              {user && (
                <>
                  <Link 
                    href="/dashboard" 
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-[color:var(--primary)] hover:bg-[color:var(--primary-50)] transition-colors dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/posts/create" 
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-[color:var(--primary)] hover:bg-[color:var(--primary-50)] transition-colors dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    Create Post
                  </Link>
                </>
              )}
              {isAdmin() && (
                <Link 
                  href="/dashboard/users" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-[color:var(--primary)] hover:bg-[color:var(--primary-50)] transition-colors dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
                >
                  Manage Users
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[color:var(--primary)] hover:bg-[color:var(--primary-50)] focus:outline-none dark:text-gray-300 cursor-pointer"
            >
              <span className="sr-only">Open main menu</span>
              {!mobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop Authentication */}
          <div className="hidden md:flex md:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center text-purple-700 dark:text-purple-200 font-bold mr-2">
                    {user.name?.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {user.name || 'User'}
                    </span>
                    <span className="text-xs font-medium text-purple-600 dark:text-purple-400 capitalize">
                      {user.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="ml-4 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium cursor-pointer transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link
                  href="/auth/signin"
                  className="btn btn-primary text-sm cursor-pointer"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="btn btn-secondary text-sm cursor-pointer"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} animate-fade-in`}>
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              href="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[color:var(--primary)] hover:bg-[color:var(--primary-50)] dark:text-gray-300 cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              Feed
            </Link>
            {user && (
              <>
                <Link 
                  href="/dashboard" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[color:var(--primary)] hover:bg-[color:var(--primary-50)] dark:text-gray-300 cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/posts/create" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[color:var(--primary)] hover:bg-[color:var(--primary-50)] dark:text-gray-300 cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Post
                </Link>
              </>
            )}
            {isAdmin() && (
              <Link 
                href="/dashboard/users" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[color:var(--primary)] hover:bg-[color:var(--primary-50)] dark:text-gray-300 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Manage Users
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              {user ? (
                <>
                  <div className="flex items-center px-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-[color:var(--primary-100)] flex items-center justify-center text-[color:var(--primary-800)] font-bold">
                        {user.name.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800 dark:text-white">{user.name}</div>
                      <div className="text-sm text-[color:var(--primary)] dark:text-[color:var(--primary-light)]">{user.role}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-[color:var(--primary)] hover:bg-[color:var(--primary-50)] dark:text-gray-300 cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="block px-3 py-2 text-base font-medium text-[color:var(--primary)] hover:bg-[color:var(--primary-50)] dark:text-[color:var(--primary-light)] cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block px-3 py-2 text-base font-medium text-[color:var(--primary)] hover:bg-[color:var(--primary-50)] dark:text-[color:var(--primary-light)] cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
} 