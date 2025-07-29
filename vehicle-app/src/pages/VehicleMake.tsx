import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetVehicleMakesQuery,
  useCreateVehicleMakeMutation,
  useUpdateVehicleMakeMutation,
  useDeleteVehicleMakeMutation,
  VehicleMake,
  SortField,
  SortDirection,
  SortParams,
} from '../api/vehicleMakeApi';
import SortSelect, { SortOption } from '../components/SortSelect';
import PaginationControl from '../components/PaginationControl';
import EntityTable, { Column } from '../components/EntityTable';
import VehicleForm, { FieldConfig } from '../components/VehicleForm';
import FilterControlMake, { FilterFieldMake } from '../components/FilterControlMake';

const LS_KEY = 'vehicleMakeListState';

const getInitialState = () => {
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
};

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
  const initialState = getInitialState();

  const [sortField, setSortField] = useState<SortField>(initialState.sortField);
  const [sortDir, setSortDir] = useState<SortDirection>(initialState.sortDir);
  const [page, setPage] = useState<number>(initialState.page);
  const [pageSize, setPageSize] = useState<number>(initialState.pageSize);

  const [filterField, setFilterField] = useState<FilterFieldMake>(initialState.filterField);
  const [filterValue, setFilterValue] = useState<string>(initialState.filterValue);

  const [editId, setEditId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [sortField, sortDir, pageSize, filterField, filterValue]);

  useEffect(() => {
    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({
          sortField,
          sortDir,
          page,
          pageSize,
          filterField,
          filterValue,
        })
      );
    } catch {
    }
  }, [sortField, sortDir, page, pageSize, filterField, filterValue]);

  const queryParams: SortParams & {
    page: number;
    pageSize: number;
    filterField?: FilterFieldMake;
    filterValue?: string;
  } = {
    field: sortField,
    direction: sortDir,
    page,
    pageSize,
    filterField: filterValue.trim() !== '' ? filterField : undefined,
    filterValue: filterValue.trim() !== '' ? filterValue : undefined,
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

  const defaultValues = editId !== null
    ? makes?.find((make) => make.id === editId) ?? { name: '', abrv: '' }
    : { name: '', abrv: '' };

  const fields: FieldConfig[] = [
    { label: 'Name', name: 'name', required: true },
    { label: 'Abbreviation', name: 'abrv' },
  ];

  const onSubmit = async (data: Omit<VehicleMake, 'id'>) => {
    setErrorMessage(null);
    try {
      if (editId === null) {
        await createVehicleMake(data).unwrap();
      } else {
        await updateVehicleMake({ id: editId, ...data }).unwrap();
        setEditId(null);
      }
    } catch {
      setErrorMessage('Error saving data.');
    }
  };

  const onEdit = (make: VehicleMake) => {
    setEditId(make.id);
    setErrorMessage(null);
  };

  const onCancelEdit = () => {
    setEditId(null);
    setErrorMessage(null);
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
    <div className="container">
      <button
        onClick={() => navigate('/')}
        className="backButton"
      >
        Back to Homepage
      </button>
      <h2 className="heading">Vehicle Manufacturers</h2>

      <FilterControlMake
        filterField={filterField}
        filterValue={filterValue}
        onFilterFieldChange={setFilterField}
        onFilterValueChange={setFilterValue}
        filterFieldOptions={filterFieldOptionsMake}
      />

      <div className="sortControl" style={{ marginBottom: 12, display: 'flex', gap: '12px', alignItems: 'center' }}>
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
          label="Order By"
        />
      </div>

      <VehicleForm
        defaultValues={defaultValues}
        fields={fields}
        onSubmit={onSubmit}
        isSubmitting={isCreating || isUpdating}
        errorMessage={errorMessage}
        onCancel={editId !== null ? onCancelEdit : undefined}
        isEditMode={editId !== null}
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
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => {
          if (makes && makes.length === pageSize) setPage((p) => p + 1);
        }}
        disablePrev={page === 1}
        disableNext={!makes || makes.length < pageSize}
        onPageSizeChange={(newSize) => setPageSize(newSize)}
      />
    </div>
  );
};

export default VehicleMakeComponent;
