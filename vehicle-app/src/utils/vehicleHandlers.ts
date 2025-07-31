import { VehicleMake } from '../api/vehicleMakeApi';
import { VehicleModelWithMake } from '../api/vehicleModelApi';

interface DeleteResponse {
  id: number;
}

export function handleEditMake(
  make: VehicleMake,
  navigate: (path: string) => void
): void {
  navigate(`/vehicle-makes/edit/${make.id}`);
}

export async function handleDeleteMake(
  id: number,
  deleteVehicleMake: (id: number) => Promise<DeleteResponse>
): Promise<boolean> {
  if (!window.confirm('Are you sure you want to delete this manufacturer?')) {
    return false;
  }
  try {
    await deleteVehicleMake(id);
    return true;
  } catch (error) {
    alert('Error deleting the manufacturer.');
    return false;
  }
}

export function handleEditModel(
  model: VehicleModelWithMake,
  navigate: (path: string) => void
): void {
  navigate(`/vehicle-models/edit/${model.id}`);
}

interface DeleteModelResponse {
  id: number;
}

export async function handleDeleteModel(
  id: number,
  deleteVehicleModel: (id: number) => Promise<DeleteModelResponse>
): Promise<boolean> {
  if (!window.confirm('Are you sure you want to delete this model?')) {
    return false;
  }
  try {
    await deleteVehicleModel(id);
    return true;
  } catch (error) {
    alert('Error deleting model.');
    return false;
  }
}
