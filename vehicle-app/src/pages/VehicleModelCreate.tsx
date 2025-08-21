import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCreateVehicleModelMutation } from '../api/vehicleModelApi';
import { useGetVehicleMakesQuery } from '../api/vehicleMakeApi';
import VehicleForm, { SelectFieldConfig, Option } from '../components/VehicleForm';
import { fields } from '../utils/constants';

const VehicleModelCreate: React.FC = () => {
  const navigate = useNavigate();
  const { data: makes, isLoading: isLoadingMakes } = useGetVehicleMakesQuery();
  const [createVehicleModel, { isLoading: isCreating }] = useCreateVehicleModelMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const makesOptions: Option[] = makes ? makes.map((m) => ({ label: m.name, value: m.id })) : [];
  const selectFields: SelectFieldConfig[] = [
    {
      label: 'Manufacturer',
      name: 'make_id',
      options: makesOptions,
      required: true,
      disabled: isLoadingMakes || isCreating,
    },
  ];

  const onSubmit = async (data: Omit<{ name: string; abrv: string; make_id: number }, 'id'>) => {
    setErrorMessage(null);
    try {
      await createVehicleModel(data).unwrap();
      navigate('/vehicle-models');
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
      <h1 className="heading">Create Vehicle Model</h1>
      <VehicleForm
        defaultValues={{ name: '', abrv: '', make_id: 0 }}
        fields={fields}
        selectFields={selectFields}
        onSubmit={onSubmit}
        isSubmitting={isCreating}
        errorMessage={errorMessage}
        isEditMode={false}
        onCancel={() => navigate('/vehicle-models')}
      />
    </motion.div>
  );
};

export default VehicleModelCreate;
