'use client';

import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';

export function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
     <header className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/70 backdrop-blur-sm shadow-md' 
          : 'bg-white shadow-md'
      }`}>
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Título de la app */}
          <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
            Subastas de Arte
          </Link>

          {/* Menú de navegación - visible en desktop */}
          <div className="hidden md:flex items-center space-x-4">

            {/* Contenido condicional según autenticación */}
            {!isAuthenticated ? (
              // Usuario NO autenticado
              <div className="flex items-center space-x-2">
                <Link href="/" className="text-gray-700 hover:text-blue-600">
                  Subastas
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Registrarse
                </Link>
              </div>
            ) : (
              // Usuario SÍ autenticado
              <div className="flex items-center space-x-4">
                {/* Mensaje de bienvenida */}
                <span className="text-gray-700">
                   Bienvenido, <span className="font-semibold">{user?.username || user?.email}</span>
                </span>

                {/* Botón de Admin (solo visible para admins) */}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200"
                  >
                    Panel Admin
                  </Link>
                )}
                
                {/* Botón de logout */}
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>

          {/* Botón de menú hamburguesa para móvil */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menú móvil desplegable */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Subastas
              </Link>

              {!isAuthenticated ? (
                <>
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-700 px-2 py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Registrarse
                  </Link>
                </>
              ) : (
                <>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="text-purple-600 hover:text-purple-700 px-2 py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Panel Admin
                    </Link>
                  )}
                  <span className="text-gray-700 px-2 py-1">
                    Bienvenido, {user?.username || user?.email}
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 text-left"
                  >
                    Cerrar Sesión
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}