import React, { useState, useEffect } from 'react';
import '../styles/VehiclePages.css';
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
import VehicleForm from '../components/VehicleForm';

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

  const [form, setForm] = useState<Omit<VehicleModel, 'id'>>({ name: '', abrv: '', make_id: 0 });
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

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'make_id' ? Number(value) : value,
    }));
  };

  const onSortChange = (val: string) => setSortField(val as SortField);
  const onDirChange = (val: string) => setSortDir(val as SortDirection);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!form.name.trim()) {
      setErrorMessage('Model name is required.');
      return;
    }
    if (!form.make_id) {
      setErrorMessage('You must select a manufacturer.');
      return;
    }
    try {
      if (editId === null) {
        await createVehicleModel(form).unwrap();
      } else {
        await updateVehicleModel({ id: editId, ...form }).unwrap();
        setEditId(null);
      }
      setForm({ name: '', abrv: '', make_id: 0 });
    } catch {
      setErrorMessage('Error saving data.');
    }
  };

  const onEdit = (model: VehicleModelWithMake) => {
    setEditId(model.id);
    setForm({ name: model.name, abrv: model.abrv, make_id: model.make_id });
    setErrorMessage(null);
  };

  const onCancel = () => {
    setEditId(null);
    setForm({ name: '', abrv: '', make_id: 0 });
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

  const onPrev = () => setPage((p) => Math.max(1, p - 1));
  const onNext = () => {
    if (models && models.length === pageSize) setPage((p) => p + 1);
  };

  const columns: Column<VehicleModelWithMake>[] = [
    { header: 'ID', accessor: 'id' },
    { header: 'Model Name', accessor: 'name' },
    { header: 'Abbreviation', accessor: 'abrv' },
    {
        header: 'Manufacturer', accessor: (model) => {
          const make = makes?.find(m => m.id === model.make_id);
          return make ? make.name : 'Unknown';
        }
      },
  ];

  const formFields: { label: string; name: keyof Omit<VehicleModel, 'id'>; required?: boolean }[] = [
    { label: 'Model Name', name: 'name', required: true },
    { label: 'Abbreviation', name: 'abrv' },
  ];

  const formSelectFields: { label: string; name: keyof Omit<VehicleModel, 'id'>; options: SortOption[]; required?: boolean; disabled?: boolean }[] = [
    {
      label: 'Manufacturer',
      name: 'make_id',
      options: makes
        ? makes.map((m) => ({
            label: m.name,
            value: m.id.toString(), 
          }))
        : [],
      required: true,
      disabled: isLoadingMakes || isCreating || isUpdating,
    },
  ];

  if (error) return <div>Error loading models.</div>;
  if (isLoading) return <div>Loading models...</div>;

  return (
    <div className="container">

      <button 
        onClick={() => navigate('/')}
        className="backButton"
      >
        Back to Homepage
      </button>

      <h2 className="heading">Vehicle Models</h2>

      <div className="sortControls">
        <SortSelect options={sortOptions} value={sortField} onChange={onSortChange} label="Sort By" />
        <SortSelect options={directionOptions} value={sortDir} onChange={onDirChange} label="Order By" />
      </div>

      <VehicleForm
        formData={form}
        onChange={onChange}
        onSubmit={onSubmit}
        isSubmitting={isCreating || isUpdating}
        errorMessage={errorMessage}
        onCancel={editId !== null ? onCancel : undefined}
        isEditMode={editId !== null}
        fields={formFields}
        selectFields={formSelectFields}
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
        onPrev={onPrev}
        onNext={onNext}
        disablePrev={page === 1}
        disableNext={!models || models.length < pageSize}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
};

export default VehicleModelComponent;
