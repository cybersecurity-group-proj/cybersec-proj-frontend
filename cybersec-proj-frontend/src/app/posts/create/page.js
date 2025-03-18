'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { postsAPI } from '@/lib/api';

export default function CreatePostPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Handle authentication redirects in useEffect to avoid hydration issues
  useEffect(() => {
    if (!isLoading && !user && !isRedirecting) {
      setIsRedirecting(true);
      router.push('/auth/signin?redirect=/posts/create');
    }
  }, [user, isLoading, router, isRedirecting]);

  const validateForm = () => {
    if (!title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!content.trim()) {
      setError('Content is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Don't allow submission if already submitting
    if (isSubmitting) return;
    
    // Don't allow empty submission
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      // Create the post
      const response = await postsAPI.createPost(
        { title, content },
        user.id,
        user.name || user.username
      );
      
      if (response.success) {
        // Redirect to appropriate page
        const redirectPath = user.role === 'admin' || user.role === 'moderator' 
          ? '/' // Admins and mods go to main feed
          : '/dashboard'; // Regular users go to dashboard
        
        setIsRedirecting(true);
        router.push(redirectPath);
      } else {
        setError(response.message || 'Failed to create post');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError('An unexpected error occurred');
      setIsSubmitting(false);
    }
  };

  // Show loading during initial authentication check or redirection
  if (isLoading || isRedirecting || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-purple-500">Create New Post</h1>
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-purple-500 cursor-pointer"
        >
          Back
        </button>
      </div>
      
      <div className="bg-white dark:bg-slate-700 rounded-lg shadow-lg border border-purple-100 dark:border-purple-700/50 p-8">
        {error && (
          <div className="p-3 mb-6 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-300">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block mb-2 text-lg font-medium text-gray-900 dark:text-gray-200">
              Title
            </label>
            <input
              id="title"
              type="text"
              className="bg-gray-50 border border-purple-200 text-gray-900 text-lg rounded-lg focus:ring-purple-400 focus:border-purple-400 block w-full p-3 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-400 dark:focus:border-purple-400"
              placeholder="Your post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block mb-2 text-lg font-medium text-gray-900 dark:text-gray-200">
              Content
            </label>
            <textarea
              id="content"
              rows="10"
              className="bg-gray-50 border border-purple-200 text-gray-900 text-lg rounded-lg focus:ring-purple-400 focus:border-purple-400 block w-full p-3 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-400 dark:focus:border-purple-400"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className={`text-white bg-purple-400 hover:bg-purple-500 focus:ring-4 focus:ring-purple-200 font-medium rounded-lg text-lg px-8 py-3 text-center dark:bg-purple-500/70 dark:hover:bg-purple-500/90 dark:focus:ring-purple-300/50 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Post...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 