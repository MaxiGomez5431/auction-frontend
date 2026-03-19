// src/components/admin/auctions/EmptyState.tsx
import { Gavel, Plus } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export function EmptyState({ title, description, buttonText, buttonLink }: EmptyStateProps) {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      <Gavel className="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <p className="text-gray-500 text-lg mb-2">{title}</p>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      <Link
        href={buttonLink}
        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        {buttonText}
      </Link>
    </div>
  );
}