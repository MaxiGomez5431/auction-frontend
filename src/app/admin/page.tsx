// src/app/admin/page.tsx
'use client';

import { Users, Image as ImageIcon, Gavel, Link, LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionButton 
            href="/admin/artwork/new" 
            icon={ImageIcon} 
            label="Nueva Obra" 
          />
          <QuickActionButton 
            href="/admin/auction/new" 
            icon={Gavel} 
            label="Nueva Subasta" 
          />
          <QuickActionButton 
            href="/admin/user" 
            icon={Users} 
            label="Verificar Usuarios" 
          />
        </div>
      </div>
    </div>
  );
}


interface QuickActionButtonProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

export function QuickActionButton({ href, icon: Icon, label }: QuickActionButtonProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(href)}
      className="block p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors cursor-pointer"
    >
      <Icon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
      <p className="text-sm font-medium text-gray-600 text-center">{label}</p>
    </div>
  );
}