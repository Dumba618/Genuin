import { apiClient } from './api';
import { User } from './types';

export class AuthService {
  private static instance: AuthService;
  private user: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(username: string, password: string) {
    const response = await apiClient.login(username, password);
    if (response.data) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      await this.loadUser();
      return { success: true };
    }
    return { success: false, error: response.error };
  }

  async register(userData: {
    email: string;
    username: string;
    password: string;
    name: string;
    bio?: string;
    headline?: string;
    avatar_url?: string;
  }) {
    const response = await apiClient.register(userData);
    if (response.data) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      await this.loadUser();
      return { success: true };
    }
    return { success: false, error: response.error };
  }

  async logout() {
    await apiClient.logout();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.user = null;
    this.notifyListeners();
  }

  async loadUser() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      this.user = null;
      this.notifyListeners();
      return;
    }

    const response = await apiClient.getCurrentUser();
    if (response.data) {
      this.user = response.data;
    } else {
      // Token might be expired, try refresh
      await this.refreshToken();
    }
    this.notifyListeners();
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return false;

    const response = await apiClient.refreshToken(refreshToken);
    if (response.data) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      await this.loadUser();
      return true;
    }
    return false;
  }

  getUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.user;
  }

  subscribe(listener: (user: User | null) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.user));
  }
}

export const authService = AuthService.getInstance();