// src/app/admin/artworks/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { Artwork } from '../../../types/types';
import Link from 'next/link';
import { Plus, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { DeleteButton } from '../../../components/ui/DeleteButton';
import { ErrorMessage } from '../../../components/ui/ErrorMessage';

export default function ArtworksPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // ← Un solo estado para errores

  useEffect(() => {
    loadArtworks();
  }, []);

  const loadArtworks = async () => {
    try {
      const data = await adminService.getArtworks();
      setArtworks(data);
    } catch (err) {
      setError('Error al cargar las obras');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArtwork = async (id: number) => {
    try {
      await adminService.deleteArtwork(id);
      setArtworks(artworks.filter(artwork => artwork.id !== id));
      setError(''); // Limpiar error si había alguno
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error.response?.data?.message || 'Error al eliminar la obra';
      setError(errorMessage); // ← Usar el mismo estado
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header con título y botón */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Obras de Arte</h1>
          <p className="text-gray-500 text-sm mt-1">
            Gestiona el catálogo de obras disponibles
          </p>
        </div>
        <Link
          href="/admin/artwork/new"
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Obra
        </Link>
      </div>

      {/* Único mensaje de error */}
      <ErrorMessage message={error} />

      {/* Grid de obras */}
      {artworks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <ImageIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg mb-2">No hay obras registradas</p>
          <p className="text-gray-400 text-sm mb-4">
            Comienza creando la primera obra de arte
          </p>
          <Link
            href="/admin/artwork/new"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear Primera Obra
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((artwork) => (
            <div
              key={artwork.id}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Imagen de la obra */}
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                {artwork.imageUrl ? (
                  <>
                    <Image 
                      src={artwork.imageUrl}
                      alt=""
                      fill
                      className="object-cover blur-lg"
                    />
                    <Image 
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      width={300}
                      height={300}
                      className="object-contain mx-auto h-full relative z-10"
                    />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
              </div>

              {/* Información */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 justify-between flex items-center">
                  {artwork.title}
                  <DeleteButton
                    id={artwork.id}
                    type="artwork"
                    onDelete={handleDeleteArtwork}
                  />
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {artwork.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}