import React, { useState } from 'react';
import {
  useGetVehicleMakesQuery,
  useCreateVehicleMakeMutation,
  useUpdateVehicleMakeMutation,
  useDeleteVehicleMakeMutation,
  VehicleMake,
} from '../api/vehicleApi';

const VehicleMakeComponent: React.FC = () => {
  const { data: makes, error, isLoading } = useGetVehicleMakesQuery();
  const [createVehicleMake, { isLoading: isCreating }] = useCreateVehicleMakeMutation();
  const [updateVehicleMake, { isLoading: isUpdating }] = useUpdateVehicleMakeMutation();
  const [deleteVehicleMake, { isLoading: isDeleting }] = useDeleteVehicleMakeMutation();

  const [form, setForm] = useState<Omit<VehicleMake, 'id'>>({ name: '', abrv: '' });
  const [editId, setEditId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!form.name.trim()) {
      setErrorMessage('Naziv je obavezan.');
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
      setErrorMessage('Greška pri čuvanju podataka.');
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
    if (window.confirm('Jeste li sigurni da želite obrisati ovaj proizvođač?')) {
      try {
        await deleteVehicleMake(id).unwrap();
      } catch {
        alert('Greška pri brisanju');
      }
    }
  };

  if (error) {
    return <div>Greška pri učitavanju proizvođača.</div>;
  }

  if (isLoading) {
    return <div>Učitavanje proizvođača...</div>;
  }

  return (
    <div>
      <h2>Vehicle Makes</h2>

      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

      <form onSubmit={onSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          name="name"
          placeholder="Naziv"
          value={form.name}
          onChange={onChange}
          required
          style={{ marginRight: '10px' }}
        />
        <input
          type="text"
          name="abrv"
          placeholder="Skraćenica"
          value={form.abrv}
          onChange={onChange}
          style={{ marginRight: '10px' }}
        />
        <button type="submit" disabled={isCreating || isUpdating}>
          {editId === null ? 'Dodaj' : 'Spremi'}
        </button>
        {editId !== null && (
          <button type="button" onClick={onCancelEdit} style={{ marginLeft: '10px' }}>
            Odustani
          </button>
        )}
      </form>

      <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Naziv</th>
            <th>Skraćenica</th>
            <th>Akcije</th>
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
                  Uredi
                </button>{' '}
                <button
                  onClick={() => onDelete(make.id)}
                  disabled={isDeleting || isCreating || isUpdating}
                  style={{ color: 'red' }}
                >
                  Obriši
                </button>
              </td>
            </tr>
          ))}
          {!makes?.length && <tr><td colSpan={4} style={{ textAlign: 'center' }}>Nema proizvođača</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleMakeComponent;
