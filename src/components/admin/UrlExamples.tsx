// src/components/admin/UrlExamples.tsx
import { Upload } from 'lucide-react';

interface UrlExamplesProps {
  examples: string[];
  title?: string;
}

export function UrlExamples({ examples, title = 'URLs de ejemplo para pruebas:' }: UrlExamplesProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p className="text-sm font-medium text-blue-800 mb-2 flex items-center">
        <Upload className="w-4 h-4 mr-2" />
        {title}
      </p>
      <ul className="text-xs text-blue-600 space-y-1 list-disc list-inside">
        {examples.map((example, index) => (
          <li key={index}>{example}</li>
        ))}
      </ul>
    </div>
  );
}