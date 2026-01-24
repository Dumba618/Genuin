'use client'
import { useParams } from 'next/navigation'
import { ProfileCard } from '@/components/ProfileCard'

export default function Profile() {
  const { username } = useParams()
  return <ProfileCard username={username as string} />
}