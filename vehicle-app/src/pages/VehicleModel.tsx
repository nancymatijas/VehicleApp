import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetVehicleModelsQuery,
  useDeleteVehicleModelMutation,
  VehicleModelWithMake,
  SortField,
  SortDirection,
  FilterFieldModel,
} from '../api/vehicleModelApi';
import { useGetVehicleMakesQuery } from '../api/vehicleMakeApi';
import PaginationControl from '../components/PaginationControl';
import EntityTable, { Column } from '../components/EntityTable';
import FilterControlModel from '../components/FilterControlModel';
import SortSelect, { SortOption } from '../components/SortSelect';

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

const filterFieldOptionsModel: { value: FilterFieldModel; label: string }[] = [
  { value: 'name', label: 'Model Name' },
  { value: 'abrv', label: 'Abbreviation' },
  { value: 'make_id', label: 'Manufacturer' },
];

const VehicleModelComponent: React.FC = () => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDirection>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [filterField, setFilterField] = useState<FilterFieldModel>('name');
  const [filterValue, setFilterValue] = useState('');
  const { data: makes, isLoading: isLoadingMakes } = useGetVehicleMakesQuery();
  const manufacturerOptions = makes
    ? makes.map((make) => ({ label: make.name, value: make.id.toString() }))
    : [];

  const queryParams = {
    field: sortField,
    direction: sortDir,
    page,
    pageSize,
    filterField: filterValue.trim() !== '' ? filterField : undefined,
    filterValue: filterValue.trim() !== '' ? filterValue : undefined,
  };

  const { data: models, error, isLoading } = useGetVehicleModelsQuery(queryParams);
  const [deleteVehicleModel, { isLoading: isDeleting }] = useDeleteVehicleModelMutation();

  const columns: Column<VehicleModelWithMake>[] = [
    { header: 'ID', accessor: 'id' },
    { header: 'Model Name', accessor: 'name' },
    { header: 'Abbreviation', accessor: 'abrv' },
    {
      header: 'Manufacturer',
      accessor: (model) => model.VehicleMake?.name ?? 'Unknown',
    },
  ];

  const onDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this model?')) {
      try {
        await deleteVehicleModel(id).unwrap();
      } catch {
        alert('Error deleting model.');
      }
    }
  };

  const onEdit = (model: VehicleModelWithMake) => {
    navigate(`/vehicle-models/edit/${model.id}`);
  };

  return (
    <div className="container">
      <h2 className="heading">Vehicle Models</h2>

      <button onClick={() => navigate('/vehicle-models/create')}  className="vehicle-add__button">
        Add New Model
      </button>

      <FilterControlModel
        filterField={filterField}
        filterValue={filterValue}
        onFilterFieldChange={setFilterField}
        onFilterValueChange={setFilterValue}
        filterFieldOptions={filterFieldOptionsModel}
        manufacturerOptions={manufacturerOptions}
      />

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
          label="Order"
        />
      </div>

      {error && <div style={{ color: 'red' }}>Error loading models.</div>}
      {isLoading && <div>Loading models...</div>}

      {!isLoading && models && (
        <>
          <EntityTable
            data={models}
            columns={columns}
            onEdit={onEdit}
            onDelete={onDelete}
            editDisabled={isDeleting}
            deleteDisabled={isDeleting}
          />
          <PaginationControl
            page={page}
            pageSize={pageSize}
            onPrev={() => setPage((p) => Math.max(p - 1, 1))}
            onNext={() => {
              if (models.length === pageSize) setPage((p) => p + 1);
            }}
            disablePrev={page === 1}
            disableNext={!models || models.length < pageSize}
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

export default VehicleModelComponent;
