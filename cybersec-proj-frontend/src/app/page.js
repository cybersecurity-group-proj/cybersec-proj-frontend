'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { postsAPI } from '@/lib/api';
import Post from '@/components/feed/Post';

export default function Feed() {
  const { user , isBanned } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch posts initially
    fetchPosts();

    // get new posts every 5 secs
    const intervalId = setInterval(() => {
      fetchPosts(false); 
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchPosts = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await postsAPI.getPosts();

      if (response.success) {
        setPosts(response.posts);
        setError(null); 
      } else {
        setError(response.message || 'Failed to fetch posts');
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('An unexpected error occurred');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleDelete = (postId) => {
    // setPosts(prev => prev.filter(post => post.id !== postId));
    setTimeout(() => fetchPosts(false), 500);
  };

  const handleUpdate = (updatedPost) => {
    // setPosts(prev =>
    //   prev.map(post => (post.id === updatedPost.id ? updatedPost : post))
    // );
    setTimeout(() => fetchPosts(false), 500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">
            Social Feed
          </h1>
          
          <div className="flex justify-end">
            {user ? (
              isBanned() ? (
                <div  className="bg-red-500 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                  You are banned. Contact admin to get unbanned.
                </div>
              ):(
                <button
                  onClick={() => router.push('/posts/create')}
                  className="bg-white/90 text-purple-500 hover:bg-white focus:ring-4 focus:ring-purple-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer"
                >
                  Create Post
                </button>
              )

            ) : (
              <a 
                href="/auth/signin" 
                className="bg-white/90 text-purple-500 hover:bg-white focus:ring-4 focus:ring-purple-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer"
              >
                Sign in to post
              </a>
            )}
          </div>
        </div>
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
      ) : posts.length > 0 ? (
        <div className="space-y-4 mt-4">
          {posts.map(post => (
            <Post 
              key={post.id} 
              post={post} 
              onDelete={handleDelete} 
              onUpdate={handleUpdate} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center my-8 p-8 rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-900 shadow-md">
          <h3 className="text-xl font-medium text-purple-700 dark:text-purple-300">No posts yet</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Be the first to create a post!</p>
        </div>
      )}
    </div>
  );
}
