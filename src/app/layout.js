import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Social Media App',
  description: 'A social media application with different user roles and permissions',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body 
        className={`${inter.className} min-h-screen bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
