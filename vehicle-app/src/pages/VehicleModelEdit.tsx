import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGetVehicleModelByIdQuery, useUpdateVehicleModelMutation, VehicleModel } from '../api/vehicleModelApi';
import { useGetVehicleMakesQuery } from '../api/vehicleMakeApi';
import VehicleForm, { SelectFieldConfig, Option } from '../components/VehicleForm';
import { fields } from '../utils/constants';

const VehicleModelEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [defaultValues, setDefaultValues] = useState<{ name: string; abrv: string; make_id: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { data, isLoading, error } = useGetVehicleModelByIdQuery(Number(id));
  const { data: makes, isLoading: isLoadingMakes } = useGetVehicleMakesQuery();
  const [updateVehicleModel, { isLoading: isUpdating }] = useUpdateVehicleModelMutation();

  useEffect(() => {
    if (data && data.length > 0) {
      const doc = data[0];
      setDefaultValues({ name: doc.name, abrv: doc.abrv, make_id: doc.make_id });
      setErrorMessage(null);
    } else if (!isLoading) {
      setErrorMessage('Model not found');
    }
  }, [data, isLoading]);

  if (!id) return <div>Invalid ID</div>;
  if (isLoading) return <div>Loading model data...</div>;
  if (error) return <div>Error loading model data.</div>;
  if (!defaultValues) return <div>{errorMessage || 'Loading...'}</div>;

  const makesOptions: Option[] = makes ? makes.map((m) => ({ label: m.name, value: m.id })) : [];
  const selectFields: SelectFieldConfig[] = [
    {
      label: 'Manufacturer',
      name: 'make_id',
      options: makesOptions,
      required: true,
      disabled: isLoadingMakes || isUpdating,
    },
  ];

  const onSubmit = async (data: Omit<VehicleModel, 'id'>) => {
    setErrorMessage(null);
    try {
      await updateVehicleModel({ id: Number(id), ...data }).unwrap();
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
      <h1 className="heading">Edit Vehicle Model</h1>
      <VehicleForm
        defaultValues={defaultValues}
        fields={fields}
        selectFields={selectFields}
        onSubmit={onSubmit}
        isSubmitting={isUpdating}
        errorMessage={errorMessage}
        isEditMode
        onCancel={() => navigate('/vehicle-models')}
      />
    </motion.div>
  );
};

export default VehicleModelEdit;
