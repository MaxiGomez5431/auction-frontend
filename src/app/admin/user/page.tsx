// src/app/admin/users/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { User } from '../../../types/types';
import { Users, Mail, Shield, Calendar, CheckCircle, XCircle, Search, User as UserIcon } from 'lucide-react';
import { DeleteButton } from '@/components/ui/DeleteButton';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'verified' | 'unverified'>('all');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    // Filtrar usuarios cuando cambia el término de búsqueda o el filtro
    let filtered = [...users];

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por verificación
    if (filter === 'verified') {
      filtered = filtered.filter(user => user.isVerified);
    } else if (filter === 'unverified') {
      filtered = filtered.filter(user => !user.isVerified);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, filter]);

  const loadUsers = async () => {
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    await adminService.deleteUser(id);
    setUsers(users.filter(user => user.id !== id));
  };

  const toggleVerification = async (userId: number, currentStatus: boolean) => {
    setUpdating(userId);

    try {
      const response = await adminService.updateUserVerification(userId, {
        isVerified: !currentStatus,
      });

      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, ...response.user }
          : user
      ));

    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setUpdating(null);
    }
  };

  const getVerificationStats = () => {
    const verified = users.filter(u => u.isVerified).length;
    const unverified = users.filter(u => !u.isVerified).length;
    return { verified, unverified, total: users.length };
  };

  const stats = getVerificationStats();

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
        <p className="text-gray-500 text-sm mt-1">
          Gestiona la verificación de usuarios
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-xs sm:text-sm">Total usuarios</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-700">{stats.total}</p>
            </div>
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-xs sm:text-sm">Verificados</p>
              <p className="text-xl sm:text-2xl font-bold text-green-700">{stats.verified}</p>
            </div>
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-xs sm:text-sm">Pendientes</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-700">{stats.unverified}</p>
            </div>
            <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por email o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 sm:flex-none px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('verified')}
            className={`flex-1 sm:flex-none px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'verified'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Verificados
          </button>
          <button
            onClick={() => setFilter('unverified')}
            className={`flex-1 sm:flex-none px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'unverified'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pendientes
          </button>
        </div>
      </div>

      {/* Grid de usuarios */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <UserIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg mb-2">No se encontraron usuarios</p>
          <p className="text-gray-400 text-sm">
            {searchTerm ? 'Prueba con otra búsqueda' : 'No hay usuarios para mostrar'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`border rounded-lg overflow-hidden transition-all hover:shadow-md ${
                user.isVerified ? 'border-green-200' : 'border-yellow-200'
              }`}
            >
              {/* Header de la card con color según estado */}
              <div className={`px-4 py-3 ${
                user.isVerified ? 'bg-green-50' : 'bg-yellow-50'
              } border-b flex items-center justify-between`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    user.isVerified ? 'bg-green-200' : 'bg-yellow-200'
                  }`}>
                    <span className={`text-lg font-bold ${
                      user.isVerified ? 'text-green-700' : 'text-yellow-700'
                    }`}>
                      {user.username?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {user.username || 'Sin nombre'}
                    </h3>
                    <p className="text-xs text-gray-500">ID: {user.id}</p>
                  </div>
                </div>

                {user.isAdmin && (
                  <span className="flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin
                  </span>
                )}

                <DeleteButton
                  id={user.id}
                  type="user"
                  onDelete={handleDeleteUser}
                />
              </div>

              {/* Cuerpo de la card */}
              <div className="p-4 space-y-3">
                {/* Email */}
                <div className="flex items-center text-sm">
                  <Mail className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                  <span className="text-gray-600 truncate">{user.email}</span>
                </div>

                {/* Fecha de registro */}
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                  <span className="text-gray-600">
                    Registrado: {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Estado de verificación */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center">
                    {user.isVerified ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-green-600">Verificado</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-yellow-500 mr-2" />
                        <span className="text-sm text-yellow-600">Pendiente</span>
                      </>
                    )}
                  </div>

                  {/* Botón de acción */}
                  <button
                    onClick={() => toggleVerification(user.id, user.isVerified)}
                    disabled={updating === user.id}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      user.isVerified
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    } disabled:opacity-50`}
                  >
                    {updating === user.id ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent mr-2"></div>
                        Actualizando...
                      </span>
                    ) : user.isVerified ? (
                      'Desverificar'
                    ) : (
                      'Verificar'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resumen */}
      <div className="mt-6 pt-4 border-t text-sm text-gray-500">
        <p>
          Mostrando {filteredUsers.length} de {users.length} usuarios
          {filter !== 'all' && (
            <button
              onClick={() => setFilter('all')}
              className="ml-2 text-purple-600 hover:text-purple-700 font-medium"
            >
              (Ver todos)
            </button>
          )}
        </p>
      </div>
    </div>
  );
}