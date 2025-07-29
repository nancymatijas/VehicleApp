import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetVehicleModelsQuery,
  useCreateVehicleModelMutation,
  useUpdateVehicleModelMutation,
  useDeleteVehicleModelMutation,
  useGetVehicleMakesQuery,
  VehicleModel,
  VehicleModelWithMake,
  SortField,
  SortDirection,
  SortParams,
} from '../api/vehicleApi';
import SortSelect, { SortOption } from '../components/SortSelect';
import PaginationControl from '../components/PaginationControl';
import EntityTable, { Column } from '../components/EntityTable';
import VehicleForm, { FieldConfig, SelectFieldConfig, Option } from '../components/VehicleForm';

const sortOptions: SortOption[] = [
  { value: 'name', label: 'Model Name' },
  { value: 'abrv', label: 'Abbreviation' },
  { value: 'id', label: 'ID' },
  { value: 'make_id', label: 'Manufacturer' },
];

const directionOptions: SortOption[] = [
  { value: 'asc', label: 'ASC' },
  { value: 'desc', label: 'DESC' },
];

const VehicleModelComponent: React.FC = () => {
  const navigate = useNavigate();

  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDirection>('asc');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  const [editId, setEditId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [sortField, sortDir, pageSize]);

  const queryParams: SortParams & { page: number; pageSize: number } = {
    field: sortField,
    direction: sortDir,
    page,
    pageSize,
  };

  const { data: models, error, isLoading } = useGetVehicleModelsQuery(queryParams);
  const { data: makes, isLoading: isLoadingMakes } = useGetVehicleMakesQuery();

  const [createVehicleModel, { isLoading: isCreating }] = useCreateVehicleModelMutation();
  const [updateVehicleModel, { isLoading: isUpdating }] = useUpdateVehicleModelMutation();
  const [deleteVehicleModel, { isLoading: isDeleting }] = useDeleteVehicleModelMutation();

  const makesOptions: Option[] = makes ? makes.map((m) => ({ label: m.name, value: m.id })) : [];

  const defaultValues = editId !== null
    ? models?.find((m) => m.id === editId) ?? { name: '', abrv: '', make_id: 0 }
    : { name: '', abrv: '', make_id: 0 };

  const fields: FieldConfig[] = [
    { label: 'Model Name', name: 'name', required: true },
    { label: 'Abbreviation', name: 'abrv' },
  ];

  const selectFields: SelectFieldConfig[] = [
    {
      label: 'Manufacturer',
      name: 'make_id',
      options: makesOptions,
      required: true,
      disabled: isLoadingMakes || isCreating || isUpdating,
    },
  ];

  const columns: Column<VehicleModelWithMake>[] = [
    { header: 'ID', accessor: 'id' },
    { header: 'Model Name', accessor: 'name' },
    { header: 'Abbreviation', accessor: 'abrv' },
    {
      header: 'Manufacturer',
      accessor: (model) => {
        const make = makes?.find((m) => m.id === model.make_id);
        return make ? make.name : 'Unknown';
      },
    },
  ];

  const onSubmit = async (data: Omit<VehicleModel, 'id'>) => {
    setErrorMessage(null);
    try {
      if (editId === null) {
        await createVehicleModel(data).unwrap();
      } else {
        await updateVehicleModel({ id: editId, ...data }).unwrap();
        setEditId(null);
      }
    } catch {
      setErrorMessage('Error saving data.');
    }
  };

  const onEdit = (model: VehicleModelWithMake) => {
    setEditId(model.id);
    setErrorMessage(null);
  };

  const onCancel = () => {
    setEditId(null);
    setErrorMessage(null);
  };

  const onDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this model?')) {
      try {
        await deleteVehicleModel(id).unwrap();
      } catch {
        alert('Error deleting model.');
      }
    }
  };

  if (error) return <div>Error loading models.</div>;
  if (isLoading) return <div>Loading models...</div>;

  return (
    <div className="container">
      <button onClick={() => navigate('/')} className="backButton">
        Back to Homepage
      </button>
      <h2 className="heading">Vehicle Models</h2>
      <div className="sortControls">
        <SortSelect
          options={sortOptions}
          value={sortField}
          onChange={(v) => setSortField(v as SortField)}
          label="Sort By"
        />
        <SortSelect
          options={directionOptions}
          value={sortDir}
          onChange={(v) => setSortDir(v as SortDirection)}
          label="Order By"
        />
      </div>
      <VehicleForm
        defaultValues={defaultValues}
        fields={fields}
        selectFields={selectFields}
        onSubmit={onSubmit}
        isSubmitting={isCreating || isUpdating}
        errorMessage={errorMessage}
        onCancel={editId !== null ? onCancel : undefined}
        isEditMode={editId !== null}
      />
      <EntityTable
        data={models || []}
        columns={columns}
        onEdit={onEdit}
        onDelete={onDelete}
        editDisabled={isDeleting || isCreating || isUpdating}
        deleteDisabled={isDeleting || isCreating || isUpdating}
      />
      <PaginationControl
        page={page}
        pageSize={pageSize}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => {
          if (models && models.length === pageSize) setPage((p) => p + 1);
        }}
        disablePrev={page === 1}
        disableNext={!models || models.length < pageSize}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
};

export default VehicleModelComponent;
