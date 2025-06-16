import { ReactNode } from 'react';

interface SummaryCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  color: string;
  trend?: {
    value: number;
    label: string;
  };
}

export default function SummaryCard({ title, value, icon, color, trend }: SummaryCardProps) {
  return (
    <div className="card h-full">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
          <div className={`p-2 rounded-lg ${color}`}>
            {icon}
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold">{value}</p>
            {trend && (
              <span className={`ml-2 text-sm font-medium ${trend.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend.value >= 0 ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
          {trend && (
            <p className="text-sm text-neutral-500 mt-1">{trend.label}</p>
          )}
        </div>
      </div>
    </div>
  );
}