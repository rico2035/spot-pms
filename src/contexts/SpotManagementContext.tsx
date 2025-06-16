import { createContext, useContext, useState, ReactNode } from 'react';
import { useLayout, Spot } from './LayoutContext';
import { useBuildings } from './BuildingsContext';

interface SpotFilters {
  statusFilter: 'all' | 'available' | 'occupied' | 'reserved' | 'maintenance';
  typeFilter: 'all' | 'standard' | 'compact' | 'oversized';
  featureFilter: string | null;
  searchQuery: string;
}

interface SpotManagementContextType {
  filters: SpotFilters;
  setStatusFilter: (status: SpotFilters['statusFilter']) => void;
  setTypeFilter: (type: SpotFilters['typeFilter']) => void;
  setFeatureFilter: (feature: SpotFilters['featureFilter']) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
  getFilteredSpots: (buildingId?: string) => Spot[];
  getSpotsByStatus: (buildingId: string) => Record<Spot['status'], number>;
  toggleSpotStatus: (spotId: string) => Promise<boolean>;
}

// Create context
const SpotManagementContext = createContext<SpotManagementContextType | undefined>(undefined);

// Default filter values
const defaultFilters: SpotFilters = {
  statusFilter: 'all',
  typeFilter: 'all',
  featureFilter: null,
  searchQuery: ''
};

export function SpotManagementProvider({ children }: { children: ReactNode }) {
  const { spots, bays, floors, updateSpotStatus } = useLayout();
  const { buildings } = useBuildings();
  const [filters, setFilters] = useState<SpotFilters>(defaultFilters);

  // Filter setters
  const setStatusFilter = (status: SpotFilters['statusFilter']) => {
    setFilters(prev => ({ ...prev, statusFilter: status }));
  };

  const setTypeFilter = (type: SpotFilters['typeFilter']) => {
    setFilters(prev => ({ ...prev, typeFilter: type }));
  };

  const setFeatureFilter = (feature: SpotFilters['featureFilter']) => {
    setFilters(prev => ({ ...prev, featureFilter: feature }));
  };

  const setSearchQuery = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // Get filtered spots
  const getFilteredSpots = (buildingId?: string): Spot[] => {
    let filteredSpots = [...spots];
    
    // Filter by building if specified
    if (buildingId) {
      // Get all floor IDs for this building
      const buildingFloorIds = floors
        .filter(floor => floor.buildingId === buildingId)
        .map(floor => floor.id);
      
      // Get all bay IDs for these floors
      const floorBayIds = bays
        .filter(bay => buildingFloorIds.includes(bay.floorId))
        .map(bay => bay.id);
      
      // Filter spots by these bay IDs
      filteredSpots = filteredSpots.filter(spot => floorBayIds.includes(spot.bayId));
    }
    
    // Apply status filter
    if (filters.statusFilter !== 'all') {
      filteredSpots = filteredSpots.filter(spot => spot.status === filters.statusFilter);
    }
    
    // Apply type filter
    if (filters.typeFilter !== 'all') {
      filteredSpots = filteredSpots.filter(spot => spot.type === filters.typeFilter);
    }
    
    // Apply feature filter
    if (filters.featureFilter) {
      filteredSpots = filteredSpots.filter(spot => 
        spot.features.includes(filters.featureFilter!)
      );
    }
    
    // Apply search query
    if (filters.searchQuery.trim() !== '') {
      const query = filters.searchQuery.trim().toLowerCase();
      filteredSpots = filteredSpots.filter(spot => 
        spot.spotNumber.toString().includes(query) ||
        spot.id.toLowerCase().includes(query)
      );
    }
    
    return filteredSpots;
  };

  // Get spot counts by status for a building
  const getSpotsByStatus = (buildingId: string): Record<Spot['status'], number> => {
    const buildingSpots = getFilteredSpots(buildingId);
    
    return {
      available: buildingSpots.filter(spot => spot.status === 'available').length,
      occupied: buildingSpots.filter(spot => spot.status === 'occupied').length,
      reserved: buildingSpots.filter(spot => spot.status === 'reserved').length,
      maintenance: buildingSpots.filter(spot => spot.status === 'maintenance').length
    };
  };

  // Toggle spot status
  const toggleSpotStatus = async (spotId: string): Promise<boolean> => {
    try {
      const spot = spots.find(s => s.id === spotId);
      if (!spot) return false;
      
      let newStatus: Spot['status'];
      
      // Simple status toggle cycle: available -> occupied -> reserved -> maintenance -> available
      switch (spot.status) {
        case 'available':
          newStatus = 'occupied';
          break;
        case 'occupied':
          newStatus = 'reserved';
          break;
        case 'reserved':
          newStatus = 'maintenance';
          break;
        case 'maintenance':
          newStatus = 'available';
          break;
        default:
          newStatus = 'available';
      }
      
      updateSpotStatus(spotId, newStatus);
      return true;
    } catch (error) {
      console.error('Error toggling spot status:', error);
      return false;
    }
  };

  const value = {
    filters,
    setStatusFilter,
    setTypeFilter,
    setFeatureFilter,
    setSearchQuery,
    resetFilters,
    getFilteredSpots,
    getSpotsByStatus,
    toggleSpotStatus
  };

  return (
    <SpotManagementContext.Provider value={value}>
      {children}
    </SpotManagementContext.Provider>
  );
}

export function useSpotManagement() {
  const context = useContext(SpotManagementContext);
  if (context === undefined) {
    throw new Error('useSpotManagement must be used within a SpotManagementProvider');
  }
  return context;
}