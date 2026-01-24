'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function AuthForm({ isLogin }: { isLogin: boolean }) {
  const [form, setForm] = useState({ email: '', password: '', username: '', name: '' })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const endpoint = isLogin ? '/auth/login' : '/auth/register'
    const res = await fetch(`http://localhost:8000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      router.push('/feed')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {!isLogin && <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} />}
      <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
      {!isLogin && <input placeholder="Username" onChange={e => setForm({...form, username: e.target.value})} />}
      <input type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
      <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
    </form>
  )
}