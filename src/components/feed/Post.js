'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { postsAPI } from '@/lib/api';

export default function Post({ post, onDelete, onUpdate, showActions = true }) {
  const { canEditPost, canDeletePost } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTitle(post.title);
    setContent(post.content);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    
    setIsUpdating(true);
    try {
      const response = await postsAPI.updatePost(post.id, { title, content });
      if (response.success) {
        onUpdate(response.post);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating post:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setIsDeleting(true);
      try {
        const response = await postsAPI.deletePost(post.id);
        if (response.success) {
          onDelete(post.id);
        }
      } catch (error) {
        console.error('Error deleting post:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-700 rounded-lg shadow-md border border-purple-100 dark:border-purple-900/30 overflow-hidden transform transition-all duration-300 hover:shadow-lg">
      <div className="p-6">
        {isEditing ? (
          <div className="space-y-4 animate-fade-in">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-purple-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:border-purple-700 dark:text-white"
              placeholder="Post title"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 border border-purple-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:border-purple-700 dark:text-white"
              rows={4}
              placeholder="Post content"
            />
            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-500 dark:hover:bg-purple-600 dark:focus:ring-purple-400 disabled:opacity-50 cursor-pointer"
              >
                {isUpdating ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                className="text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:ring-gray-600 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {post.title}
              </h2>
              {showActions && (
                <div className="flex space-x-2">
                  {canEditPost(post) && (
                    <button
                      onClick={handleEdit}
                      className="rounded-md text-sm text-purple-600 hover:bg-purple-50 px-3 py-1 transition-all duration-200 dark:text-purple-400 dark:hover:bg-purple-900/30 cursor-pointer"
                    >
                      Edit
                    </button>
                  )}
                  {canDeletePost(post) && (
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="rounded-md text-sm text-red-600 hover:bg-red-50 px-3 py-1 transition-all duration-200 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-900/30 cursor-pointer"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <div className="prose prose-purple dark:prose-invert max-w-none mb-4">
              <p className="text-gray-700 dark:text-gray-300">
                {post.content}
              </p>
            </div>
            
            <div className="flex items-center pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 text-sm font-bold dark:bg-purple-900 dark:text-purple-300">
                  {post.username.charAt(0)}
                </div>
              </div>
              <div className="ml-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {post.username}
                </span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(post.createdAt)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 