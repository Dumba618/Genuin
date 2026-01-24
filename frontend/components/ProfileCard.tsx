'use client'
import { useEffect, useState } from 'react'

export function ProfileCard({ username }: { username: string }) {
  const [user, setUser] = useState(null)
  useEffect(() => {
    fetch(`/api/users/${username}`).then(res => res.json()).then(setUser)
  }, [username])
  return user ? <div>{user.name}</div> : <div>Loading...</div>
}