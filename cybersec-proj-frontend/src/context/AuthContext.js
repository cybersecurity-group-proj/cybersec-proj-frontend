'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Define roles
export const ROLES = {
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
};

// Create authentication context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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