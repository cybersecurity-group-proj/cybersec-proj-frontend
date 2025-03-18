'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { userAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { ROLES } from '@/context/AuthContext';

export default function UserManagement() {
  const { user, loading: authLoading, canManageUsers } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        // Redirect to sign in if not authenticated
        router.push('/auth/signin');
      } else if (!canManageUsers()) {
        // Redirect to dashboard if not admin
        router.push('/dashboard');
      } else {
        fetchUsers();
      }
    }
  }, [user, authLoading, canManageUsers, router]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getUsers();
      if (response.success) {
        setUsers(response.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await userAPI.updateUserRole(userId, newRole);
      if (response.success) {
        setUsers(
          users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId === user.id) {
      alert('You cannot delete your own account');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await userAPI.deleteUser(userId);
        if (response.success) {
          setUsers(users.filter((u) => u.id !== userId));
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  if (authLoading || !user || !canManageUsers()) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-12 h-12 rounded-full border-4 border-[color:var(--primary-200)] border-t-[color:var(--primary)] animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--accent)]">
          User Management
        </span>
      </h1>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-12 h-12 rounded-full border-4 border-[color:var(--primary-200)] border-t-[color:var(--primary)] animate-spin"></div>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Role
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {users.map((userData) => (
                <tr key={userData.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-[color:var(--primary-100)] flex items-center justify-center text-[color:var(--primary-800)] font-bold">
                        {userData.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {userData.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          @{userData.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <select
                      value={userData.role}
                      onChange={(e) => handleRoleChange(userData.id, e.target.value)}
                      disabled={userData.id === user.id}
                      className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 shadow-sm focus:border-[color:var(--primary)] focus:outline-none focus:ring-1 focus:ring-[color:var(--primary)] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value={ROLES.USER}>User</option>
                      <option value={ROLES.MODERATOR}>Moderator</option>
                      <option value={ROLES.ADMIN}>Admin</option>
                    </select>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteUser(userData.id)}
                      disabled={userData.id === user.id}
                      className="text-[color:var(--error)] hover:text-red-800 disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 