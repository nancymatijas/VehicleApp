import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCreateVehicleMakeMutation } from '../api/vehicleMakeApi';
import VehicleForm, { FieldConfig } from '../components/VehicleForm';

const fields: FieldConfig[] = [
  { label: 'Name', name: 'name', required: true },
  { label: 'Abbreviation', name: 'abrv' },
];

const VehicleMakeCreate: React.FC = () => {
  const navigate = useNavigate();
  const [createVehicleMake, { isLoading }] = useCreateVehicleMakeMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const onSubmit = async (data: Omit<{ name: string; abrv: string }, 'id'>) => {
    setErrorMessage(null);
    try {
      await createVehicleMake(data).unwrap();
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
    >      <h2 className="heading">Create Vehicle Manufacturer</h2>
      <VehicleForm
        defaultValues={{ name: '', abrv: '' }}
        fields={fields}
        onSubmit={onSubmit}
        isSubmitting={isLoading}
        errorMessage={errorMessage}
        isEditMode={false}
        onCancel={() => navigate('/vehicle-makes')}
      />
    </motion.div>
  );
};

export default VehicleMakeCreate;
