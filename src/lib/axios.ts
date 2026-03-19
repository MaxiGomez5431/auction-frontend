// src/lib/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  proxy: false,
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Verificar si es realmente un problema de autenticación o de permisos
      const errorMessage = error.response?.data?.message || '';
      
      // Si el mensaje indica que es por autenticación (token expirado/inválido)
      if (
        errorMessage.includes('token') || 
        errorMessage.includes('sesión') ||
        errorMessage.includes('autenticación') ||
        errorMessage.includes('unauthorized') ||
        errorMessage.includes('expired')
      ) {
        // Solo aquí limpiamos sesión y redirigimos
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login?session=expired';
          }
        }
      } else {
        // Para otros 401 (como "no puedes eliminar tu usuario")
        // Mostramos el error pero NO redirigimos
        console.log('Error de autorización:', errorMessage);
      }
    }
    
    // Para errores 403 (Forbidden) - tampoco redirigir
    if (error.response?.status === 403) {
      console.log('Acceso prohibido:', error.response?.data?.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;