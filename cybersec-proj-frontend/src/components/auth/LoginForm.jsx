'use client'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function LoginForm() {
  const { login } = useAuth()
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(credentials)
  }

  return (
    <div 
      className="max-w-md mx-auto p-8 rounded-xl shadow-sm"
      style={{
        backgroundColor: 'var(--background)',
        border: '1px solid var(--gray-light)'
      }}
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email"
          type="email"
          value={credentials.email}
          onChange={(e) => setCredentials({...credentials, email: e.target.value})}
          required
        />
        <Input
          label="Password"
          type="password"
          value={credentials.password}
          onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          required
        />
        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>
    </div>
  )
}