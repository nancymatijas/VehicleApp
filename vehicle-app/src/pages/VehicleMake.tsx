import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetVehicleMakesQuery,
  useDeleteVehicleMakeMutation,
  VehicleMake,
} from '../api/vehicleMakeApi';
import PaginationControl from '../components/PaginationControl';
import EntityTable, { Column } from '../components/EntityTable';
import FilterControlMake, { FilterFieldMake } from '../components/FilterControlMake';
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

const filterFieldOptionsMake: { value: FilterFieldMake; label: string }[] = [
  { value: 'name', label: 'Name' },
  { value: 'abrv', label: 'Abbreviation' },
];

const VehicleMakeComponent: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
  const [sortField, setSortField] = React.useState<'id' | 'name' | 'abrv'>('name');
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');
  const [filterField, setFilterField] = React.useState<FilterFieldMake>('name');
  const [filterValue, setFilterValue] = React.useState('');
  const { data: makes, error, isLoading } = useGetVehicleMakesQuery({
    page,
    pageSize,
    field: sortField,
    direction: sortDir,
    filterField: filterValue.trim() === '' ? undefined : filterField,
    filterValue: filterValue.trim() === '' ? undefined : filterValue.trim(),
  });
  const [deleteVehicleMake, { isLoading: isDeleting }] = useDeleteVehicleMakeMutation();

  const columns: Column<VehicleMake>[] = [
    { header: 'ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Abbreviation', accessor: 'abrv' },
  ];

  const onEdit = (make: VehicleMake) => {
    navigate(`/vehicle-makes/edit/${make.id}`);
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

  return (
    <div className="container">
      <h2 className="heading">Vehicle Manufacturers</h2>

      <button onClick={() => navigate('/vehicle-makes/create')} className="vehicle-add__button">
        Add New Manufacturer
      </button>

      <FilterControlMake
        filterField={filterField}
        filterValue={filterValue}
        onFilterFieldChange={setFilterField}
        onFilterValueChange={setFilterValue}
        filterFieldOptions={filterFieldOptionsMake}
      />

      <div className="sortControls">
        <SortSelect options={sortOptions} value={sortField} onChange={(v) => setSortField(v as any)} label="Sort By" />
        <SortSelect options={directionOptions} value={sortDir} onChange={(v) => setSortDir(v as any)} label="Order" />
      </div>

      {error && <div>Error loading manufacturers.</div>}
      {isLoading && <div>Loading...</div>}

      {!isLoading && makes && (
        <>
          <EntityTable
            data={makes}
            columns={columns}
            onEdit={onEdit}
            onDelete={onDelete}
            editDisabled={isDeleting}
            deleteDisabled={isDeleting}
          />

          <PaginationControl
            page={page}
            pageSize={pageSize}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => {
              if (makes.length === pageSize) setPage((p) => p + 1);
            }}
            disablePrev={page === 1}
            disableNext={!makes || makes.length < pageSize}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </>
      )}
    </div>
  );
};

export default VehicleMakeComponent;
