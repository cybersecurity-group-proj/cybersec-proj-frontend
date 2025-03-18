'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { postsAPI } from '@/lib/api';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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
      
      // Make sure we have a user
      if (!user || !user.id) {
        setError('You must be logged in to create a post');
        return;
      }
      
      // Create the post
      const response = await postsAPI.createPost(
        { title, content },
        user.id,
        user.name || user.username
      );
      
      if (response.success) {
        // Clear the form
        setTitle('');
        setContent('');
        
        // Notify parent component
        onPostCreated(response.post);
      } else {
        setError(response.message || 'Failed to create post');
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 mb-4">
        <p className="text-gray-500 dark:text-gray-400">
          Please log in to create a post.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 mb-4">
      <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Create a Post</h2>
      {error && (
        <div className="p-2 mb-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-100">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-300">
            Title
          </label>
          <input
            id="title"
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
            placeholder="Enter a title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-300">
            Content
          </label>
          <textarea
            id="content"
            rows="3"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <button
          type="submit"
          className={`text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800 ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost; 