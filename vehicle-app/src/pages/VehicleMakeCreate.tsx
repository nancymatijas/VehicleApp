import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCreateVehicleMakeMutation } from '../api/vehicleMakeApi';
import VehicleForm from '../components/VehicleForm';
import { fields } from '../utils/constants';

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
    >      
      <h1 className="heading">Create Vehicle Manufacturer</h1>
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
