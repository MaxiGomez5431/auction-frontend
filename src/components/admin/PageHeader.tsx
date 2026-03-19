// src/components/admin/PageHeader.tsx
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description: string;
  backLink: string;
  backText?: string;
}

export function PageHeader({ title, description, backLink, backText = 'Volver' }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <Link
        href={backLink}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {backText}
      </Link>
      
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-500 mt-1">{description}</p>
    </div>
  );
}