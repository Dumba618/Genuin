'use client'
import { useEffect, useState } from 'react'
import { PostCard } from '@/components/PostCard'

export default function Feed() {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    fetch('/api/posts/feed').then(res => res.json()).then(setPosts)
  }, [])
  return (
    <div>
      {posts.map(post => <PostCard key={post.id} post={post} />)}
    </div>
  )
}