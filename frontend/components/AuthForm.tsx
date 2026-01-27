'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth'

export function AuthForm({ isLogin }: { isLogin: boolean }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
    username: '',
    name: '',
    bio: '',
    headline: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let result;
      if (isLogin) {
        result = await authService.login(form.username || form.email, form.password)
      } else {
        result = await authService.register({
          email: form.email,
          username: form.username,
          password: form.password,
          name: form.name,
          bio: form.bio || undefined,
          headline: form.headline || undefined,
        })
      }

      if (result.success) {
        router.push('/feed')
      } else {
        setError(result.error || 'An error occurred')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-500 text-sm">{error}</div>}

        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={e => setForm({...form, username: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Bio (optional)"
              value={form.bio}
              onChange={e => setForm({...form, bio: e.target.value})}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Headline (optional)"
              value={form.headline}
              onChange={e => setForm({...form, headline: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({...form, email: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />

        {isLogin && (
          <input
            type="text"
            placeholder="Username or Email"
            value={form.username}
            onChange={e => setForm({...form, username: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        )}

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({...form, password: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : (isLogin ? 'Login' : 'Register')}
        </button>
      </form>
    </div>
  )
}