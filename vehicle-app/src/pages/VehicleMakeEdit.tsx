import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetVehicleMakesQuery,
  useUpdateVehicleMakeMutation,
  VehicleMake,
} from '../api/vehicleMakeApi';
import VehicleForm, { FieldConfig } from '../components/VehicleForm';

const fields: FieldConfig[] = [
  { label: 'Name', name: 'name', required: true },
  { label: 'Abbreviation', name: 'abrv' },
];

const VehicleMakeEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [defaultValues, setDefaultValues] = useState<{ name: string; abrv: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { data: makes, isLoading, error } = useGetVehicleMakesQuery({
    page: 1,
    pageSize: 1000,
    field: 'id',        
    direction: 'asc'
    });
  const [updateVehicleMake, { isLoading: isUpdating }] = useUpdateVehicleMakeMutation();

  useEffect(() => {
    if (makes && id) {
      const make = makes.find((m) => m.id === Number(id));
      if (make) {
        setDefaultValues({ name: make.name, abrv: make.abrv });
      } else {
        setErrorMessage('Manufacturer not found');
      }
    }
  }, [makes, id]);

  if (!id) return <div>Invalid ID</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading manufacturer.</div>;
  if (!defaultValues) return <div>{errorMessage || 'Loading...'}</div>;

  const onSubmit = async (data: Omit<VehicleMake, 'id'>) => {
    setErrorMessage(null);
    try {
      await updateVehicleMake({ id: Number(id), ...data }).unwrap();
      navigate('/vehiclemakes');
    } catch {
      setErrorMessage('Error saving data.');
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Edit Vehicle Manufacturer</h2>
      <VehicleForm
        defaultValues={defaultValues}
        fields={fields}
        onSubmit={onSubmit}
        isSubmitting={isUpdating}
        errorMessage={errorMessage}
        isEditMode
        onCancel={() => navigate('/vehicle-makes')}
      />
    </div>
  );
};

export default VehicleMakeEdit;
