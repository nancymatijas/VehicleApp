import React from 'react';
import { useGetVehicleMakesQuery } from '../api/vehicleApi';

const VehicleMake: React.FC = () => {
  const { data: makes, error, isLoading } = useGetVehicleMakesQuery();

  console.log('vehicle makes:', makes);
  console.log('error:', error);
  console.log('loading:', isLoading);

  if (isLoading) return <div>Učitavanje proizvođača...</div>;
  if (error) return <div>Greška pri učitavanju proizvođača.</div>;

  return (
    <div>
      <h2>Vehicle Makes</h2>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Naziv</th>
            <th>Skraćenica</th>
          </tr>
        </thead>
        <tbody>
          {makes?.map((make) => (
            <tr key={make.id}>
              <td>{make.id}</td>
              <td>{make.name}</td>
              <td>{make.abrv}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleMake;
