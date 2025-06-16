interface FeatureBadgeProps {
  feature: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function FeatureBadge({ feature, size = 'md' }: FeatureBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  }[size];

  // Format the feature name for display
  const formatFeatureName = (feature: string) => {
    return feature
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const featureClasses = {
    ev_charging: 'bg-teal-100 text-teal-800 border border-teal-300',
    handicap: 'bg-blue-100 text-blue-800 border border-blue-300',
    premium: 'bg-amber-100 text-amber-800 border border-amber-300',
    covered: 'bg-purple-100 text-purple-800 border border-purple-300',
  }[feature] || 'bg-neutral-100 text-neutral-800 border border-neutral-300';

  return (
    <span className={`inline-flex items-center rounded-full font-medium whitespace-nowrap ${sizeClasses} ${featureClasses}`}>
      {formatFeatureName(feature)}
    </span>
  );
}