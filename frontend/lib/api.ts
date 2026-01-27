const API_BASE_URL = 'http://localhost:8000';

import { Post, ModerationQueueData, User } from './types';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return { error: data.detail || 'An error occurred' };
      }

      return { data };
    } catch (error) {
      return { error: 'Network error' };
    }
  }

  // Auth endpoints
  async register(userData: {
    email: string;
    username: string;
    password: string;
    name: string;
    bio?: string;
    headline?: string;
    avatar_url?: string;
  }) {
    return this.request<{ access_token: string; refresh_token: string; token_type: string }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(userData),
      }
    );
  }

  async login(username: string, password: string) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    return this.request<{ access_token: string; refresh_token: string; token_type: string }>(
      '/auth/login',
      {
        method: 'POST',
        body: formData,
        headers: {}, // Let browser set content-type for FormData
      }
    );
  }

  async refreshToken(refreshToken: string) {
    return this.request<{ access_token: string; refresh_token: string; token_type: string }>(
      '/auth/refresh',
      {
        method: 'POST',
        body: JSON.stringify({ token: refreshToken }),
      }
    );
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  async getCurrentUser() {
    return this.request<User>('/auth/me');
  }

  // Posts endpoints
  async createPost(postData: {
    body: string;
    media_urls?: string[];
    human_declared: boolean;
  }) {
    return this.request('/posts/', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async getFeed(cursor?: string) {
    const params = cursor ? `?cursor=${cursor}` : '';
    return this.request<Post[]>(`/posts/feed${params}`);
  }

  async getPost(postId: number) {
    return this.request(`/posts/${postId}`);
  }

  async deletePost(postId: number) {
    return this.request(`/posts/${postId}`, { method: 'DELETE' });
  }

  // Users endpoints
  async getUser(username: string) {
    return this.request<User>(`/users/${username}`);
  }

  async updateUser(userData: Partial<{
    name: string;
    bio: string;
    headline: string;
    avatar_url: string;
  }>) {
    return this.request('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  }

  async getUserPosts(username: string) {
    return this.request<Post[]>(`/users/${username}/posts`);
  }

  async followUser(username: string) {
    return this.request(`/users/${username}/follow`, { method: 'POST' });
  }

  async unfollowUser(username: string) {
    return this.request(`/users/${username}/follow`, { method: 'DELETE' });
  }

  // Moderation endpoints (if needed)
  async getModerationQueue() {
    return this.request<ModerationQueueData>('/moderation/queue');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);