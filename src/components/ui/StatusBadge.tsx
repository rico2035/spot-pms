import { Spot } from '@/contexts/LayoutContext';

interface StatusBadgeProps {
  status: Spot['status'];
  size?: 'sm' | 'md' | 'lg';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  }[size];

  const statusClasses = {
    available: 'bg-green-100 text-green-800 border border-green-300',
    occupied: 'bg-red-100 text-red-800 border border-red-300',
    reserved: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    maintenance: 'bg-blue-100 text-blue-800 border border-blue-300',
  }[status];

  return (
    <span className={`inline-flex items-center rounded-full font-medium whitespace-nowrap ${sizeClasses} ${statusClasses}`}>
      <span className={`h-1.5 w-1.5 rounded-full mr-1 ${status === 'available' ? 'bg-green-600' : 
                                                        status === 'occupied' ? 'bg-red-600' : 
                                                        status === 'reserved' ? 'bg-yellow-600' : 'bg-blue-600'}`}></span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}