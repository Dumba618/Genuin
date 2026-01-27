'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { authService } from '@/lib/auth'
import { User } from '@/lib/types'
import { useRouter } from 'next/navigation'

export function NavBar() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    setUser(authService.getUser())
    const unsubscribe = authService.subscribe(setUser)
    return unsubscribe
  }, [])

  const handleLogout = async () => {
    await authService.logout()
    router.push('/')
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Genuin
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/feed" className="text-gray-700 hover:text-gray-900">
                  Feed
                </Link>
                <Link href={`/profile/${user.username}`} className="text-gray-700 hover:text-gray-900">
                  Profile
                </Link>
                {user.role === 'moderator' || user.role === 'admin' ? (
                  <Link href="/moderation" className="text-gray-700 hover:text-gray-900">
                    Moderation
                  </Link>
                ) : null}
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-700 hover:text-gray-900">
                  Login
                </Link>
                <Link href="/auth/register" className="text-gray-700 hover:text-gray-900">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}