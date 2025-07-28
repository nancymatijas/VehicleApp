import React, { useState } from 'react';
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

  const sortParams: SortParams = { field: sortField, direction: sortDir };
  const { data: makes, error, isLoading } = useGetVehicleMakesQuery(sortParams);

  const [createVehicleMake, { isLoading: isCreating }] = useCreateVehicleMakeMutation();
  const [updateVehicleMake, { isLoading: isUpdating }] = useUpdateVehicleMakeMutation();
  const [deleteVehicleMake, { isLoading: isDeleting }] = useDeleteVehicleMakeMutation();

  const [form, setForm] = useState<Omit<VehicleMake, 'id'>>({ name: '', abrv: '' });
  const [editId, setEditId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSortChange = (value: string) => setSortField(value as SortField);
  const onDirChange = (value: string) => setSortDir(value as SortDirection);

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

  if (error) return <div>Error loading manufacturers.</div>;
  if (isLoading) return <div>Loading manufacturers...</div>;

  return (
    <div>
      <h2>Vehicle Manufacturers</h2>
      <div style={{ display: 'flex', gap: 16 }}>
        <SortSelect options={sortOptions} value={sortField} onChange={onSortChange} label="Sort By" />
        <SortSelect options={directionOptions} value={sortDir} onChange={onDirChange} label="Order By" />
      </div>

      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

      <form onSubmit={onSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={onChange}
          required
          style={{ marginRight: '10px' }}
        />
        <input
          type="text"
          name="abrv"
          placeholder="Abbreviation"
          value={form.abrv}
          onChange={onChange}
          style={{ marginRight: '10px' }}
        />
        <button type="submit" disabled={isCreating || isUpdating}>
          {editId === null ? 'Add' : 'Save'}
        </button>
        {editId !== null && (
          <button type="button" onClick={onCancelEdit} style={{ marginLeft: '10px' }}>
            Cancel
          </button>
        )}
      </form>

      <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Abbreviation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {makes?.map((make) => (
            <tr key={make.id}>
              <td>{make.id}</td>
              <td>{make.name}</td>
              <td>{make.abrv}</td>
              <td>
                <button onClick={() => onEdit(make)} disabled={isDeleting || isCreating || isUpdating}>
                  Edit
                </button>{' '}
                <button
                  onClick={() => onDelete(make.id)}
                  disabled={isDeleting || isCreating || isUpdating}
                  style={{ color: 'red' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {!makes?.length && (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center' }}>
                No manufacturers
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleMakeComponent;
