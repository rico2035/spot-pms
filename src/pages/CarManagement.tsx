import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { 
  CarIcon, SearchIcon, LogOutIcon, LogInIcon, 
  ArrowRightIcon, ClockIcon
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { useBuildings } from '@/contexts/BuildingsContext';
import { useCarManagement, Car } from '@/contexts/CarManagementContext';
import { formatDistanceToNow, format } from 'date-fns';

type TabType = 'check-in' | 'check-out' | 'search';

interface CheckInFormValues {
  licensePlate: string;
  buildingId: string;
}

interface CheckOutFormValues {
  licensePlate: string;
}

interface SearchFormValues {
  licensePlate: string;
}

export default function CarManagement() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('check-in');
  const { buildings, selectedBuilding } = useBuildings();
  const { 
    checkInCar, 
    checkOutCar, 
    findCarByLicensePlate, 
    getCarsParkingHistory,
    isLoading 
  } = useCarManagement();
  
  // Search results
  const [searchResults, setSearchResults] = useState<Car | null>(null);
  const [parkingHistory, setParkingHistory] = useState<any[]>([]);
  
  // Checkout results
  const [checkoutResult, setCheckoutResult] = useState<{
    licensePlate: string;
    checkInTime: string;
    checkOutTime: string;
    duration: string;
    fee: number;
  } | null>(null);
  
  // Forms setup
  const { register: checkInRegister, handleSubmit: handleCheckInSubmit, formState: { errors: checkInErrors }, reset: resetCheckInForm } = 
    useForm<CheckInFormValues>();
    
  const { register: checkOutRegister, handleSubmit: handleCheckOutSubmit, formState: { errors: checkOutErrors }, reset: resetCheckOutForm } = 
    useForm<CheckOutFormValues>();
    
  const { register: searchRegister, handleSubmit: handleSearchSubmit, formState: { errors: searchErrors }, reset: resetSearchForm } = 
    useForm<SearchFormValues>();

  // Set active tab based on URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'check-out') {
      setActiveTab('check-out');
    } else if (tab === 'search') {
      setActiveTab('search');
    }
  }, [location.search]);

  // Handle tab change
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    navigate(`/car-management${tab !== 'check-in' ? `?tab=${tab}` : ''}`);
    
    // Reset forms and results
    resetCheckInForm();
    resetCheckOutForm();
    resetSearchForm();
    setSearchResults(null);
    setParkingHistory([]);
    setCheckoutResult(null);
  };

  // Handle check-in form submission
  const onCheckInSubmit = async (data: CheckInFormValues) => {
    const result = await checkInCar(data.licensePlate, data.buildingId);
    if (result) {
      resetCheckInForm();
      toast.success(`Car ${data.licensePlate} successfully checked in`);
    } else {
      toast.error('Failed to check in car. It may already be checked in or no spots are available.');
    }
  };

  // Handle check-out form submission
  const onCheckOutSubmit = async (data: CheckOutFormValues) => {
    const result = await checkOutCar(data.licensePlate);
    if (result) {
      resetCheckOutForm();
      
      const checkInDate = new Date(result.checkInTime);
      const checkOutDate = new Date(result.checkOutTime!);
      const duration = formatDistanceToNow(checkInDate, { addSuffix: true });
      
      setCheckoutResult({
        licensePlate: result.licensePlate,
        checkInTime: format(checkInDate, 'PPp'),
        checkOutTime: format(checkOutDate, 'PPp'),
        duration,
        fee: result.fee || 0
      });
      
      toast.success(`Car ${data.licensePlate} successfully checked out`);
    } else {
      toast.error('Failed to check out car. Car may not be checked in or already checked out.');
    }
  };

  // Handle search form submission
  const onSearchSubmit = async (data: SearchFormValues) => {
    const car = findCarByLicensePlate(data.licensePlate);
    setSearchResults(car);
    
    const history = getCarsParkingHistory(data.licensePlate);
    setParkingHistory(history);
    
    if (!car && history.length === 0) {
      toast.info(`No records found for license plate ${data.licensePlate}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Car Management</h2>
        <p className="text-neutral-500">Check-in, check-out, and search for vehicles</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => handleTabChange('check-in')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'check-in'
                ? 'border-primary text-primary'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            }`}
          >
            <LogInIcon className="h-5 w-5 mr-2" />
            Check-In
          </button>
          <button
            onClick={() => handleTabChange('check-out')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'check-out'
                ? 'border-primary text-primary'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            }`}
          >
            <LogOutIcon className="h-5 w-5 mr-2" />
            Check-Out
          </button>
          <button
            onClick={() => handleTabChange('search')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'search'
                ? 'border-primary text-primary'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            }`}
          >
            <SearchIcon className="h-5 w-5 mr-2" />
            Search
          </button>
        </nav>
      </div>

      {/* Check-In Tab */}
      {activeTab === 'check-in' && (
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium">Check-In a Car</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleCheckInSubmit(onCheckInSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="license-plate" className="block text-sm font-medium text-neutral-700">
                    License Plate
                  </label>
                  <input
                    type="text"
                    id="license-plate"
                    placeholder="e.g. ABC123"
                    className={`mt-1 input ${checkInErrors.licensePlate ? 'border-red-500 ring-red-500' : ''}`}
                    {...checkInRegister('licensePlate', { 
                      required: 'License plate is required',
                      pattern: {
                        value: /^[A-Za-z0-9 -]{2,10}$/,
                        message: 'Please enter a valid license plate'
                      }
                    })}
                  />
                  {checkInErrors.licensePlate && (
                    <p className="mt-1 text-sm text-red-600">{checkInErrors.licensePlate.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="building-id" className="block text-sm font-medium text-neutral-700">
                    Building
                  </label>
                  <select
                    id="building-id"
                    className={`mt-1 select ${checkInErrors.buildingId ? 'border-red-500 ring-red-500' : ''}`}
                    defaultValue={selectedBuilding?.id || ''}
                    {...checkInRegister('buildingId', { 
                      required: 'Building is required'
                    })}
                  >
                    <option value="" disabled>Select a building</option>
                    {buildings.map((building) => (
                      <option key={building.id} value={building.id}>
                        {building.name}
                      </option>
                    ))}
                  </select>
                  {checkInErrors.buildingId && (
                    <p className="mt-1 text-sm text-red-600">{checkInErrors.buildingId.message}</p>
                  )}
                </div>
                <div className="pt-4">
                  <Button 
                    variant="primary" 
                    fullWidth 
                    type="submit" 
                    isLoading={isLoading}
                    icon={<LogInIcon className="h-5 w-5" />}
                  >
                    Assign Spot
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Check-Out Tab */}
      {activeTab === 'check-out' && (
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium">Check-Out a Car</h3>
            </div>
            <div className="card-body">
              {!checkoutResult ? (
                <form onSubmit={handleCheckOutSubmit(onCheckOutSubmit)} className="space-y-4">
                  <div>
                    <label htmlFor="checkout-license-plate" className="block text-sm font-medium text-neutral-700">
                      License Plate
                    </label>
                    <input
                      type="text"
                      id="checkout-license-plate"
                      placeholder="e.g. ABC123"
                      className={`mt-1 input ${checkOutErrors.licensePlate ? 'border-red-500 ring-red-500' : ''}`}
                      {...checkOutRegister('licensePlate', { 
                        required: 'License plate is required',
                        pattern: {
                          value: /^[A-Za-z0-9 -]{2,10}$/,
                          message: 'Please enter a valid license plate'
                        }
                      })}
                    />
                    {checkOutErrors.licensePlate && (
                      <p className="mt-1 text-sm text-red-600">{checkOutErrors.licensePlate.message}</p>
                    )}
                  </div>
                  <div className="pt-4">
                    <Button 
                      variant="primary" 
                      fullWidth 
                      type="submit" 
                      isLoading={isLoading}
                      icon={<LogOutIcon className="h-5 w-5" />}
                    >
                      Free Spot
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="rounded-md bg-green-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CarIcon className="h-5 w-5 text-green-600" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">
                          Checkout Successful
                        </h3>
                        <div className="mt-2 text-sm text-green-700">
                          <p>Car with license plate <strong>{checkoutResult.licensePlate}</strong> has been checked out successfully.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="text-lg font-medium mb-4">Parking Details</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Check-In Time:</span>
                        <span className="font-medium">{checkoutResult.checkInTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Check-Out Time:</span>
                        <span className="font-medium">{checkoutResult.checkOutTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Duration:</span>
                        <span className="font-medium">{checkoutResult.duration}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 mt-2">
                        <span className="text-neutral-800 font-medium">Parking Fee:</span>
                        <span className="text-primary font-bold">${checkoutResult.fee.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={() => {
                        setCheckoutResult(null);
                        resetCheckOutForm();
                      }}
                    >
                      Check Out Another Car
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search Tab */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium">Search for a Car</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSearchSubmit(onSearchSubmit)} className="flex flex-wrap gap-4 items-end">
                <div className="flex-1">
                  <label htmlFor="search-license-plate" className="block text-sm font-medium text-neutral-700">
                    License Plate
                  </label>
                  <input
                    type="text"
                    id="search-license-plate"
                    placeholder="e.g. ABC123"
                    className={`mt-1 input ${searchErrors.licensePlate ? 'border-red-500 ring-red-500' : ''}`}
                    {...searchRegister('licensePlate', { 
                      required: 'License plate is required',
                      pattern: {
                        value: /^[A-Za-z0-9 -]{2,10}$/,
                        message: 'Please enter a valid license plate'
                      }
                    })}
                  />
                  {searchErrors.licensePlate && (
                    <p className="mt-1 text-sm text-red-600">{searchErrors.licensePlate.message}</p>
                  )}
                </div>
                <div>
                  <Button 
                    variant="primary"  
                    type="submit" 
                    isLoading={isLoading}
                    icon={<SearchIcon className="h-5 w-5" />}
                  >
                    Search
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {searchResults && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium">Current Status</h3>
              </div>
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-neutral-100 p-3">
                      <CarIcon className="h-6 w-6 text-neutral-700" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium">{searchResults.licensePlate}</h4>
                      <p className="text-sm text-neutral-500">
                        {searchResults.checkOutTime 
                          ? 'Currently checked out' 
                          : `Checked in at ${format(new Date(searchResults.checkInTime), 'PPp')}`}
                      </p>
                    </div>
                  </div>
                  {!searchResults.checkOutTime && (
                    <div>
                      <Button
                        variant="primary"
                        onClick={() => {
                          handleTabChange('check-out');
                          setTimeout(() => {
                            const form = document.getElementById('checkout-license-plate') as HTMLInputElement;
                            if (form) {
                              form.value = searchResults.licensePlate;
                            }
                          }, 100);
                        }}
                      >
                        Check Out This Car
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {parkingHistory.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium">Parking History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Check-In</th>
                      <th>Check-Out</th>
                      <th>Building</th>
                      <th>Spot</th>
                      <th>Duration</th>
                      {parkingHistory.some(record => record.fee) && <th>Fee</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {parkingHistory.map((record) => {
                      const checkInDate = new Date(record.checkInTime);
                      const checkOutDate = record.checkOutTime ? new Date(record.checkOutTime) : null;
                      const duration = checkOutDate
                        ? formatDistanceToNow(checkInDate, { addSuffix: false })
                        : 'Still parked';
                        
                      // Find building name
                      const building = buildings.find(b => b.id === record.buildingId);
                      
                      return (
                        <tr key={record.id}>
                          <td>{format(checkInDate, 'PPp')}</td>
                          <td>{checkOutDate ? format(checkOutDate, 'PPp') : '—'}</td>
                          <td>{building?.name || record.buildingId}</td>
                          <td>{record.spotId.split('_').pop()}</td>
                          <td className="whitespace-nowrap">
                            {duration}
                          </td>
                          {parkingHistory.some(r => r.fee) && (
                            <td>{record.fee ? `$${record.fee.toFixed(2)}` : '—'}</td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}