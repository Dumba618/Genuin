// TypeScript types

export interface User {
  id: number;
  email: string;
  username: string;
  name: string;
  bio?: string;
  headline?: string;
  avatar_url?: string;
  role: 'user' | 'moderator' | 'admin';
  status: 'active' | 'inactive' | 'banned';
  created_at: string;
}

export interface Post {
  id: number;
  author_id: number;
  body: string;
  media_urls?: string[];
  human_declared: boolean;
  ai_risk_score: number;
  status: 'published' | 'needs_review' | 'rejected';
  created_at: string;
}

export interface Comment {
  id: number;
  post_id: number;
  author_id: number;
  body: string;
  created_at: string;
}

export interface Report {
  id: number;
  reporter_id: number;
  target_type: string;
  target_id: number;
  reason: string;
  details?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
}

export interface ModerationAction {
  id: number;
  moderator_id: number;
  action_type: 'approve' | 'reject' | 'ban' | 'warn';
  target_type: string;
  target_id: number;
  notes?: string;
  created_at: string;
}

export interface ModerationQueueData {
  posts: Post[];
  reports: Report[];
}