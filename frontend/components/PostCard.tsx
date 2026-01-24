export function PostCard({ post }: { post: any }) {
  return (
    <div>
      <p>{post.body}</p>
      <p>Risk: {post.ai_risk_score}</p>
    </div>
  )
}