import api from '../lib/axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  username?: string;
}

export interface User {
  id: number;
  email: string;
  username: string | null;
  isVerified: boolean;
  isAdmin: boolean;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  async register(credentials: RegisterCredentials) {
    const { data } = await api.post<User>('/auth/register', credentials);
    return data;
  },

  async verifyToken() {
    const { data } = await api.get('/auth/verify-token');
    return data;
  },
};