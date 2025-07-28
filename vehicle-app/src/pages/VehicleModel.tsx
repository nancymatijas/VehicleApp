import React, { useState, useEffect } from 'react';
import {
  useGetVehicleModelsQuery,
  useCreateVehicleModelMutation,
  useUpdateVehicleModelMutation,
  useDeleteVehicleModelMutation,
  useGetVehicleMakesQuery,
  VehicleModel,
  SortField,
  SortDirection,
  SortParams,
} from '../api/vehicleApi';
import SortSelect, { SortOption } from '../components/SortSelect';
import PaginationControl from '../components/PaginationControl';

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
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDirection>('asc');

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  const sortParams: SortParams & { page: number; pageSize: number } = {
    field: sortField,
    direction: sortDir,
    page,
    pageSize,
  };

  const { data: models, error, isLoading } = useGetVehicleModelsQuery(sortParams);
  const { data: makes, isLoading: isLoadingMakes } = useGetVehicleMakesQuery();

  const [createVehicleModel, { isLoading: isCreating }] = useCreateVehicleModelMutation();
  const [updateVehicleModel, { isLoading: isUpdating }] = useUpdateVehicleModelMutation();
  const [deleteVehicleModel, { isLoading: isDeleting }] = useDeleteVehicleModelMutation();

  const [form, setForm] = useState<Omit<VehicleModel, 'id'>>({
    name: '',
    abrv: '',
    make_id: 0,
  });

  const [editId, setEditId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [sortField, sortDir, pageSize]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'make_id' ? Number(value) : value,
    }));
  };

  const onSortChange = (value: string) => setSortField(value as SortField);
  const onDirChange = (value: string) => setSortDir(value as SortDirection);

  const onPageSizeChange = (size: number) => setPageSize(size);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!form.name.trim()) {
      setErrorMessage('Model name is required.');
      return;
    }
    if (!form.make_id || isNaN(form.make_id) || form.make_id === 0) {
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

  const onEdit = (model: VehicleModel) => {
    setEditId(model.id);
    setForm({ name: model.name, abrv: model.abrv, make_id: model.make_id });
    setErrorMessage(null);
  };

  const onCancelEdit = () => {
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

  const onPrevPage = () => setPage((p) => Math.max(1, p - 1));
  const onNextPage = () => {
    if (models && models.length === pageSize) {
      setPage((p) => p + 1);
    }
  };

  if (isLoading) return <div>Loading models...</div>;
  if (error) return <div>Error loading models.</div>;

  return (
    <div>
      <h2>Vehicle Models</h2>

      {/* Sorting controls */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <SortSelect options={sortOptions} value={sortField} onChange={onSortChange} label="Sort By" />
        <SortSelect options={directionOptions} value={sortDir} onChange={onDirChange} label="Order By" />
      </div>

      {errorMessage && <div style={{ color: 'red', marginBottom: 12 }}>{errorMessage}</div>}

      <form onSubmit={onSubmit} style={{ marginBottom: 20 }}>
        <input
          type="text"
          name="name"
          placeholder="Model Name"
          value={form.name}
          onChange={onChange}
          required
          style={{ marginRight: 10 }}
          disabled={isLoading || isCreating || isUpdating}
        />
        <input
          type="text"
          name="abrv"
          placeholder="Abbreviation"
          value={form.abrv}
          onChange={onChange}
          style={{ marginRight: 10 }}
          disabled={isLoading || isCreating || isUpdating}
        />
        <select
          name="make_id"
          value={form.make_id}
          onChange={onChange}
          required
          disabled={isLoadingMakes || isLoading || isCreating || isUpdating}
          style={{ marginRight: 10 }}
        >
          <option value={0}>Select Manufacturer</option>
          {makes?.map((make) => (
            <option key={make.id} value={make.id}>
              {make.name}
            </option>
          ))}
        </select>
        <button type="submit" disabled={isCreating || isUpdating}>
          {editId === null ? 'Add' : 'Save'}
        </button>
        {editId !== null && (
          <button type="button" onClick={onCancelEdit} style={{ marginLeft: 10 }}>
            Cancel
          </button>
        )}
      </form>

      <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Model Name</th>
            <th>Abbreviation</th>
            <th>Manufacturer</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {models?.map((model) => (
            <tr key={model.id}>
              <td>{model.id}</td>
              <td>{model.name}</td>
              <td>{model.abrv}</td>
              <td>{model.VehicleMake?.name || 'Unknown'}</td>
              <td>
                <button onClick={() => onEdit(model)} disabled={isDeleting || isCreating || isUpdating}>
                  Edit
                </button>{' '}
                <button
                  onClick={() => onDelete(model.id)}
                  disabled={isDeleting || isCreating || isUpdating}
                  style={{ color: 'red' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {!models?.length && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center' }}>
                No models available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <PaginationControl
        page={page}
        pageSize={pageSize}
        onPrev={onPrevPage}
        onNext={onNextPage}
        disablePrev={page === 1}
        disableNext={!models || models.length < pageSize}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
};

export default VehicleModelComponent;
