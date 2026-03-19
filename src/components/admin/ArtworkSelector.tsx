// src/components/admin/ArtworkSelector.tsx
import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { Artwork } from '../../types/types';
import Link from 'next/link';
import { FieldError } from 'react-hook-form';

interface ArtworkSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: FieldError | undefined;
  disabled?: boolean;
}

export function ArtworkSelector({ value, onChange, error, disabled }: ArtworkSelectorProps) {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArtworks();
  }, []);

  const loadArtworks = async () => {
    try {
      const data = await adminService.getArtworks();
      setArtworks(data);
    } catch (error) {
      console.error('Error loading artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <label htmlFor="artworkId" className="block text-sm font-medium text-gray-700 mb-2">
        Obra a subastar <span className="text-red-500">*</span>
      </label>
      <select
        id="artworkId"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || loading}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <option value="">Selecciona una obra</option>
        {artworks.map((artwork) => (
          <option key={artwork.id} value={artwork.id}>
            {artwork.title}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error.message}</p>
      )}
      {loading && (
        <p className="text-gray-400 text-xs mt-1">Cargando obras...</p>
      )}
      {!loading && artworks.length === 0 && (
        <p className="text-yellow-600 text-xs mt-1">
          No hay obras disponibles. Primero debes{' '}
          <Link href="/admin/artwork/new" className="text-purple-600 hover:underline">
            crear una obra
          </Link>
        </p>
      )}
    </div>
  );
}