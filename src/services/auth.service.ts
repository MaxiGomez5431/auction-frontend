import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '@/types/types';
import api from '../lib/axios';



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