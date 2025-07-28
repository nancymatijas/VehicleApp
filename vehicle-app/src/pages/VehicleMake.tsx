import React, { useState, useEffect } from 'react';
import {
  useGetVehicleMakesQuery,
  useCreateVehicleMakeMutation,
  useUpdateVehicleMakeMutation,
  useDeleteVehicleMakeMutation,
  VehicleMake,
  SortField,
  SortDirection,
  SortParams,
} from '../api/vehicleApi';
import SortSelect, { SortOption } from '../components/SortSelect';
import PaginationControl from '../components/PaginationControl';
import EntityTable, { Column } from '../components/EntityTable';
import VehicleForm from '../components/VehicleForm';

const sortOptions: SortOption[] = [
  { value: 'name', label: 'Name' },
  { value: 'abrv', label: 'Abbreviation' },
  { value: 'id', label: 'ID' },
];

const directionOptions: SortOption[] = [
  { value: 'asc', label: 'ASC' },
  { value: 'desc', label: 'DESC' },
];

const VehicleMakeComponent: React.FC = () => {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDirection>('asc');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  const [form, setForm] = useState<Omit<VehicleMake, 'id'>>({ name: '', abrv: '' });
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

  const { data: makes, error, isLoading } = useGetVehicleMakesQuery(queryParams);

  const [createVehicleMake, { isLoading: isCreating }] = useCreateVehicleMakeMutation();
  const [updateVehicleMake, { isLoading: isUpdating }] = useUpdateVehicleMakeMutation();
  const [deleteVehicleMake, { isLoading: isDeleting }] = useDeleteVehicleMakeMutation();

  const columns: Column<VehicleMake>[] = [
    { header: 'ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Abbreviation', accessor: 'abrv' },
  ];

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onSortChange = (value: string) => setSortField(value as SortField);
  const onDirChange = (value: string) => setSortDir(value as SortDirection);
  const onPageSizeChange = (size: number) => setPageSize(size);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!form.name.trim()) {
      setErrorMessage('Name is required.');
      return;
    }

    try {
      if (editId === null) {
        await createVehicleMake(form).unwrap();
      } else {
        await updateVehicleMake({ id: editId, ...form }).unwrap();
        setEditId(null);
      }
      setForm({ name: '', abrv: '' });
    } catch {
      setErrorMessage('Error saving data.');
    }
  };

  const onEdit = (make: VehicleMake) => {
    setEditId(make.id);
    setForm({ name: make.name, abrv: make.abrv });
    setErrorMessage(null);
  };

  const onCancelEdit = () => {
    setEditId(null);
    setForm({ name: '', abrv: '' });
  };

  const onDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this manufacturer?')) {
      try {
        await deleteVehicleMake(id).unwrap();
      } catch {
        alert('Error deleting the manufacturer.');
      }
    }
  };

  const onPrevPage = () => setPage(p => Math.max(1, p - 1));
  const onNextPage = () => {
    if (makes && makes.length === pageSize) setPage(p => p + 1);
  };

  if (error) return <div>Error loading manufacturers.</div>;
  if (isLoading) return <div>Loading manufacturers...</div>;

  return (
    <div>
      <h2>Vehicle Manufacturers</h2>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
        <SortSelect options={sortOptions} value={sortField} onChange={onSortChange} label="Sort By" />
        <SortSelect options={directionOptions} value={sortDir} onChange={onDirChange} label="Order By" />
      </div>

      <VehicleForm
        formData={form}
        onChange={onChange}
        onSubmit={onSubmit}
        isSubmitting={isCreating || isUpdating}
        errorMessage={errorMessage}
        onCancel={editId !== null ? onCancelEdit : undefined}
        isEditMode={editId !== null}
        fields={[
          { label: 'Name', name: 'name', required: true },
          { label: 'Abbreviation', name: 'abrv' },
        ]}
      />

      <EntityTable
        data={makes || []}
        columns={columns}
        onEdit={onEdit}
        onDelete={onDelete}
        editDisabled={isDeleting || isCreating || isUpdating}
        deleteDisabled={isDeleting || isCreating || isUpdating}
      />

      <PaginationControl
        page={page}
        pageSize={pageSize}
        onPrev={onPrevPage}
        onNext={onNextPage}
        disablePrev={page === 1}
        disableNext={!makes || makes.length < pageSize}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
};

export default VehicleMakeComponent;
