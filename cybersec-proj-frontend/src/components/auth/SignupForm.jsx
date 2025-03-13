'use client'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function SignupForm() {
  const { signup } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
      newErrors.email = 'Invalid email format'
    }
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    if (!formData.password.match(/[!@#$%^&*(),.?":{}|<>]/)) {
      newErrors.password = 'Password requires at least one special character'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    await signup(formData)
  }

  return (
    <div className="max-w-md mx-auto p-8 rounded-xl shadow-sm bg-background border border-gray-light">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email"
          type="email"
          error={errors.email}
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <Input
          label="Password"
          type="password"
          error={errors.password}
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <Input
          label="Confirm Password"
          type="password"
          error={errors.confirmPassword}
          value={formData.confirmPassword}
          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
        />
        <Button type="submit" className="w-full">
          Create Account
        </Button>
      </form>
    </div>
  )
}