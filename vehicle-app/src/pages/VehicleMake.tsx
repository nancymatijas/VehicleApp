import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetVehicleMakesQuery,
  useDeleteVehicleMakeMutation,
  VehicleMake,
  SortField,
  SortDirection,
} from '../api/vehicleMakeApi';
import PaginationControl from '../components/PaginationControl';
import EntityTable, { Column } from '../components/EntityTable';
import FilterControlMake, { FilterFieldMake } from '../components/FilterControlMake';
import SortSelect, { SortOption } from '../components/SortSelect';
import { handleEditMake, handleDeleteMake } from '../utils/vehicleHandlers';

const LS_KEY = 'vehicleMakeListState';

function getInitialState() {
  try {
    const stored = localStorage.getItem(LS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
  }

  return {
    sortField: 'name' as SortField,
    sortDir: 'asc' as SortDirection,
    page: 1,
    pageSize: 5,
    filterField: 'name' as FilterFieldMake,
    filterValue: '',
  };
}

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

function VehicleMakeComponent(): React.JSX.Element {
  const navigate = useNavigate();
  const initialState = getInitialState();

  const [sortField, setSortField] = useState<SortField>(initialState.sortField);
  const [sortDir, setSortDir] = useState<SortDirection>(initialState.sortDir);
  const [page, setPage] = useState<number>(initialState.page);
  const [pageSize, setPageSize] = useState<number>(initialState.pageSize);
  const [filterField, setFilterField] = useState<FilterFieldMake>(initialState.filterField);
  const [filterValue, setFilterValue] = useState<string>(initialState.filterValue);

  useEffect(() => {
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({ sortField, sortDir, page, pageSize, filterField, filterValue }),
    );
  }, [sortField, sortDir, page, pageSize, filterField, filterValue]);

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

  function onEdit(make: VehicleMake) {
    handleEditMake(make, navigate);
  }

  async function onDelete(id: number) {
    await handleDeleteMake(id, deleteVehicleMake);
  }

  return (
    <div className="container">
      <h1 className="heading">Vehicle Manufacturers</h1>

      <button
        type="button"
        className="vehicle-add__button"
        onClick={() => navigate('/vehicle-makes/create')}
      >
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
        <SortSelect
          label="Sort By"
          options={sortOptions}
          value={sortField}
          onChange={(v) => setSortField(v as SortField)}
        />
        <SortSelect
          label="Order"
          options={directionOptions}
          value={sortDir}
          onChange={(v) => setSortDir(v as SortDirection)}
        />
      </div>

      {error && <div style={{ color: 'red' }}>Error loading manufacturers.</div>}
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
            onPrev={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
            onNext={() => {
              if (makes.length === pageSize) setPage((currentPage) => currentPage + 1);
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
}

export default VehicleMakeComponent;
