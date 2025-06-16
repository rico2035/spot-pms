import { format, isToday, isYesterday } from 'date-fns';
import { ParkingSquareIcon, CarIcon, ClockIcon, LogOutIcon, LogInIcon } from 'lucide-react';

interface ActivityItem {
  id: string;
  licensePlate: string;
  action: 'check-in' | 'check-out';
  timestamp: string;
  location: string;
}

interface ActivityCardProps {
  activities: ActivityItem[];
  title?: string;
}

export default function ActivityCard({ activities, title = 'Recent Activity' }: ActivityCardProps) {
  const formatTimeString = (timeString: string) => {
    const date = new Date(timeString);
    if (isToday(date)) {
      return `Today, ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  };

  return (
    <div className="card h-full overflow-hidden">
      <div className="card-header">
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
        <ul className="divide-y divide-neutral-200">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <li key={activity.id} className="px-6 py-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg shrink-0 ${
                    activity.action === 'check-in' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {activity.action === 'check-in' ? <LogInIcon size={18} /> : <LogOutIcon size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="font-medium truncate">
                        {activity.licensePlate}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {formatTimeString(activity.timestamp)}
                      </p>
                    </div>
                    <p className="text-sm text-neutral-500 mt-1 flex items-center">
                      <span className="flex items-center mr-3">
                        <CarIcon className="mr-1" size={14} />
                        {activity.action === 'check-in' ? 'Checked in' : 'Checked out'}
                      </span>
                      <span className="flex items-center">
                        <ParkingSquareIcon className="mr-1" size={14} />
                        {activity.location}
                      </span>
                    </p>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-6 py-8 text-center text-neutral-500">
              <ClockIcon className="mx-auto h-12 w-12 text-neutral-300" />
              <p className="mt-2">No recent activity</p>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}