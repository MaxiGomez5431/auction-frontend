// contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/axios';
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '../types/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isVerified: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        console.log('📦 Cargando desde localStorage:', { 
          token: token ? '✅ presente' : '❌ ausente', 
          storedUser: storedUser ? '✅ presente' : '❌ ausente' 
        });

        if (token && storedUser) {
          // ¡IMPORTANTE! Parsear el usuario
          const parsedUser = JSON.parse(storedUser);
          console.log('👤 Usuario parseado:', parsedUser);
          
          // Verificar que el usuario tiene la estructura correcta
          if (parsedUser && typeof parsedUser === 'object') {
            setUser(parsedUser);
          } else {
            console.error('Usuario almacenado no es un objeto válido');
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
        // Si hay error, limpiar localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  }, [router]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      
      const { data } = await api.post<AuthResponse>('/auth/login', credentials);

      if (!data.user || !data.access_token) {
        throw new Error('Respuesta inválida del servidor');
      }

      // Guardar token
      localStorage.setItem('token', data.access_token);
      
      // Guardar usuario como string JSON
      const userString = JSON.stringify(data.user);
      localStorage.setItem('user', userString);
      
      // Verificar que se guardó correctamente
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      }
      
      // Redirigir
      router.push('/');
      
      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
      const responseMessage = error && typeof error === 'object' && 'response' in error 
        ? (error.response as { data?: { message?: string } })?.data?.message 
        : undefined;
      return { 
        success: false, 
        error: responseMessage || errorMessage 
      };
    }
  }, [router]);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      await api.post<User>('/auth/register', credentials);
      // Auto login después de registrar
      return login({ 
        email: credentials.email, 
        password: credentials.password 
      });
    } catch (error: unknown) {
      const errorMessage = 'Error al registrarse';
      const responseMessage = error && typeof error === 'object' && 'response' in error 
        ? (error.response as { data?: { message?: string } })?.data?.message 
        : undefined;
      return { 
        success: false, 
        error: responseMessage || errorMessage 
      };
    }
  }, [login]);

  // Memoizar el valor del contexto para evitar re-renders innecesarios
  const value = useMemo(() => ({
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    isVerified: user?.isVerified || false,
  }), [user, loading, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}