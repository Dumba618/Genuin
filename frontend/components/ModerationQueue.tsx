'use client'
import { useEffect, useState } from 'react'

export function ModerationQueue() {
  const [queue, setQueue] = useState({ posts: [], reports: [] })
  useEffect(() => {
    fetch('/api/moderation/queue').then(res => res.json()).then(setQueue)
  }, [])
  return (
    <div>
      <h2>Posts to Review</h2>
      {queue.posts.map(post => <div key={post.id}>{post.body}</div>)}
    </div>
  )
}