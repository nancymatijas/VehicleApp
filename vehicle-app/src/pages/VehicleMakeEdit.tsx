import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGetVehicleMakeByIdQuery, useUpdateVehicleMakeMutation, VehicleMake } from '../api/vehicleMakeApi';
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
  const { data, isLoading, error } = useGetVehicleMakeByIdQuery(Number(id));
  const make = data && data.length > 0 ? data[0] : undefined;
  const [updateVehicleMake, { isLoading: isUpdating }] = useUpdateVehicleMakeMutation();

  useEffect(() => {
    if (make) {
      setDefaultValues({ name: make.name, abrv: make.abrv });
      setErrorMessage(null);
    } else if (!isLoading) {
      setErrorMessage('Manufacturer not found');
    }
  }, [make, isLoading]);

  if (!id) return <div>Invalid ID</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading manufacturer.</div>;
  if (!defaultValues) return <div>{errorMessage || 'Loading...'}</div>;

  const onSubmit = async (data: Omit<VehicleMake, 'id'>) => {
    setErrorMessage(null);
    try {
      await updateVehicleMake({ id: Number(id), ...data }).unwrap();
      navigate('/vehicle-makes');
    } catch {
      setErrorMessage('Error saving data.');
    }
  };

  return (
    <motion.div 
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="heading">Edit Vehicle Manufacturer</h1>
      <VehicleForm
        defaultValues={defaultValues}
        fields={fields}
        onSubmit={onSubmit}
        isSubmitting={isUpdating}
        errorMessage={errorMessage}
        isEditMode
        onCancel={() => navigate('/vehicle-makes')}
      />
    </motion.div>
  );
};

export default VehicleMakeEdit;
