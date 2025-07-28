import React from 'react';
import { useGetVehicleModelsQuery } from '../api/vehicleApi';

const VehicleModel: React.FC = () => {
  const { data: models, error, isLoading } = useGetVehicleModelsQuery();

  console.log('Models:', models);
  console.log('Error:', error);
  console.log('Loading:', isLoading);

  if (isLoading) return <div>Učitavanje modela...</div>;
  if (error) return <div>Greška pri učitavanju modela.</div>;

  return (
    <div>
      <h2>Vehicle Models</h2>
      <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Naziv modela</th>
            <th>Skraćenica</th>
            <th>Proizvođač</th>
          </tr>
        </thead>
        <tbody>
          {models?.map((model) => (
            <tr key={model.id}>
              <td>{model.id}</td>
              <td>{model.name}</td>
              <td>{model.abrv}</td>
              <td>{model.VehicleMake?.name || 'Nepoznato'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleModel;
