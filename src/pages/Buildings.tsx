import { useState } from 'react';
import { useBuildings, Building } from '@/contexts/BuildingsContext';
import { PlusIcon, PencilIcon, TrashIcon, BuildingIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type BuildingFormValues = {
  name: string;
  address: string;
  description: string;
};

export default function Buildings() {
  const { buildings, addBuilding, updateBuilding, deleteBuilding, isLoading } = useBuildings();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentBuilding, setCurrentBuilding] = useState<Building | null>(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<BuildingFormValues>();

  // Open the edit modal with the selected building data
  const openEditModal = (building: Building) => {
    setCurrentBuilding(building);
    setValue('name', building.name);
    setValue('address', building.address || '');
    setValue('description', building.description || '');
    setIsEditModalOpen(true);
  };

  // Open the delete modal for the selected building
  const openDeleteModal = (building: Building) => {
    setCurrentBuilding(building);
    setIsDeleteModalOpen(true);
  };

  // Handle form submission for adding a new building
  const onAddSubmit = (data: BuildingFormValues) => {
    addBuilding(data);
    setIsAddModalOpen(false);
    reset();
    toast.success('Building added successfully');
  };

  // Handle form submission for editing a building
  const onEditSubmit = (data: BuildingFormValues) => {
    if (currentBuilding) {
      updateBuilding(currentBuilding.id, data);
      setIsEditModalOpen(false);
      reset();
      toast.success('Building updated successfully');
    }
  };

  // Handle building deletion
  const confirmDelete = () => {
    if (currentBuilding) {
      deleteBuilding(currentBuilding.id);
      setIsDeleteModalOpen(false);
      toast.success('Building deleted successfully');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Buildings</h2>
          <p className="text-neutral-500">Manage your parking facilities</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            reset();
            setIsAddModalOpen(true);
          }}
          icon={<PlusIcon className="h-5 w-5" />}
        >
          Add Building
        </Button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Floors</th>
                <th>Total Spots</th>
                <th>Occupancy</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {buildings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    <BuildingIcon className="w-12 h-12 mx-auto text-neutral-300 mb-2" />
                    <p className="text-neutral-500">No buildings found</p>
                    <Button
                      variant="primary"
                      size="sm"
                      className="mt-3"
                      onClick={() => setIsAddModalOpen(true)}
                    >
                      Add Your First Building
                    </Button>
                  </td>
                </tr>
              ) : (
                buildings.map((building) => (
                  <tr key={building.id}>
                    <td className="font-medium">{building.name}</td>
                    <td>{building.address || '—'}</td>
                    <td>{building.floorCount}</td>
                    <td>{building.totalSpots}</td>
                    <td>
                      <div className="flex items-center">
                        <div className="w-24 bg-neutral-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-primary rounded-full h-2"
                            style={{
                              width: `${
                                building.totalSpots > 0
                                  ? (building.occupiedSpots / building.totalSpots) * 100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm">
                          {building.totalSpots > 0
                            ? `${Math.round(
                                (building.occupiedSpots / building.totalSpots) * 100
                              )}%`
                            : '0%'}
                        </span>
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openEditModal(building)}
                          icon={<PencilIcon className="h-4 w-4" />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => openDeleteModal(building)}
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

      {/* Add Building Modal */}
      <Modal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Building"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit(onAddSubmit)}
              isLoading={isLoading}
            >
              Add Building
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onAddSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
              Building Name
            </label>
            <input
              type="text"
              id="name"
              className={`mt-1 input ${errors.name ? 'border-red-500 ring-red-500' : ''}`}
              placeholder="Main Garage"
              {...register('name', { required: 'Building name is required' })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-neutral-700">
              Address
            </label>
            <input
              type="text"
              id="address"
              className="mt-1 input"
              placeholder="123 Main Street, City"
              {...register('address')}
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-neutral-700">
              Description (Optional)
            </label>
            <textarea
              id="description"
              className="mt-1 input"
              rows={3}
              placeholder="Brief description of the building"
              {...register('description')}
            ></textarea>
          </div>
        </form>
      </Modal>

      {/* Edit Building Modal */}
      <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Building"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit(onEditSubmit)}
              isLoading={isLoading}
            >
              Save Changes
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-neutral-700">
              Building Name
            </label>
            <input
              type="text"
              id="edit-name"
              className={`mt-1 input ${errors.name ? 'border-red-500 ring-red-500' : ''}`}
              placeholder="Main Garage"
              {...register('name', { required: 'Building name is required' })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="edit-address" className="block text-sm font-medium text-neutral-700">
              Address
            </label>
            <input
              type="text"
              id="edit-address"
              className="mt-1 input"
              placeholder="123 Main Street, City"
              {...register('address')}
            />
          </div>
          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-neutral-700">
              Description (Optional)
            </label>
            <textarea
              id="edit-description"
              className="mt-1 input"
              rows={3}
              placeholder="Brief description of the building"
              {...register('description')}
            ></textarea>
          </div>
        </form>
      </Modal>

      {/* Delete Building Modal */}
      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Building"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              isLoading={isLoading}
            >
              Delete Building
            </Button>
          </>
        }
      >
        <div className="text-sm text-neutral-600">
          <p className="mb-4">
            Are you sure you want to delete <span className="font-semibold">{currentBuilding?.name}</span>?
          </p>
          <p>
            This action cannot be undone. All floors, bays, and parking spots associated with this building will also be deleted.
          </p>
        </div>
      </Modal>
    </div>
  );
}