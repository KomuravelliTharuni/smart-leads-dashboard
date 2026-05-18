import React, { useState } from 'react'
import api from '../api'
import { useNavigate, Link } from 'react-router-dom'
import { Input } from '../components/FormField'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const nav = useNavigate()

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!name) newErrors.name = 'Name is required'
    if (!email) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format'
    if (!password) newErrors.password = 'Password is required'
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await api.post('/auth/register', { name, email, password })
      setSuccess(true)
      setTimeout(() => nav('/login'), 1500)
    } catch (err: any) {
      setErrors({ submit: err?.response?.data?.error || 'Registration failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded shadow-lg p-8 transition-colors">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Smart Leads</h1>
        {success && (
          <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded text-center font-medium animate-pulse">
            ✅ Successfully registered! Redirecting to login...
          </div>
        )}
        <form onSubmit={submit}>
          <Input label="Name" value={name} onChange={setName} error={errors.name} />
          <Input label="Email" value={email} onChange={setEmail} error={errors.email} type="email" />
          <Input label="Password" value={password} onChange={setPassword} error={errors.password} type="password" />
          {errors.submit && <div className="text-red-600 dark:text-red-400 text-sm mb-4 p-3 bg-red-50 dark:bg-red-900 rounded">{errors.submit}</div>}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded font-medium disabled:opacity-50 transition-colors"
          >
            {loading ? 'Creating account...' : success ? 'Registered!' : 'Create account'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account? <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
