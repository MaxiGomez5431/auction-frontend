// src/app/admin/layout.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Shield, Users, Image as ImageIcon, Gavel } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
    }
  }, [loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header del admin */}
      <header className="bg-linear-to-r from-purple-700 to-indigo-800 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6" />
              <span className="text-xl font-bold">Panel de Administración</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">
                {user?.email} ({user?.username})
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <nav className="bg-white rounded-lg shadow-lg p-4 space-y-2">
              <Link
                href="/admin"
                className="flex items-center space-x-2 p-3 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-700 transition-colors"
              >
                <Shield className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/admin/artwork"
                className="flex items-center space-x-2 p-3 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-700 transition-colors"
              >
                <ImageIcon className="w-5 h-5" />
                <span>Obras</span>
              </Link>
              <Link
                href="/admin/user"
                className="flex items-center space-x-2 p-3 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-700 transition-colors"
              >
                <Users className="w-5 h-5" />
                <span>Usuarios</span>
              </Link>
              <Link
                href="/admin/auction"
                className="flex items-center space-x-2 p-3 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-700 transition-colors"
              >
                <Gavel className="w-5 h-5" />
                <span>Subastas</span>
              </Link>
            </nav>
          </div>

          {/* Contenido principal */}
          <div className="md:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}