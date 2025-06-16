import { useState } from 'react';
import { useBuildings } from '@/contexts/BuildingsContext';
import { useLayout, Floor, Bay, Spot } from '@/contexts/LayoutContext';
import { useForm } from 'react-hook-form';
import { 
  PlusIcon, PencilIcon, TrashIcon, 
  LayoutIcon, LayoutGridIcon, DoorOpenIcon 
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import StatusBadge from '@/components/ui/StatusBadge';
import SpotTypeBadge from '@/components/ui/SpotTypeBadge';
import FeatureBadge from '@/components/ui/FeatureBadge';
import { toast } from 'react-toastify';

type TabType = 'floors' | 'bays' | 'spots';

type FloorFormValues = {
  floorNumber: number;
  description: string;
};

type BayFormValues = {
  bayNumber: number;
  description: string;
};

type SpotFormValues = {
  spotNumber: number;
  type: 'standard' | 'compact' | 'oversized';
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  features: string[];
};

const availableFeatures = [
  { id: 'ev_charging', name: 'EV Charging' },
  { id: 'handicap', name: 'Handicap Accessible' },
  { id: 'premium', name: 'Premium Spot' },
  { id: 'covered', name: 'Covered' },
];

export default function LayoutManagement() {
  const { selectedBuilding } = useBuildings();
  const { 
    floors, bays, spots, 
    selectedFloorId, selectedBayId, 
    setSelectedFloorId, setSelectedBayId,
    getFloorsByBuilding, getBaysByFloor, getSpotsByBay,
    addFloor, updateFloor, deleteFloor,
    addBay, updateBay, deleteBay,
    addSpot, updateSpot, deleteSpot
  } = useLayout();

  const [activeTab, setActiveTab] = useState<TabType>('floors');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Floor | Bay | Spot | null>(null);

  // Forms setup
  const { register: floorRegister, handleSubmit: handleFloorSubmit, formState: { errors: floorErrors }, reset: resetFloorForm, setValue: setFloorValue } = 
    useForm<FloorFormValues>();

  const { register: bayRegister, handleSubmit: handleBaySubmit, formState: { errors: bayErrors }, reset: resetBayForm, setValue: setBayValue } =
    useForm<BayFormValues>();

  const { register: spotRegister, handleSubmit: handleSpotSubmit, formState: { errors: spotErrors }, reset: resetSpotForm, setValue: setSpotValue, watch: watchSpotForm } =
    useForm<SpotFormValues>();

  // Get data based on selections
  const buildingFloors = selectedBuilding 
    ? getFloorsByBuilding(selectedBuilding.id)
    : [];

  const floorBays = selectedFloorId 
    ? getBaysByFloor(selectedFloorId) 
    : [];

  const baySpots = selectedBayId 
    ? getSpotsByBay(selectedBayId) 
    : [];

  // Form handlers
  const openAddModal = () => {
    resetFloorForm();
    resetBayForm();
    resetSpotForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (item: Floor | Bay | Spot) => {
    setCurrentItem(item);

    if (activeTab === 'floors' && 'floorNumber' in item) {
      setFloorValue('floorNumber', item.floorNumber);
      setFloorValue('description', item.description || '');
    }
    else if (activeTab === 'bays' && 'bayNumber' in item) {
      setBayValue('bayNumber', item.bayNumber);
      setBayValue('description', item.description || '');
    }
    else if (activeTab === 'spots' && 'spotNumber' in item) {
      setSpotValue('spotNumber', item.spotNumber);
      setSpotValue('type', item.type);
      setSpotValue('status', item.status);
      setSpotValue('features', item.features);
    }

    setIsEditModalOpen(true);
  };

  const openDeleteModal = (item: Floor | Bay | Spot) => {
    setCurrentItem(item);
    setIsDeleteModalOpen(true);
  };

  // Floor form handlers
  const onAddFloorSubmit = (data: FloorFormValues) => {
    if (!selectedBuilding) return;
    
    addFloor({
      buildingId: selectedBuilding.id,
      floorNumber: data.floorNumber,
      description: data.description || undefined
    });
    
    setIsAddModalOpen(false);
    resetFloorForm();
    toast.success('Floor added successfully');
  };

  const onEditFloorSubmit = (data: FloorFormValues) => {
    if (!currentItem || !('floorNumber' in currentItem)) return;
    
    updateFloor(currentItem.id, {
      floorNumber: data.floorNumber,
      description: data.description || undefined
    });
    
    setIsEditModalOpen(false);
    resetFloorForm();
    toast.success('Floor updated successfully');
  };

  // Bay form handlers
  const onAddBaySubmit = (data: BayFormValues) => {
    if (!selectedFloorId) return;
    
    addBay({
      floorId: selectedFloorId,
      bayNumber: data.bayNumber,
      description: data.description || undefined
    });
    
    setIsAddModalOpen(false);
    resetBayForm();
    toast.success('Bay added successfully');
  };

  const onEditBaySubmit = (data: BayFormValues) => {
    if (!currentItem || !('bayNumber' in currentItem)) return;
    
    updateBay(currentItem.id, {
      bayNumber: data.bayNumber,
      description: data.description || undefined
    });
    
    setIsEditModalOpen(false);
    resetBayForm();
    toast.success('Bay updated successfully');
  };

  // Spot form handlers
  const onAddSpotSubmit = (data: SpotFormValues) => {
    if (!selectedBayId) return;
    
    addSpot({
      bayId: selectedBayId,
      spotNumber: data.spotNumber,
      type: data.type,
      status: data.status,
      features: data.features || []
    });
    
    setIsAddModalOpen(false);
    resetSpotForm();
    toast.success('Spot added successfully');
  };

  const onEditSpotSubmit = (data: SpotFormValues) => {
    if (!currentItem || !('spotNumber' in currentItem)) return;
    
    updateSpot(currentItem.id, {
      spotNumber: data.spotNumber,
      type: data.type,
      status: data.status,
      features: data.features || []
    });
    
    setIsEditModalOpen(false);
    resetSpotForm();
    toast.success('Spot updated successfully');
  };

  // Delete handler
  const handleDelete = () => {
    if (!currentItem) return;
    
    if (activeTab === 'floors' && 'floorNumber' in currentItem) {
      deleteFloor(currentItem.id);
      toast.success('Floor deleted successfully');
    }
    else if (activeTab === 'bays' && 'bayNumber' in currentItem) {
      deleteBay(currentItem.id);
      toast.success('Bay deleted successfully');
    }
    else if (activeTab === 'spots' && 'spotNumber' in currentItem) {
      deleteSpot(currentItem.id);
      toast.success('Spot deleted successfully');
    }
    
    setIsDeleteModalOpen(false);
  };

  // Helper to get the current form submission handler
  const getSubmitHandler = () => {
    switch (activeTab) {
      case 'floors':
        return isEditModalOpen 
          ? handleFloorSubmit(onEditFloorSubmit)
          : handleFloorSubmit(onAddFloorSubmit);
      case 'bays':
        return isEditModalOpen 
          ? handleBaySubmit(onEditBaySubmit)
          : handleBaySubmit(onAddBaySubmit);
      case 'spots':
        return isEditModalOpen 
          ? handleSpotSubmit(onEditSpotSubmit)
          : handleSpotSubmit(onAddSpotSubmit);
    }
  };

  // Helper to get appropriate modal title
  const getModalTitle = () => {
    const action = isEditModalOpen ? 'Edit' : 'Add';
    const itemType = activeTab === 'floors' ? 'Floor' : activeTab === 'bays' ? 'Bay' : 'Spot';
    return `${action} ${itemType}`;
  };

  // Helper to get appropriate delete confirmation message
  const getDeleteMessage = () => {
    if (!currentItem) return '';
    
    if (activeTab === 'floors' && 'floorNumber' in currentItem) {
      return `Are you sure you want to delete Floor ${currentItem.floorNumber}? This will also delete all bays and spots on this floor.`;
    }
    else if (activeTab === 'bays' && 'bayNumber' in currentItem) {
      return `Are you sure you want to delete Bay ${currentItem.bayNumber}? This will also delete all spots in this bay.`;
    }
    else if (activeTab === 'spots' && 'spotNumber' in currentItem) {
      return `Are you sure you want to delete Spot ${currentItem.spotNumber}?`;
    }
    
    return '';
  };

  if (!selectedBuilding) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <LayoutIcon className="h-12 w-12 text-neutral-300 mb-4" />
        <h2 className="text-xl font-semibold text-neutral-700">No Building Selected</h2>
        <p className="text-neutral-500 mt-2">Please select a building to manage its layout.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Layout Management</h2>
          <p className="text-neutral-500">Manage floors, bays, and parking spots for {selectedBuilding.name}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('floors')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'floors'
                ? 'border-primary text-primary'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            }`}
          >
            <LayoutIcon className="h-5 w-5 mr-2" />
            Floors
          </button>
          <button
            onClick={() => setActiveTab('bays')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'bays'
                ? 'border-primary text-primary'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            }`}
          >
            <LayoutGridIcon className="h-5 w-5 mr-2" />
            Bays
          </button>
          <button
            onClick={() => setActiveTab('spots')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'spots'
                ? 'border-primary text-primary'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            }`}
          >
            <DoorOpenIcon className="h-5 w-5 mr-2" />
            Spots
          </button>
        </nav>
      </div>

      {/* Floors Tab */}
      {activeTab === 'floors' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Floors in {selectedBuilding.name}</h3>
            <Button variant="primary" onClick={openAddModal} icon={<PlusIcon className="h-5 w-5" />}>
              Add Floor
            </Button>
          </div>
          <div className="card">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Floor Number</th>
                    <th>Description</th>
                    <th>Bay Count</th>
                    <th>Spot Count</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {buildingFloors.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8">
                        <LayoutIcon className="w-12 h-12 mx-auto text-neutral-300 mb-2" />
                        <p className="text-neutral-500">No floors found for this building</p>
                        <Button
                          variant="primary"
                          size="sm"
                          className="mt-3"
                          onClick={openAddModal}
                        >
                          Add Your First Floor
                        </Button>
                      </td>
                    </tr>
                  ) : (
                    buildingFloors.map((floor) => {
                      const floorBays = bays.filter(b => b.floorId === floor.id);
                      const floorSpotCount = floorBays.reduce((acc, bay) => {
                        return acc + spots.filter(s => s.bayId === bay.id).length;
                      }, 0);
                      
                      return (
                        <tr 
                          key={floor.id} 
                          onClick={() => setSelectedFloorId(floor.id)} 
                          className={`cursor-pointer hover:bg-neutral-50 ${selectedFloorId === floor.id ? 'bg-neutral-100' : ''}`}
                        >
                          <td className="font-medium">Floor {floor.floorNumber}</td>
                          <td>{floor.description || '—'}</td>
                          <td>{floorBays.length}</td>
                          <td>{floorSpotCount}</td>
                          <td className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditModal(floor);
                                }}
                                icon={<PencilIcon className="h-4 w-4" />}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDeleteModal(floor);
                                }}
                                icon={<TrashIcon className="h-4 w-4" />}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Bays Tab */}
      {activeTab === 'bays' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <div className="mb-2">
                <label htmlFor="floor-select" className="block text-sm font-medium text-neutral-700">
                  Select Floor
                </label>
                <select
                  id="floor-select"
                  className="select mt-1"
                  value={selectedFloorId || ''}
                  onChange={(e) => setSelectedFloorId(e.target.value || null)}
                >
                  <option value="">Select a floor</option>
                  {buildingFloors.map((floor) => (
                    <option key={floor.id} value={floor.id}>
                      Floor {floor.floorNumber} {floor.description ? `- ${floor.description}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Button 
              variant="primary" 
              onClick={openAddModal} 
              icon={<PlusIcon className="h-5 w-5" />}
              disabled={!selectedFloorId}
            >
              Add Bay
            </Button>
          </div>
          
          {selectedFloorId ? (
            <div className="card">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Bay Number</th>
                      <th>Description</th>
                      <th>Spot Count</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {floorBays.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-8">
                          <LayoutGridIcon className="w-12 h-12 mx-auto text-neutral-300 mb-2" />
                          <p className="text-neutral-500">No bays found for this floor</p>
                          <Button
                            variant="primary"
                            size="sm"
                            className="mt-3"
                            onClick={openAddModal}
                          >
                            Add Your First Bay
                          </Button>
                        </td>
                      </tr>
                    ) : (
                      floorBays.map((bay) => {
                        const baySpots = spots.filter(s => s.bayId === bay.id);
                        
                        return (
                          <tr 
                            key={bay.id} 
                            onClick={() => setSelectedBayId(bay.id)}
                            className={`cursor-pointer hover:bg-neutral-50 ${selectedBayId === bay.id ? 'bg-neutral-100' : ''}`}
                          >
                            <td className="font-medium">Bay {bay.bayNumber}</td>
                            <td>{bay.description || '—'}</td>
                            <td>{baySpots.length}</td>
                            <td className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditModal(bay);
                                  }}
                                  icon={<PencilIcon className="h-4 w-4" />}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDeleteModal(bay);
                                  }}
                                  icon={<TrashIcon className="h-4 w-4" />}
                                >
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 card">
              <LayoutGridIcon className="h-12 w-12 text-neutral-300 mb-4" />
              <h3 className="text-lg font-medium text-neutral-700">No Floor Selected</h3>
              <p className="text-neutral-500 mt-2">Please select a floor to manage its bays.</p>
            </div>
          )}
        </div>
      )}

      {/* Spots Tab */}
      {activeTab === 'spots' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="spot-floor-select" className="block text-sm font-medium text-neutral-700">
                  Select Floor
                </label>
                <select
                  id="spot-floor-select"
                  className="select mt-1"
                  value={selectedFloorId || ''}
                  onChange={(e) => {
                    setSelectedFloorId(e.target.value || null);
                    setSelectedBayId(null);
                  }}
                >
                  <option value="">Select a floor</option>
                  {buildingFloors.map((floor) => (
                    <option key={floor.id} value={floor.id}>
                      Floor {floor.floorNumber} {floor.description ? `- ${floor.description}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="bay-select" className="block text-sm font-medium text-neutral-700">
                  Select Bay
                </label>
                <select
                  id="bay-select"
                  className="select mt-1"
                  value={selectedBayId || ''}
                  onChange={(e) => setSelectedBayId(e.target.value || null)}
                  disabled={!selectedFloorId || floorBays.length === 0}
                >
                  <option value="">Select a bay</option>
                  {floorBays.map((bay) => (
                    <option key={bay.id} value={bay.id}>
                      Bay {bay.bayNumber} {bay.description ? `- ${bay.description}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <Button 
              variant="primary" 
              onClick={openAddModal} 
              icon={<PlusIcon className="h-5 w-5" />}
              disabled={!selectedBayId}
            >
              Add Spot
            </Button>
          </div>
          
          {selectedBayId ? (
            <div className="card">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Spot Number</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Features</th>
                      <th>Last Updated</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {baySpots.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8">
                          <DoorOpenIcon className="w-12 h-12 mx-auto text-neutral-300 mb-2" />
                          <p className="text-neutral-500">No spots found for this bay</p>
                          <Button
                            variant="primary"
                            size="sm"
                            className="mt-3"
                            onClick={openAddModal}
                          >
                            Add Your First Spot
                          </Button>
                        </td>
                      </tr>
                    ) : (
                      baySpots.map((spot) => (
                        <tr key={spot.id} className="hover:bg-neutral-50">
                          <td className="font-medium">Spot {spot.spotNumber}</td>
                          <td><SpotTypeBadge type={spot.type} /></td>
                          <td><StatusBadge status={spot.status} /></td>
                          <td>
                            <div className="flex flex-wrap gap-1">
                              {spot.features.length > 0 ? (
                                spot.features.map((feature) => (
                                  <FeatureBadge key={feature} feature={feature} size="sm" />
                                ))
                              ) : (
                                <span className="text-neutral-500 text-sm">None</span>
                              )}
                            </div>
                          </td>
                          <td className="text-sm">
                            {new Date(spot.lastUpdated).toLocaleString()}
                          </td>
                          <td className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => openEditModal(spot)}
                                icon={<PencilIcon className="h-4 w-4" />}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => openDeleteModal(spot)}
                                icon={<TrashIcon className="h-4 w-4" />}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 card">
              <DoorOpenIcon className="h-12 w-12 text-neutral-300 mb-4" />
              <h3 className="text-lg font-medium text-neutral-700">No Bay Selected</h3>
              <p className="text-neutral-500 mt-2">Please select a floor and bay to manage spots.</p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        open={isAddModalOpen || isEditModalOpen}
        onClose={() => isAddModalOpen ? setIsAddModalOpen(false) : setIsEditModalOpen(false)}
        title={getModalTitle()}
        footer={
          <>
            <Button 
              variant="outline" 
              onClick={() => isAddModalOpen ? setIsAddModalOpen(false) : setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={getSubmitHandler()}
            >
              {isAddModalOpen ? 'Add' : 'Save Changes'}
            </Button>
          </>
        }
      >
        {activeTab === 'floors' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="floor-number" className="block text-sm font-medium text-neutral-700">
                Floor Number
              </label>
              <input
                type="number"
                id="floor-number"
                className={`mt-1 input ${floorErrors.floorNumber ? 'border-red-500 ring-red-500' : ''}`}
                min="1"
                {...floorRegister('floorNumber', { 
                  required: 'Floor number is required',
                  valueAsNumber: true,
                  min: { 
                    value: 1, 
                    message: 'Floor number must be at least 1' 
                  }
                })}
              />
              {floorErrors.floorNumber && (
                <p className="mt-1 text-sm text-red-600">{floorErrors.floorNumber.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="floor-description" className="block text-sm font-medium text-neutral-700">
                Description (Optional)
              </label>
              <input
                type="text"
                id="floor-description"
                className="mt-1 input"
                placeholder="e.g. Ground Floor, Basement"
                {...floorRegister('description')}
              />
            </div>
          </div>
        )}
        
        {activeTab === 'bays' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="bay-number" className="block text-sm font-medium text-neutral-700">
                Bay Number
              </label>
              <input
                type="number"
                id="bay-number"
                className={`mt-1 input ${bayErrors.bayNumber ? 'border-red-500 ring-red-500' : ''}`}
                min="1"
                {...bayRegister('bayNumber', { 
                  required: 'Bay number is required',
                  valueAsNumber: true,
                  min: { 
                    value: 1, 
                    message: 'Bay number must be at least 1' 
                  }
                })}
              />
              {bayErrors.bayNumber && (
                <p className="mt-1 text-sm text-red-600">{bayErrors.bayNumber.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="bay-description" className="block text-sm font-medium text-neutral-700">
                Description (Optional)
              </label>
              <input
                type="text"
                id="bay-description"
                className="mt-1 input"
                placeholder="e.g. North Section, Premium Area"
                {...bayRegister('description')}
              />
            </div>
          </div>
        )}
        
        {activeTab === 'spots' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="spot-number" className="block text-sm font-medium text-neutral-700">
                Spot Number
              </label>
              <input
                type="number"
                id="spot-number"
                className={`mt-1 input ${spotErrors.spotNumber ? 'border-red-500 ring-red-500' : ''}`}
                min="1"
                {...spotRegister('spotNumber', { 
                  required: 'Spot number is required',
                  valueAsNumber: true,
                  min: { 
                    value: 1, 
                    message: 'Spot number must be at least 1' 
                  }
                })}
              />
              {spotErrors.spotNumber && (
                <p className="mt-1 text-sm text-red-600">{spotErrors.spotNumber.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="spot-type" className="block text-sm font-medium text-neutral-700">
                Type
              </label>
              <select
                id="spot-type"
                className={`mt-1 select ${spotErrors.type ? 'border-red-500 ring-red-500' : ''}`}
                {...spotRegister('type', { required: 'Type is required' })}
              >
                <option value="standard">Standard</option>
                <option value="compact">Compact</option>
                <option value="oversized">Oversized</option>
              </select>
              {spotErrors.type && (
                <p className="mt-1 text-sm text-red-600">{spotErrors.type.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="spot-status" className="block text-sm font-medium text-neutral-700">
                Status
              </label>
              <select
                id="spot-status"
                className={`mt-1 select ${spotErrors.status ? 'border-red-500 ring-red-500' : ''}`}
                {...spotRegister('status', { required: 'Status is required' })}
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
                <option value="maintenance">Maintenance</option>
              </select>
              {spotErrors.status && (
                <p className="mt-1 text-sm text-red-600">{spotErrors.status.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Features
              </label>
              <div className="space-y-2">
                {availableFeatures.map((feature) => (
                  <div key={feature.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`feature-${feature.id}`}
                      value={feature.id}
                      className="h-4 w-4 text-primary border-neutral-300 rounded focus:ring-primary"
                      {...spotRegister('features')}
                    />
                    <label htmlFor={`feature-${feature.id}`} className="ml-2 text-sm text-neutral-700">
                      {feature.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={`Delete ${activeTab === 'floors' ? 'Floor' : activeTab === 'bays' ? 'Bay' : 'Spot'}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </>
        }
      >
        <div className="text-sm text-neutral-600">
          <p>{getDeleteMessage()}</p>
          <p className="mt-2 text-red-500 font-medium">This action cannot be undone.</p>
        </div>
      </Modal>
    </div>
  );
}