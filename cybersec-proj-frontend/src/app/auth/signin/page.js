'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { authAPI } from '@/lib/api';

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await authAPI.login(username, password);
      if (response.success) {
        login(response.user);
        router.push('/');
      } else {
        setError(response.message || 'Failed to sign in');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 animate-fade-in">
      <div className="card border border-[color:var(--primary-100)] dark:border-[color:var(--primary-800)]">
        <div className="p-8">
          <h1 className="mb-6 text-2xl font-bold text-center text-gray-900 dark:text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--accent)]">
              Sign In
            </span>
          </h1>
          
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input mt-1"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input mt-1"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="font-medium text-[color:var(--primary)] hover:text-[color:var(--primary-dark)] dark:text-[color:var(--primary-light)]">
              Sign Up
            </Link>
          </div>
          
          {/* Demo credentials */}
          <div className="mt-8 rounded-md bg-[color:var(--primary-50)] p-4 dark:bg-[color:var(--primary-900)]/20">
            <h3 className="text-sm font-medium text-[color:var(--primary-800)] dark:text-[color:var(--primary-300)]">
              Demo Accounts
            </h3>
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              <p>Admin: username <strong>admin</strong>, password <strong>admin123</strong></p>
              <p>Moderator: username <strong>mod</strong>, password <strong>mod123</strong></p>
              <p>Regular User: username <strong>user1</strong>, password <strong>user123</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 