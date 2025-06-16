import { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface Building {
  id: string;
  name: string;
  address: string;
  description?: string;
  floorCount: number;
  totalSpots: number;
  occupiedSpots: number;
}

interface BuildingsContextType {
  buildings: Building[];
  selectedBuilding: Building | null;
  setSelectedBuilding: (building: Building) => void;
  addBuilding: (building: Omit<Building, 'id' | 'floorCount' | 'totalSpots' | 'occupiedSpots'>) => void;
  updateBuilding: (id: string, updates: Partial<Building>) => void;
  deleteBuilding: (id: string) => void;
  isLoading: boolean;
}

const BuildingsContext = createContext<BuildingsContextType | undefined>(undefined);

// Sample data
const sampleBuildings: Building[] = [
  {
    id: '1',
    name: 'Main Garage',
    address: '123 Main Street, New York, NY 10001',
    description: 'Main parking facility with 5 floors',
    floorCount: 5,
    totalSpots: 250,
    occupiedSpots: 168
  },
  {
    id: '2',
    name: 'West End Facility',
    address: '456 West Avenue, New York, NY 10002',
    description: 'Secondary parking garage near downtown',
    floorCount: 3,
    totalSpots: 120,
    occupiedSpots: 76
  },
  {
    id: '3',
    name: 'East Side Parking',
    address: '789 East Boulevard, New York, NY 10003',
    floorCount: 4,
    totalSpots: 180,
    occupiedSpots: 95
  }
];

export function BuildingsProvider({ children }: { children: ReactNode }) {
  const [buildings, setBuildings] = useState<Building[]>(sampleBuildings);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(sampleBuildings[0]);
  const [isLoading, setIsLoading] = useState(false);

  const addBuilding = (building: Omit<Building, 'id' | 'floorCount' | 'totalSpots' | 'occupiedSpots'>) => {
    setIsLoading(true);
    try {
      const newBuilding: Building = {
        ...building,
        id: Date.now().toString(),
        floorCount: 0,
        totalSpots: 0,
        occupiedSpots: 0
      };
      
      setBuildings([...buildings, newBuilding]);
      if (!selectedBuilding) {
        setSelectedBuilding(newBuilding);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateBuilding = (id: string, updates: Partial<Building>) => {
    setIsLoading(true);
    try {
      const updatedBuildings = buildings.map(building => 
        building.id === id ? { ...building, ...updates } : building
      );
      setBuildings(updatedBuildings);
      
      // Update selected building if it's the one being updated
      if (selectedBuilding && selectedBuilding.id === id) {
        setSelectedBuilding({ ...selectedBuilding, ...updates });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBuilding = (id: string) => {
    setIsLoading(true);
    try {
      const filteredBuildings = buildings.filter(building => building.id !== id);
      setBuildings(filteredBuildings);
      
      // If the deleted building is the selected one, select the first available one
      if (selectedBuilding && selectedBuilding.id === id) {
        setSelectedBuilding(filteredBuildings.length > 0 ? filteredBuildings[0] : null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    buildings,
    selectedBuilding,
    setSelectedBuilding,
    addBuilding,
    updateBuilding,
    deleteBuilding,
    isLoading
  };

  return (
    <BuildingsContext.Provider value={value}>
      {children}
    </BuildingsContext.Provider>
  );
}

export function useBuildings() {
  const context = useContext(BuildingsContext);
  if (context === undefined) {
    throw new Error('useBuildings must be used within a BuildingsProvider');
  }
  return context;
}