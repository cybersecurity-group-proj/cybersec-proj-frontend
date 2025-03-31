'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';

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
    setLoading(true);
    const initializeAuth = async () => {
      
      console.log('[AuthProvider] useEffect running');
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        setLoading(false);
        return;
      }

      try {
        
        await getCurrentUser();

      } catch (err) {
        console.warn('Auth initialization failed:', err);
        setUser(null)
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);


  // Login function
  const getCurrentUser = async () => {
    const res = await authAPI.getCurrentUser();
    if (res.success) {
      const currentUser = res.user
      currentUser.id = currentUser.uid
      currentUser.role = currentUser.role.name
      setUser(currentUser);
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
    return user?.role === role;
  };

  // Check if user is admin
  const isAdmin = () => hasRole(ROLES.ADMIN);
  
  // Check if user is moderator
  const isModerator = () => hasRole(ROLES.MODERATOR);

  const isBanned = () => hasRole(ROLES.BANNED);
  
  // Check if user owns a resource
  const isOwner = (resourceUserId) => {
    return user?.id === resourceUserId;
  };

  // Check if user can perform action on a resource
  const canModifyPost = (post) => {
    if (!user) return false;
    return isAdmin() || isModerator() || (isOwner(post.userId) && !isBanned());
  };

  const canDeletePost = (post) => {
    if (!user) return false;
    return isAdmin() || isModerator() || (isOwner(post.userId) && !isBanned());
  };

  const canEditPost = (post) => {
    if (!user) return false;
    return isAdmin() || (isOwner(post.userId) && !isBanned());
  };

  const canManageUsers = () => {
    return isAdmin();
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
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
      getCurrentUser,
      isBanned
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext); 