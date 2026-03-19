import { DollarSign } from 'lucide-react';

interface PriceCardProps {
  label: string;
  value: number;
  variant?: 'default' | 'current';
}

export function PriceCard({ label, value, variant = 'default' }: PriceCardProps) {
  const bgColor = variant === 'current' ? 'bg-blue-50' : 'bg-gray-50';
  const textColor = variant === 'current' ? 'text-blue-600' : 'text-gray-900';
  const fontWeight = variant === 'current' ? 'font-bold' : 'font-semibold';

  return (
    <div className={`${bgColor} p-2 sm:p-3 rounded-lg`}>
      <p className="text-gray-500 text-xs sm:text-sm mb-1">{label}</p>
      <p className={`${fontWeight} ${textColor} flex items-center text-sm sm:text-base truncate`}>
        <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-gray-400" />
        {value.toLocaleString('es-ES')}
      </p>
    </div>
  );
}