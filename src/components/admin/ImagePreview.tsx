// src/components/admin/ImagePreview.tsx
import Image from 'next/image';
import { X } from 'lucide-react';
import { useState } from 'react';

interface ImagePreviewProps {
  src: string;
  onClear: () => void;
  onError?: () => void;
}

export function ImagePreview({ src, onClear, onError }: ImagePreviewProps) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) return null;

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Vista previa
      </label>
      <div className="relative w-full max-w-md mx-auto bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
        <div className="relative aspect-video">
          <Image
            src={src}
            alt="Preview"
            fill
            className="object-contain"
            onError={() => {
              setImageError(true);
              onError?.();
            }}
          />
        </div>
        <button
          type="button"
          onClick={onClear}
          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}