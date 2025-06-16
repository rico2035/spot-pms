import { createContext, useContext, useState, ReactNode } from 'react';
import { useLayout } from './LayoutContext';
import { useBuildings } from './BuildingsContext';

// Types
export interface Car {
  id: string;
  licensePlate: string;
  buildingId: string;
  spotId: string | null; // null if checked out
  checkInTime: string;
  checkOutTime: string | null; // null if still checked in
}

interface ParkingRecord {
  id: string;
  carId: string;
  licensePlate: string;
  buildingId: string;
  spotId: string;
  checkInTime: string;
  checkOutTime: string | null;
  fee?: number;
}

interface CarManagementContextType {
  cars: Car[];
  parkingRecords: ParkingRecord[];
  checkedInCars: Car[];
  findCarByLicensePlate: (licensePlate: string) => Car | null;
  checkInCar: (licensePlate: string, buildingId: string) => Promise<Car | null>;
  checkOutCar: (licensePlate: string) => Promise<ParkingRecord | null>;
  getCarsParkingHistory: (licensePlate: string) => ParkingRecord[];
  getTodaysCheckIns: (buildingId: string) => ParkingRecord[];
  getRecentActivity: (buildingId: string, limit?: number) => ParkingRecord[];
  isLoading: boolean;
}

// Create the context
const CarManagementContext = createContext<CarManagementContextType | undefined>(undefined);

// Generate sample data
const generateSampleData = () => {
  const currentDate = new Date();
  
  const cars: Car[] = [
    {
      id: 'car1',
      licensePlate: 'ABC1234',
      buildingId: '1',
      spotId: 'spot_b1_1',
      checkInTime: new Date(currentDate.getTime() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      checkOutTime: null
    },
    {
      id: 'car2',
      licensePlate: 'XYZ5678',
      buildingId: '1',
      spotId: 'spot_b2_2',
      checkInTime: new Date(currentDate.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      checkOutTime: null
    },
    {
      id: 'car3',
      licensePlate: 'DEF9012',
      buildingId: '1',
      spotId: null,
      checkInTime: new Date(currentDate.getTime() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
      checkOutTime: new Date(currentDate.getTime() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
    }
  ];
  
  const parkingRecords: ParkingRecord[] = [
    {
      id: 'record1',
      carId: 'car1',
      licensePlate: 'ABC1234',
      buildingId: '1',
      spotId: 'spot_b1_1',
      checkInTime: new Date(currentDate.getTime() - 3 * 60 * 60 * 1000).toISOString(),
      checkOutTime: null
    },
    {
      id: 'record2',
      carId: 'car2',
      licensePlate: 'XYZ5678',
      buildingId: '1',
      spotId: 'spot_b2_2',
      checkInTime: new Date(currentDate.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      checkOutTime: null
    },
    {
      id: 'record3',
      carId: 'car3',
      licensePlate: 'DEF9012',
      buildingId: '1',
      spotId: 'spot_b1_3',
      checkInTime: new Date(currentDate.getTime() - 8 * 60 * 60 * 1000).toISOString(),
      checkOutTime: new Date(currentDate.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      fee: 15
    },
    {
      id: 'record4',
      carId: 'car4',
      licensePlate: 'GHI3456',
      buildingId: '1',
      spotId: 'spot_b3_1',
      checkInTime: new Date(currentDate.getTime() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
      checkOutTime: new Date(currentDate.getTime() - 44 * 60 * 60 * 1000).toISOString(), // 4 hours later
      fee: 8
    },
    {
      id: 'record5',
      carId: 'car5',
      licensePlate: 'JKL7890',
      buildingId: '2',
      spotId: 'spot_b6_1',
      checkInTime: new Date(currentDate.getTime() - 26 * 60 * 60 * 1000).toISOString(), // yesterday
      checkOutTime: new Date(currentDate.getTime() - 20 * 60 * 60 * 1000).toISOString(), // 6 hours later
      fee: 12
    }
  ];
  
  return { cars, parkingRecords };
};

const { cars: sampleCars, parkingRecords: sampleRecords } = generateSampleData();

// Provider component
export function CarManagementProvider({ children }: { children: ReactNode }) {
  const [cars, setCars] = useState<Car[]>(sampleCars);
  const [parkingRecords, setParkingRecords] = useState<ParkingRecord[]>(sampleRecords);
  const [isLoading, setIsLoading] = useState(false);
  const { spots, updateSpotStatus } = useLayout();
  const { updateBuilding, selectedBuilding } = useBuildings();

  const checkedInCars = cars.filter(car => car.spotId !== null && car.checkOutTime === null);
  
  const findCarByLicensePlate = (licensePlate: string): Car | null => {
    return cars.find(car => car.licensePlate.toUpperCase() === licensePlate.toUpperCase()) || null;
  };

  const getAvailableSpot = (buildingId: string) => {
    // Get all available spots in the building
    const availableSpots = spots.filter(spot => 
      spot.status === 'available' && 
      spot.bayId.startsWith('b') && // This is just for our sample data
      // Find bay that belongs to floor that belongs to selected building
      (() => {
        const bay = bays.find(b => b.id === spot.bayId);
        if (!bay) return false;
        
        const floor = floors.find(f => f.id === bay.floorId);
        return floor?.buildingId === buildingId;
      })()
    );
    
    return availableSpots.length > 0 ? availableSpots[0] : null;
  };

  const checkInCar = async (licensePlate: string, buildingId: string): Promise<Car | null> => {
    setIsLoading(true);
    try {
      // Normalize license plate
      const normalizedLicensePlate = licensePlate.toUpperCase().trim();
      
      // Check if the car is already checked in
      const existingCar = cars.find(car => 
        car.licensePlate === normalizedLicensePlate && 
        car.checkOutTime === null
      );
      
      if (existingCar) {
        throw new Error('Car already checked in');
      }
      
      // Find an available spot
      const spot = getAvailableSpot(buildingId);
      if (!spot) {
        throw new Error('No available spots');
      }
      
      // Create new car entry
      const newCar: Car = {
        id: `car${Date.now()}`,
        licensePlate: normalizedLicensePlate,
        buildingId,
        spotId: spot.id,
        checkInTime: new Date().toISOString(),
        checkOutTime: null
      };
      
      // Create parking record
      const newRecord: ParkingRecord = {
        id: `record${Date.now()}`,
        carId: newCar.id,
        licensePlate: normalizedLicensePlate,
        buildingId,
        spotId: spot.id,
        checkInTime: newCar.checkInTime,
        checkOutTime: null
      };
      
      // Update spot status
      updateSpotStatus(spot.id, 'occupied');
      
      // Update building occupied spots count
      if (selectedBuilding && selectedBuilding.id === buildingId) {
        updateBuilding(buildingId, {
          occupiedSpots: selectedBuilding.occupiedSpots + 1
        });
      }
      
      // Save changes
      setCars([...cars, newCar]);
      setParkingRecords([...parkingRecords, newRecord]);
      
      return newCar;
    } catch (error) {
      console.error('Error checking in car:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const checkOutCar = async (licensePlate: string): Promise<ParkingRecord | null> => {
    setIsLoading(true);
    try {
      // Normalize license plate
      const normalizedLicensePlate = licensePlate.toUpperCase().trim();
      
      // Find the car
      const carIndex = cars.findIndex(car => 
        car.licensePlate === normalizedLicensePlate && 
        car.checkOutTime === null
      );
      
      if (carIndex === -1) {
        throw new Error('Car not found or already checked out');
      }
      
      const car = cars[carIndex];
      const checkOutTime = new Date().toISOString();
      
      // Update car
      const updatedCar: Car = {
        ...car,
        checkOutTime,
        spotId: null
      };
      
      // Find and update the record
      const recordIndex = parkingRecords.findIndex(record => 
        record.carId === car.id && 
        record.checkOutTime === null
      );
      
      if (recordIndex === -1) {
        throw new Error('Parking record not found');
      }
      
      // Calculate fee (simplified)
      const checkInTime = new Date(car.checkInTime);
      const hours = Math.max(1, Math.ceil((new Date().getTime() - checkInTime.getTime()) / (1000 * 60 * 60)));
      const fee = hours * 5; // $5 per hour
      
      const record = parkingRecords[recordIndex];
      const updatedRecord: ParkingRecord = {
        ...record,
        checkOutTime,
        fee
      };
      
      // Update spot status if spot exists
      if (car.spotId) {
        updateSpotStatus(car.spotId, 'available');
      }
      
      // Update building occupied spots count
      if (selectedBuilding && selectedBuilding.id === car.buildingId) {
        updateBuilding(car.buildingId, {
          occupiedSpots: Math.max(0, selectedBuilding.occupiedSpots - 1)
        });
      }
      
      // Save changes
      const updatedCars = [...cars];
      updatedCars[carIndex] = updatedCar;
      setCars(updatedCars);
      
      const updatedRecords = [...parkingRecords];
      updatedRecords[recordIndex] = updatedRecord;
      setParkingRecords(updatedRecords);
      
      return updatedRecord;
    } catch (error) {
      console.error('Error checking out car:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getCarsParkingHistory = (licensePlate: string): ParkingRecord[] => {
    const normalizedLicensePlate = licensePlate.toUpperCase().trim();
    return parkingRecords.filter(record => 
      record.licensePlate === normalizedLicensePlate
    ).sort((a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime());
  };

  const getTodaysCheckIns = (buildingId: string): ParkingRecord[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return parkingRecords.filter(record => 
      record.buildingId === buildingId &&
      new Date(record.checkInTime) >= today
    ).sort((a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime());
  };

  const getRecentActivity = (buildingId: string, limit: number = 10): ParkingRecord[] => {
    return parkingRecords
      .filter(record => record.buildingId === buildingId)
      .sort((a, b) => {
        // Sort by most recent activity (check-in or check-out)
        const aTime = a.checkOutTime ? new Date(a.checkOutTime).getTime() : new Date(a.checkInTime).getTime();
        const bTime = b.checkOutTime ? new Date(b.checkOutTime).getTime() : new Date(b.checkInTime).getTime();
        return bTime - aTime;
      })
      .slice(0, limit);
  };

  // Access the layout context to get bays and floors
  const { bays, floors } = useLayout();

  const value = {
    cars,
    parkingRecords,
    checkedInCars,
    findCarByLicensePlate,
    checkInCar,
    checkOutCar,
    getCarsParkingHistory,
    getTodaysCheckIns,
    getRecentActivity,
    isLoading
  };

  return (
    <CarManagementContext.Provider value={value}>
      {children}
    </CarManagementContext.Provider>
  );
}

export function useCarManagement() {
  const context = useContext(CarManagementContext);
  if (context === undefined) {
    throw new Error('useCarManagement must be used within a CarManagementProvider');
  }
  return context;
}