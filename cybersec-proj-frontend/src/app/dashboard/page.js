'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { postsAPI } from '@/lib/api';
import Post from '@/components/feed/Post';

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If auth is still loading, wait
    if (authLoading) return;

    // If user is not authenticated, redirect to login
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    // Initial fetch of user posts
    fetchUserPosts();
    
    // Set up interval to refresh posts every 5 seconds
    const intervalId = setInterval(() => {
      fetchUserPosts(false); // Pass false to not show loading indicator for refreshes
    }, 5000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [user, authLoading, router]);

  const fetchUserPosts = async (showLoading = true) => {
    if (!user) return;
    
    try {
      if (showLoading) {
        setLoading(true);
      }
      
      const response = await postsAPI.getPosts();
      if (response.success) {
        // Filter posts to only include those by the current user
        const filtered = response.posts.filter(post => post.userId === user.id);
        setUserPosts(filtered);
      } else {
        setError('Failed to fetch your posts');
      }
    } catch (err) {
      console.error('Error fetching user posts:', err);
      setError('An unexpected error occurred');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const handleDelete = (postId) => {
    // Immediately update UI
    setUserPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    
    // Then refresh all posts after a short delay
    setTimeout(() => {
      fetchUserPosts(false);
    }, 500);
  };

  const handleUpdate = (updatedPost) => {
    // Immediately update UI
    setUserPosts(prevPosts => 
        prevPosts.map(post => post.id === updatedPost.id ? updatedPost : post)
    );
    
    // Then refresh all posts after a short delay
    setTimeout(() => {
      fetchUserPosts(false);
    }, 500);
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Router will handle redirect
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg shadow-lg p-6 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-4">My Dashboard</h1>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Welcome, {user.name || user.username}!
            </h2>
            <p className="mb-2">
              Role: <span className="font-medium capitalize bg-purple-500 bg-opacity-40 px-2 py-0.5 rounded">{user.role}</span>
            </p>
          </div>
          
          {/* Admin panel link removed - route was not implemented */}
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300">My Posts</h2>
        
        <button
          onClick={() => router.push('/posts/create')}
          className="text-white bg-purple-400 hover:bg-purple-500 focus:ring-4 focus:ring-purple-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-400/80 dark:hover:bg-purple-500/80 dark:focus:ring-purple-300/50 cursor-pointer"
        >
          Create Post
        </button>
      </div>
      
      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-100 border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : userPosts.length > 0 ? (
        <div className="space-y-4 mt-4">
          {userPosts.map(post => (
            <Post 
              key={post.id} 
              post={post} 
              onDelete={handleDelete} 
              onUpdate={handleUpdate} 
              showActions={true} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center my-8 p-8 rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-900 shadow-md">
          <h3 className="text-xl font-medium text-purple-700 dark:text-purple-300">No posts yet</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Create your first post using the button above!</p>
        </div>
      )}
    </div>
  );
} 