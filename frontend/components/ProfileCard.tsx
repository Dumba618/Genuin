'use client'
import { useEffect, useState } from 'react'
import { User, Post } from '@/lib/types'
import { apiClient } from '@/lib/api'
import { authService } from '@/lib/auth'
import { PostCard } from './PostCard'

export function ProfileCard({ username }: { username: string }) {
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isFollowing, setIsFollowing] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    loadProfile()
    setCurrentUser(authService.getUser())
  }, [username])

  const loadProfile = async () => {
    setLoading(true)
    const userResponse = await apiClient.getUser(username)
    const postsResponse = await apiClient.getUserPosts(username)

    if (userResponse.data) {
      setUser(userResponse.data)
    } else {
      setError(userResponse.error || 'Failed to load user')
    }

    if (postsResponse.data) {
      setPosts(postsResponse.data)
    }

    setLoading(false)
  }

  const handleFollow = async () => {
    if (!user) return

    const response = isFollowing
      ? await apiClient.unfollowUser(user.username)
      : await apiClient.followUser(user.username)

    if (response.data) {
      setIsFollowing(!isFollowing)
    }
  }

  if (loading) return <div className="text-center mt-8">Loading...</div>
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>
  if (!user) return <div className="text-center mt-8">User not found</div>

  const isOwnProfile = currentUser?.username === username

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <div className="flex items-center mb-4">
          <div className="w-20 h-20 bg-gray-300 rounded-full mr-4"></div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600">@{user.username}</p>
            {user.headline && <p className="text-gray-700 mt-1">{user.headline}</p>}
          </div>
        </div>

        {user.bio && <p className="mb-4">{user.bio}</p>}

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Joined {new Date(user.created_at).toLocaleDateString()}
          </div>

          {!isOwnProfile && currentUser && (
            <button
              onClick={handleFollow}
              className={`px-4 py-2 rounded ${
                isFollowing
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts yet.</p>
        ) : (
          posts.map(post => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  )
}