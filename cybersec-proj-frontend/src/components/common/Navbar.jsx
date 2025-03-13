'use client'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import Button from '@/components/ui/Button'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav 
      className="sticky top-0 z-50 shadow-sm"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link 
            href="/" 
            className="text-xl font-bold"
            style={{ color: 'var(--primary)' }}
          >
            CyberFeed
          </Link>
          
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="hover:text-primary transition-base"
                >
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="hover:text-primary transition-base"
                  >
                    Admin
                  </Link>
                )}
                <Button 
                  onClick={logout}
                  variant="secondary"
                  className="ml-4"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link
                href="/login"
                className="hover:text-primary transition-base"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}