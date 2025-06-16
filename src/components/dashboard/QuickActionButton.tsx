import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface QuickActionButtonProps {
  icon: ReactNode;
  label: string;
  to: string;
  description?: string;
}

export default function QuickActionButton({ 
  icon, 
  label, 
  to, 
  description 
}: QuickActionButtonProps) {
  return (
    <Link
      to={to}
      className="flex flex-col h-full card transition-transform hover:-translate-y-1"
    >
      <div className="card-body flex flex-col items-center text-center p-6">
        <div className="rounded-full bg-primary-50 p-4 text-primary-600 mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{label}</h3>
        {description && (
          <p className="text-sm text-neutral-600">{description}</p>
        )}
      </div>
    </Link>
  );
}