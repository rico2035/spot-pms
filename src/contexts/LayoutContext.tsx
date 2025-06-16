import { createContext, useContext, useState, ReactNode } from 'react';
import { useBuildings } from './BuildingsContext';

// Types
export interface Floor {
  id: string;
  buildingId: string;
  floorNumber: number;
  description?: string;
}

export interface Bay {
  id: string;
  floorId: string;
  bayNumber: number;
  description?: string;
}

export interface Spot {
  id: string;
  bayId: string;
  spotNumber: number;
  type: 'standard' | 'compact' | 'oversized';
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  features: string[]; // e.g., ['ev_charging', 'handicap', 'premium']
  lastUpdated: string;
}

interface LayoutContextType {
  floors: Floor[];
  bays: Bay[];
  spots: Spot[];
  selectedFloorId: string | null;
  selectedBayId: string | null;
  setSelectedFloorId: (id: string | null) => void;
  setSelectedBayId: (id: string | null) => void;
  addFloor: (floor: Omit<Floor, 'id'>) => void;
  updateFloor: (id: string, updates: Partial<Floor>) => void;
  deleteFloor: (id: string) => void;
  addBay: (bay: Omit<Bay, 'id'>) => void;
  updateBay: (id: string, updates: Partial<Bay>) => void;
  deleteBay: (id: string) => void;
  addSpot: (spot: Omit<Spot, 'id' | 'lastUpdated'>) => void;
  updateSpot: (id: string, updates: Partial<Spot>) => void;
  deleteSpot: (id: string) => void;
  updateSpotStatus: (id: string, status: Spot['status']) => void;
  getFloorsByBuilding: (buildingId: string) => Floor[];
  getBaysByFloor: (floorId: string) => Bay[];
  getSpotsByBay: (bayId: string) => Spot[];
  isLoading: boolean;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

// Sample data
const generateSampleData = () => {
  const floors: Floor[] = [
    { id: 'f1', buildingId: '1', floorNumber: 1, description: 'Ground Floor' },
    { id: 'f2', buildingId: '1', floorNumber: 2 },
    { id: 'f3', buildingId: '1', floorNumber: 3 },
    { id: 'f4', buildingId: '2', floorNumber: 1, description: 'Entry Level' },
    { id: 'f5', buildingId: '2', floorNumber: 2 },
    { id: 'f6', buildingId: '3', floorNumber: 1 },
  ];

  const bays: Bay[] = [
    { id: 'b1', floorId: 'f1', bayNumber: 1, description: 'Section A' },
    { id: 'b2', floorId: 'f1', bayNumber: 2, description: 'Section B' },
    { id: 'b3', floorId: 'f2', bayNumber: 1 },
    { id: 'b4', floorId: 'f2', bayNumber: 2 },
    { id: 'b5', floorId: 'f3', bayNumber: 1 },
    { id: 'b6', floorId: 'f4', bayNumber: 1 },
    { id: 'b7', floorId: 'f5', bayNumber: 1 },
    { id: 'b8', floorId: 'f6', bayNumber: 1 },
  ];

  const spots: Spot[] = [];
  const statuses: Spot['status'][] = ['available', 'occupied', 'reserved', 'maintenance'];
  const types: Spot['type'][] = ['standard', 'compact', 'oversized'];
  const featuresList = [
    [],
    ['ev_charging'],
    ['handicap'],
    ['premium'],
    ['ev_charging', 'premium'],
    ['handicap', 'premium']
  ];

  bays.forEach(bay => {
    const spotCount = Math.floor(Math.random() * 15) + 10; // 10-25 spots per bay
    
    for (let i = 1; i <= spotCount; i++) {
      spots.push({
        id: `spot_${bay.id}_${i}`,
        bayId: bay.id,
        spotNumber: i,
        type: types[Math.floor(Math.random() * types.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        features: featuresList[Math.floor(Math.random() * featuresList.length)],
        lastUpdated: new Date().toISOString()
      });
    }
  });

  return { floors, bays, spots };
};

const { floors: sampleFloors, bays: sampleBays, spots: sampleSpots } = generateSampleData();

export function LayoutProvider({ children }: { children: ReactNode }) {
  const { selectedBuilding } = useBuildings();
  
  const [floors, setFloors] = useState<Floor[]>(sampleFloors);
  const [bays, setBays] = useState<Bay[]>(sampleBays);
  const [spots, setSpots] = useState<Spot[]>(sampleSpots);
  const [selectedFloorId, setSelectedFloorId] = useState<string | null>(null);
  const [selectedBayId, setSelectedBayId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize selected floor and bay based on selected building
  useState(() => {
    if (selectedBuilding) {
      const buildingFloors = floors.filter(f => f.buildingId === selectedBuilding.id);
      if (buildingFloors.length > 0) {
        setSelectedFloorId(buildingFloors[0].id);
        
        const floorBays = bays.filter(b => b.floorId === buildingFloors[0].id);
        if (floorBays.length > 0) {
          setSelectedBayId(floorBays[0].id);
        } else {
          setSelectedBayId(null);
        }
      } else {
        setSelectedFloorId(null);
        setSelectedBayId(null);
      }
    }
  });

  // Floors CRUD
  const addFloor = (floor: Omit<Floor, 'id'>) => {
    setIsLoading(true);
    try {
      const newFloor = { ...floor, id: `f${Date.now()}` };
      setFloors([...floors, newFloor]);
      return newFloor;
    } finally {
      setIsLoading(false);
    }
  };

  const updateFloor = (id: string, updates: Partial<Floor>) => {
    setIsLoading(true);
    try {
      const updatedFloors = floors.map(floor => 
        floor.id === id ? { ...floor, ...updates } : floor
      );
      setFloors(updatedFloors);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFloor = (id: string) => {
    setIsLoading(true);
    try {
      // Find bays belonging to this floor
      const floorBays = bays.filter(bay => bay.floorId === id);
      const bayIds = floorBays.map(bay => bay.id);
      
      // Delete all spots in these bays
      setSpots(spots.filter(spot => !bayIds.includes(spot.bayId)));
      
      // Delete all bays in this floor
      setBays(bays.filter(bay => bay.floorId !== id));
      
      // Delete the floor
      setFloors(floors.filter(floor => floor.id !== id));
      
      // Update selection if needed
      if (selectedFloorId === id) {
        const buildingId = floors.find(f => f.id === id)?.buildingId;
        const remainingFloors = floors.filter(f => f.buildingId === buildingId && f.id !== id);
        
        if (remainingFloors.length > 0) {
          setSelectedFloorId(remainingFloors[0].id);
          
          const floorBays = bays.filter(b => b.floorId === remainingFloors[0].id);
          if (floorBays.length > 0) {
            setSelectedBayId(floorBays[0].id);
          } else {
            setSelectedBayId(null);
          }
        } else {
          setSelectedFloorId(null);
          setSelectedBayId(null);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Bays CRUD
  const addBay = (bay: Omit<Bay, 'id'>) => {
    setIsLoading(true);
    try {
      const newBay = { ...bay, id: `b${Date.now()}` };
      setBays([...bays, newBay]);
      return newBay;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBay = (id: string, updates: Partial<Bay>) => {
    setIsLoading(true);
    try {
      const updatedBays = bays.map(bay => 
        bay.id === id ? { ...bay, ...updates } : bay
      );
      setBays(updatedBays);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBay = (id: string) => {
    setIsLoading(true);
    try {
      // Delete all spots in this bay
      setSpots(spots.filter(spot => spot.bayId !== id));
      
      // Delete the bay
      setBays(bays.filter(bay => bay.id !== id));
      
      // Update selection if needed
      if (selectedBayId === id) {
        const floorId = bays.find(b => b.id === id)?.floorId;
        const remainingBays = bays.filter(b => b.floorId === floorId && b.id !== id);
        
        if (remainingBays.length > 0) {
          setSelectedBayId(remainingBays[0].id);
        } else {
          setSelectedBayId(null);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Spots CRUD
  const addSpot = (spot: Omit<Spot, 'id' | 'lastUpdated'>) => {
    setIsLoading(true);
    try {
      const newSpot = { 
        ...spot, 
        id: `spot_${Date.now()}`,
        lastUpdated: new Date().toISOString()
      };
      setSpots([...spots, newSpot]);
      return newSpot;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSpot = (id: string, updates: Partial<Spot>) => {
    setIsLoading(true);
    try {
      const updatedSpots = spots.map(spot => 
        spot.id === id ? { 
          ...spot, 
          ...updates,
          lastUpdated: new Date().toISOString() 
        } : spot
      );
      setSpots(updatedSpots);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSpot = (id: string) => {
    setIsLoading(true);
    try {
      setSpots(spots.filter(spot => spot.id !== id));
    } finally {
      setIsLoading(false);
    }
  };

  const updateSpotStatus = (id: string, status: Spot['status']) => {
    updateSpot(id, { status });
  };

  // Helper functions
  const getFloorsByBuilding = (buildingId: string) => {
    return floors.filter(floor => floor.buildingId === buildingId)
      .sort((a, b) => a.floorNumber - b.floorNumber);
  };

  const getBaysByFloor = (floorId: string) => {
    return bays.filter(bay => bay.floorId === floorId)
      .sort((a, b) => a.bayNumber - b.bayNumber);
  };

  const getSpotsByBay = (bayId: string) => {
    return spots.filter(spot => spot.bayId === bayId)
      .sort((a, b) => a.spotNumber - b.spotNumber);
  };

  const value = {
    floors,
    bays,
    spots,
    selectedFloorId,
    selectedBayId,
    setSelectedFloorId,
    setSelectedBayId,
    addFloor,
    updateFloor,
    deleteFloor,
    addBay,
    updateBay,
    deleteBay,
    addSpot,
    updateSpot,
    deleteSpot,
    updateSpotStatus,
    getFloorsByBuilding,
    getBaysByFloor,
    getSpotsByBay,
    isLoading,
  };

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}