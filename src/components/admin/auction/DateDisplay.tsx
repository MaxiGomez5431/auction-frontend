// src/components/admin/auctions/DateDisplay.tsx
import { Calendar } from 'lucide-react';

interface DateDisplayProps {
  label: string;
  date: string;
}

export function DateDisplay({ label, date }: DateDisplayProps) {
  const formattedDate = new Date(date).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="flex items-center bg-gray-50 p-2 rounded-md w-full lg:w-auto">
      <Calendar className="w-3 h-3 lg:w-4 lg:h-4 mr-2 text-gray-400 shrink-0" />
      <span className="truncate text-xs lg:text-sm">
        {label}: {formattedDate}
      </span>
    </div>
  );
}