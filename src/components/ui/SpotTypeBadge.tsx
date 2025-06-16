import { Spot } from '@/contexts/LayoutContext';

interface SpotTypeBadgeProps {
  type: Spot['type'];
  size?: 'sm' | 'md' | 'lg';
}

export default function SpotTypeBadge({ type, size = 'md' }: SpotTypeBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  }[size];

  const typeClasses = {
    standard: 'bg-neutral-100 text-neutral-800 border border-neutral-300',
    compact: 'bg-purple-100 text-purple-800 border border-purple-300',
    oversized: 'bg-indigo-100 text-indigo-800 border border-indigo-300',
  }[type];

  return (
    <span className={`inline-flex items-center rounded-full font-medium whitespace-nowrap ${sizeClasses} ${typeClasses}`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}