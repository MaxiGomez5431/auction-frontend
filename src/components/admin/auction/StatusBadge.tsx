import { Clock, Calendar, CheckCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'ACTIVE' | 'SCHEDULED' | 'FINISHED';
}

const statusConfig = {
  ACTIVE: {
    icon: Clock,
    text: 'Activa',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
  },
  SCHEDULED: {
    icon: Calendar,
    text: 'Programada',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
  },
  FINISHED: {
    icon: CheckCircle,
    text: 'Finalizada',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2 py-1 ${config.bgColor} ${config.textColor} rounded-full text-xs`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.text}
    </span>
  );
}