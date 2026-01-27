import { Post } from '@/lib/types';

export function PostCard({ post }: { post: Post }) {
  return (
    <div className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
      <div className="flex items-center mb-2">
        <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
        <div>
          <p className="font-semibold">User {post.author_id}</p>
          <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
        </div>
      </div>
      <p className="mb-2">{post.body}</p>
      {post.media_urls && post.media_urls.length > 0 && (
        <div className="mb-2">
          {post.media_urls.map((url, index) => (
            <img key={index} src={url} alt="Media" className="max-w-full h-auto rounded" />
          ))}
        </div>
      )}
      <div className="text-sm text-gray-500">
        AI Risk Score: {post.ai_risk_score.toFixed(2)}
        {post.human_declared && <span className="ml-2 text-green-600">✓ Human Declared</span>}
      </div>
    </div>
  );
}