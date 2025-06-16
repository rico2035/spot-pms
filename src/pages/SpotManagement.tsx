import { useState, useEffect } from 'react';
import { useBuildings } from '@/contexts/BuildingsContext';
import { useSpotManagement } from '@/contexts/SpotManagementContext';
import { Spot } from '@/contexts/LayoutContext';
import { FilterIcon, SearchIcon, XIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import SpotTypeBadge from '@/components/ui/SpotTypeBadge';
import FeatureBadge from '@/components/ui/FeatureBadge';
import { toast } from 'react-toastify';

type ViewMode = 'grid' | 'list';

export default function SpotManagement() {
  const { selectedBuilding } = useBuildings();
  const {
    filters,
    setStatusFilter,
    setTypeFilter,
    setFeatureFilter,
    setSearchQuery,
    resetFilters,
    getFilteredSpots,
    toggleSpotStatus
  } = useSpotManagement();

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [spots, setSpots] = useState<Spot[]>([]);
  const [searchValue, setSearchValue] = useState('');

  // Available features for filtering
  const availableFeatures = [
    { id: 'ev_charging', name: 'EV Charging' },
    { id: 'handicap', name: 'Handicap Accessible' },
    { id: 'premium', name: 'Premium Spot' },
    { id: 'covered', name: 'Covered' }
  ];

  // Load spots when building changes
  useEffect(() => {
    if (selectedBuilding) {
      const buildingSpots = getFilteredSpots(selectedBuilding.id);
      setSpots(buildingSpots);
    } else {
      setSpots([]);
    }
  }, [selectedBuilding, getFilteredSpots, filters]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchValue);
  };

  // Handle status toggle
  const handleToggleStatus = async (spotId: string) => {
    const success = await toggleSpotStatus(spotId);
    if (success) {
      // Re-fetch the spots with updated data
      if (selectedBuilding) {
        const updatedSpots = getFilteredSpots(selectedBuilding.id);
        setSpots(updatedSpots);
      }
      toast.success('Spot status updated successfully');
    } else {
      toast.error('Failed to update spot status');
    }
  };

  if (!selectedBuilding) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-neutral-700 mb-2">No Building Selected</h2>
          <p className="text-neutral-500">Please select a building to manage spots.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Spot Management</h2>
        <p className="text-neutral-500">View and manage parking spots in {selectedBuilding.name}</p>
      </div>

      {/* Filters and search */}
      <div className="card">
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Status filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  filters.statusFilter === 'all'
                    ? 'bg-neutral-200 text-neutral-900'
                    : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                All Spots
              </button>
              <button
                onClick={() => setStatusFilter('available')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  filters.statusFilter === 'available'
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                Available
              </button>
              <button
                onClick={() => setStatusFilter('occupied')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  filters.statusFilter === 'occupied'
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                Occupied
              </button>
              <button
                onClick={() => setStatusFilter('reserved')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  filters.statusFilter === 'reserved'
                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                    : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                Reserved
              </button>
              <button
                onClick={() => setStatusFilter('maintenance')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  filters.statusFilter === 'maintenance'
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                Maintenance
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <form onSubmit={handleSearch} className="flex w-full sm:w-auto">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search by spot number..."
                    className="input pr-10 w-full"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 flex items-center px-3"
                  >
                    <SearchIcon className="h-5 w-5 text-neutral-400" />
                  </button>
                </div>
              </form>

              {/* View toggle */}
              <div className="inline-flex rounded-md shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                    viewMode === 'grid'
                      ? 'bg-neutral-200 text-neutral-900'
                      : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                    viewMode === 'list'
                      ? 'bg-neutral-200 text-neutral-900'
                      : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Additional filters */}
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div>
                <label htmlFor="type-filter" className="block text-sm font-medium text-neutral-700">
                  Type
                </label>
                <select
                  id="type-filter"
                  className="mt-1 select"
                  value={filters.typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                >
                  <option value="all">All Types</option>
                  <option value="standard">Standard</option>
                  <option value="compact">Compact</option>
                  <option value="oversized">Oversized</option>
                </select>
              </div>
              <div>
                <label htmlFor="feature-filter" className="block text-sm font-medium text-neutral-700">
                  Feature
                </label>
                <select
                  id="feature-filter"
                  className="mt-1 select"
                  value={filters.featureFilter || ''}
                  onChange={(e) => setFeatureFilter(e.target.value || null)}
                >
                  <option value="">Any Feature</option>
                  {availableFeatures.map((feature) => (
                    <option key={feature.id} value={feature.id}>
                      {feature.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reset filters button */}
            <Button
              variant="outline"
              size="sm"
              className="ml-auto"
              onClick={() => {
                resetFilters();
                setSearchValue('');
              }}
              icon={<XIcon className="h-4 w-4" />}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Spots grid or list view */}
      {spots.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-16">
            <FilterIcon className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
            <h3 className="text-lg font-medium text-neutral-700">No spots match your filters</h3>
            <p className="text-neutral-500 mt-2">Try adjusting your filters or adding spots to this building</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                resetFilters();
                setSearchValue('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {spots.map((spot) => (
            <div
              key={spot.id}
              className={`card transition-all hover:shadow-md ${
                spot.status === 'available'
                  ? 'border-l-4 border-green-500'
                  : spot.status === 'occupied'
                  ? 'border-l-4 border-red-500'
                  : spot.status === 'reserved'
                  ? 'border-l-4 border-yellow-500'
                  : 'border-l-4 border-blue-500'
              }`}
            >
              <div className="card-body p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">Spot {spot.spotNumber}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <StatusBadge status={spot.status} size="sm" />
                      <SpotTypeBadge type={spot.type} size="sm" />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(spot.id)}
                  >
                    Toggle
                  </Button>
                </div>
                {spot.features.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-xs font-medium text-neutral-500 uppercase mb-1">Features</h4>
                    <div className="flex flex-wrap gap-1">
                      {spot.features.map((feature) => (
                        <FeatureBadge key={feature} feature={feature} size="sm" />
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-3 text-xs text-neutral-500 flex items-center">
                  <span className="flex items-center">
                    Last updated: {new Date(spot.lastUpdated).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Spot #</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Features</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {spots.map((spot) => (
                  <tr key={spot.id}>
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
                          <span className="text-neutral-500 text-sm">—</span>
                        )}
                      </div>
                    </td>
                    <td className="text-sm">
                      {new Date(spot.lastUpdated).toLocaleString()}
                    </td>
                    <td>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(spot.id)}
                      >
                        Toggle Status
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}