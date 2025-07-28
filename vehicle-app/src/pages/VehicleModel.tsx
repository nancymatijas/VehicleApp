import React, { useState } from 'react';
import {
  useGetVehicleModelsQuery,
  useCreateVehicleModelMutation,
  useUpdateVehicleModelMutation,
  useDeleteVehicleModelMutation,
  useGetVehicleMakesQuery,
  VehicleModel,
} from '../api/vehicleApi';

const VehicleModelComponent: React.FC = () => {
  const { data: models, error, isLoading } = useGetVehicleModelsQuery();
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

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'make_id' ? Number(value) : value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!form.name.trim()) {
      setErrorMessage('Naziv modela je obavezan.');
      return;
    }
    if (!form.make_id || isNaN(form.make_id) || form.make_id === 0) {
      setErrorMessage('Morate odabrati proizvođača.');
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
      setErrorMessage('Greška pri čuvanju podataka.');
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
    if (window.confirm('Jeste li sigurni da želite obrisati ovaj model?')) {
      try {
        await deleteVehicleModel(id).unwrap();
      } catch {
        alert('Greška pri brisanju modela');
      }
    }
  };

  if (isLoading) return <div>Učitavanje modela...</div>;
  if (error) return <div>Greška pri učitavanju modela.</div>;

  return (
    <div>
      <h2>Vehicle Models</h2>

      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

      <form onSubmit={onSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          name="name"
          placeholder="Naziv modela"
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
        <select
          name="make_id"
          value={form.make_id}
          onChange={onChange}
          required
          disabled={isLoadingMakes}
          style={{ marginRight: '10px' }}
        >
          <option value={0}>Odaberite proizvođača</option>
          {makes?.map((make) => (
            <option key={make.id} value={make.id}>
              {make.name}
            </option>
          ))}
        </select>

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
            <th>Naziv modela</th>
            <th>Skraćenica</th>
            <th>Proizvođač</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {models?.map((model) => (
            <tr key={model.id}>
              <td>{model.id}</td>
              <td>{model.name}</td>
              <td>{model.abrv}</td>
              <td>{model.VehicleMake?.name || 'Nepoznato'}</td>
              <td>
                <button onClick={() => onEdit(model)} disabled={isDeleting || isCreating || isUpdating}>
                  Uredi
                </button>{' '}
                <button
                  onClick={() => onDelete(model.id)}
                  disabled={isDeleting || isCreating || isUpdating}
                  style={{ color: 'red' }}
                >
                  Obriši
                </button>
              </td>
            </tr>
          ))}
          {!models?.length && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center' }}>
                Nema modela
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleModelComponent;
