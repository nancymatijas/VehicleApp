import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  useGetVehicleModelsQuery,
  useUpdateVehicleModelMutation,
  VehicleModel,
} from '../api/vehicleModelApi';
import { useGetVehicleMakesQuery } from '../api/vehicleMakeApi';
import VehicleForm, { FieldConfig, SelectFieldConfig, Option } from '../components/VehicleForm';

const fields: FieldConfig[] = [
  { label: 'Model Name', name: 'name', required: true },
  { label: 'Abbreviation', name: 'abrv' },
];

const VehicleModelEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [defaultValues, setDefaultValues] = useState<{ name: string; abrv: string; make_id: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { data: models, isLoading: isLoadingModels, error: errorModels } = useGetVehicleModelsQuery({
    page: 1,
    pageSize: 1000,
    field: 'id',
    direction: 'asc',
  });
  const { data: makes, isLoading: isLoadingMakes } = useGetVehicleMakesQuery();
  const [updateVehicleModel, { isLoading: isUpdating }] = useUpdateVehicleModelMutation();

  useEffect(() => {
    if (models && id) {
      const doc = models.find((m) => m.id === Number(id));
      if (doc) {
        setDefaultValues({ name: doc.name, abrv: doc.abrv, make_id: doc.make_id });
      } else {
        setErrorMessage('Model not found');
      }
    }
  }, [models, id]);

  if (!id) return <div>Invalid ID</div>;
  if (isLoadingModels) return <div>Loading model data...</div>;
  if (errorModels) return <div>Error loading model data.</div>;
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
      <h2 className="heading">Edit Vehicle Model</h2>
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
