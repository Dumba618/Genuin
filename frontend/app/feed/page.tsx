'use client'
import { useEffect, useState } from 'react'
import { PostCard } from '@/components/PostCard'
import { Post } from '@/lib/types'
import { apiClient } from '@/lib/api'
import { authService } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [postContent, setPostContent] = useState('')
  const [humanDeclared, setHumanDeclared] = useState(false)
  const [posting, setPosting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/auth/login')
      return
    }

    loadPosts()
  }, [])

  const loadPosts = async () => {
    setLoading(true)
    const response = await apiClient.getFeed()
    setLoading(false)

    if (response.data) {
      setPosts(response.data)
    } else {
      setError(response.error || 'Failed to load posts')
    }
  }

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!postContent.trim() || !humanDeclared) return

    setPosting(true)
    const response = await apiClient.createPost({
      body: postContent,
      human_declared: humanDeclared,
    })
    setPosting(false)

    if (response.data) {
      setPostContent('')
      setHumanDeclared(false)
      loadPosts() // Reload posts
    } else {
      setError(response.error || 'Failed to create post')
    }
  }

  if (loading) return <div className="text-center mt-8">Loading...</div>
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Feed</h1>

      {/* Create Post Form */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <form onSubmit={handleCreatePost}>
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-3 border rounded-lg resize-none"
            rows={3}
            required
          />
          <div className="flex items-center justify-between mt-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={humanDeclared}
                onChange={(e) => setHumanDeclared(e.target.checked)}
                className="mr-2"
                required
              />
              <span className="text-sm">I confirm this is written by a human</span>
            </label>
            <button
              type="submit"
              disabled={posting || !postContent.trim() || !humanDeclared}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {posting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>

      {/* Posts Feed */}
      {posts.length === 0 ? (
        <p className="text-gray-500 text-center">No posts yet. Be the first to post!</p>
      ) : (
        posts.map(post => <PostCard key={post.id} post={post} />)
      )}
    </div>
  )
}