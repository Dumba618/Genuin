'use client'
import { useEffect, useState } from 'react'
import { Post, ModerationQueueData } from '@/lib/types'
import { apiClient } from '@/lib/api'
import { authService } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export function ModerationQueue() {
  const [queue, setQueue] = useState<ModerationQueueData>({ posts: [], reports: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const user = authService.getUser()
    if (!user || (user.role !== 'moderator' && user.role !== 'admin')) {
      router.push('/feed')
      return
    }

    loadQueue()
  }, [])

  const loadQueue = async () => {
    setLoading(true)
    const response = await apiClient.getModerationQueue()
    setLoading(false)

    if (response.data) {
      setQueue(response.data)
    } else {
      setError(response.error || 'Failed to load moderation queue')
    }
  }

  const approvePost = async (postId: number) => {
    // Note: This endpoint doesn't exist in the API yet, we'd need to add it
    // For now, just reload the queue
    await loadQueue()
  }

  const rejectPost = async (postId: number) => {
    // Note: This endpoint doesn't exist in the API yet
    await loadQueue()
  }

  if (loading) return <div className="text-center mt-8">Loading...</div>
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Moderation Queue</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Posts to Review ({queue.posts.length})</h2>
        {queue.posts.length === 0 ? (
          <p className="text-gray-500">No posts need review.</p>
        ) : (
          queue.posts.map(post => (
            <div key={post.id} className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <div className="mb-3">
                <p className="font-semibold">User {post.author_id}</p>
                <p>{post.body}</p>
                <p className="text-sm text-gray-500 mt-1">
                  AI Risk: {post.ai_risk_score.toFixed(2)}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => approvePost(post.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => rejectPost(post.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Reports ({queue.reports.length})</h2>
        {queue.reports.length === 0 ? (
          <p className="text-gray-500">No pending reports.</p>
        ) : (
          <p className="text-gray-500">Reports functionality coming soon...</p>
        )}
      </div>
    </div>
  )
}