'use client';

import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';

export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </AuthProvider>
  );
}