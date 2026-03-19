'use client';

import { Trash2 } from 'lucide-react';
import { useState } from 'react';

export type ResourceType = 'artwork' | 'auction' | 'user';

interface DeleteButtonProps {
  id: number;
  type: ResourceType;
  onDelete: (id: number) => Promise<void>;
  className?: string;
  showConfirmation?: boolean;
  confirmationMessage?: string;
}

const resourceNames = {
  artwork: 'obra',
  auction: 'subasta',
  user: 'usuario'
};

export function DeleteButton({ 
  id, 
  type, 
  onDelete, 
  className = '',
}: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {

    setIsDeleting(true);
    try {
      await onDelete(id);
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title={`Eliminar ${resourceNames[type]}`}
    >
      <Trash2 className={`w-4 h-4 ${isDeleting ? 'animate-pulse' : ''}`} />
    </button>
  );
}