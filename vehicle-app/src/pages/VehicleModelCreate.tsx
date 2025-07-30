import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateVehicleModelMutation } from '../api/vehicleModelApi';
import { useGetVehicleMakesQuery } from '../api/vehicleMakeApi';
import VehicleForm, { FieldConfig, SelectFieldConfig, Option } from '../components/VehicleForm';

const fields: FieldConfig[] = [
  { label: 'Model Name', name: 'name', required: true },
  { label: 'Abbreviation', name: 'abrv' },
];

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
    <div className="container">
      <h2 className="heading">Create Vehicle Model</h2>
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
    </div>
  );
};

export default VehicleModelCreate;
