import { useEffect, useState } from 'react';
import { useBuildings } from '@/contexts/BuildingsContext';
import { useSpotManagement } from '@/contexts/SpotManagementContext';
import { useCarManagement } from '@/contexts/CarManagementContext';
import SummaryCard from '@/components/dashboard/SummaryCard';
import ActivityCard from '@/components/dashboard/ActivityCard';
import QuickActionButton from '@/components/dashboard/QuickActionButton';
import { CarIcon, ParkingSquareIcon, SearchIcon, Building2Icon } from 'lucide-react';

export default function Dashboard() {
  const { selectedBuilding } = useBuildings();
  const { getSpotsByStatus } = useSpotManagement();
  const { getTodaysCheckIns, getRecentActivity } = useCarManagement();
  
  const [spotStats, setSpotStats] = useState<Record<string, number>>({
    available: 0,
    occupied: 0,
    total: 0
  });
  
  const [checkInsToday, setCheckInsToday] = useState<number>(0);
  
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  
  useEffect(() => {
    if (selectedBuilding) {
      // Get spot statistics
      const statusCounts = getSpotsByStatus(selectedBuilding.id);
      setSpotStats({
        available: statusCounts.available,
        occupied: statusCounts.occupied,
        total: statusCounts.available + statusCounts.occupied + statusCounts.reserved + statusCounts.maintenance
      });
      
      // Get check-ins today
      const todayRecords = getTodaysCheckIns(selectedBuilding.id);
      setCheckInsToday(todayRecords.length);
      
      // Get recent activity
      const activity = getRecentActivity(selectedBuilding.id, 10);
      const formattedActivity = activity.map(record => ({
        id: record.id,
        licensePlate: record.licensePlate,
        action: record.checkOutTime ? 'check-out' : 'check-in',
        timestamp: record.checkOutTime || record.checkInTime,
        location: `Spot ${record.spotId.split('_').pop() || 'Unknown'}`
      }));
      setRecentActivity(formattedActivity);
    }
  }, [selectedBuilding, getSpotsByStatus, getTodaysCheckIns, getRecentActivity]);

  const occupancyRate = spotStats.total > 0 
    ? Math.round((spotStats.occupied / spotStats.total) * 100) 
    : 0;

  if (!selectedBuilding) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Building2Icon size={64} className="text-neutral-300 mb-4" />
        <h2 className="text-xl font-semibold text-neutral-700 mb-2">No Building Selected</h2>
        <p className="text-neutral-500 mb-4">Please select a building to view dashboard data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Parking Spots"
          value={spotStats.total}
          icon={<ParkingSquareIcon className="h-6 w-6 text-blue-600" />}
          color="bg-blue-100"
        />
        
        <SummaryCard
          title="Available Spots"
          value={spotStats.available}
          icon={<ParkingSquareIcon className="h-6 w-6 text-green-600" />}
          color="bg-green-100"
        />
        
        <SummaryCard
          title="Occupied Spots"
          value={spotStats.occupied}
          icon={<ParkingSquareIcon className="h-6 w-6 text-red-600" />}
          color="bg-red-100"
          trend={{
            value: occupancyRate,
            label: 'Current occupancy rate'
          }}
        />
        
        <SummaryCard
          title="Cars Checked-In Today"
          value={checkInsToday}
          icon={<CarIcon className="h-6 w-6 text-primary" />}
          color="bg-primary-100"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityCard activities={recentActivity} />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
          <QuickActionButton
            icon={<CarIcon size={24} />}
            label="Check-In Car"
            to="/car-management"
            description="Register a new car entry"
          />
          
          <QuickActionButton
            icon={<CarIcon size={24} />}
            label="Check-Out Car"
            to="/car-management?tab=check-out"
            description="Process a car exit"
          />
          
          <QuickActionButton
            icon={<SearchIcon size={24} />}
            label="Search Car"
            to="/car-management?tab=search"
            description="Find car by license plate"
          />
        </div>
      </div>
    </div>
  );
}