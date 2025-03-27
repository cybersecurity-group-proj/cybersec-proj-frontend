'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/lib/api2';

export const ROLES = {
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
  BANNED: 'banned',
};

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, try to refresh and get current user
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('[AuthProvider] useEffect running');
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        setLoading(false);
        return;
      }

      try {
        // Try to refresh access token
        const res = await authAPI.refreshAccessToken?.();
        if (!res?.success) throw new Error('Refresh failed');

        // Then get user data
        const userRes = await authAPI.getCurrentUser();
        if (userRes.success) {
          setUser(userRes.user);
        }
      } catch (err) {
        console.warn('Auth initialization failed:', err);
        await authAPI.logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);


  // Login function
  const login = async (username, password) => {
    const res = await authAPI.login(username, password);
    if (res.success) {
      setUser(res.user);
    }
    return res;
  };

  // Logout function
  const logout = async () => {
    await authAPI.logout();
    setUser(null);
  };

  // Update user data (for role changes, etc.)
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role?.name === role;
  };

  // Check if user is admin
  const isAdmin = () => hasRole(ROLES.ADMIN);
  
  // Check if user is moderator
  const isModerator = () => hasRole(ROLES.MODERATOR);
  
  // Check if user owns a resource
  const isOwner = (resourceUserId) => {
    return user?.id === resourceUserId;
  };

  // Check if user can perform action on a resource
  const canModifyPost = (post) => {
    if (!user) return false;
    return isAdmin() || isModerator() || isOwner(post.userId);
  };

  const canDeletePost = (post) => {
    if (!user) return false;
    return isAdmin() || isModerator() || isOwner(post.userId);
  };

  const canEditPost = (post) => {
    if (!user) return false;
    return isAdmin() || isOwner(post.userId);
  };

  const canManageUsers = () => {
    return isAdmin();
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      updateUser,
      hasRole,
      isAdmin,
      isModerator,
      isOwner,
      canModifyPost,
      canDeletePost,
      canEditPost,
      canManageUsers,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext); 