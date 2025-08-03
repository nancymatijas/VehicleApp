import React, { useState, useEffect } from 'react';
import { IoIosAddCircle } from "react-icons/io";
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
import { handleEditModel, handleDeleteModel } from '../utils/vehicleHandlers';

const LS_KEY = 'vehicleModelListState';

interface VehicleModelListState {
  sortField: SortField;
  sortDir: SortDirection;
  page: number;
  pageSize: number;
  filterField: FilterFieldModel;
  filterValue: string;
}

function getInitialState(): VehicleModelListState {
  try {
    const stored = localStorage.getItem(LS_KEY);
    if (stored) {
      return JSON.parse(stored) as VehicleModelListState;
    }
  } catch {
  }

  return {
    sortField: 'name' as SortField,
    sortDir: 'asc' as SortDirection,
    page: 1,
    pageSize: 5,
    filterField: 'name' as FilterFieldModel,
    filterValue: '',
  };
}

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

function VehicleModelComponent(): React.JSX.Element {
  const navigate = useNavigate();
  const initialState = getInitialState();

  const [sortField, setSortField] = useState<SortField>(initialState.sortField);
  const [sortDir, setSortDir] = useState<SortDirection>(initialState.sortDir);
  const [page, setPage] = useState<number>(initialState.page);
  const [pageSize, setPageSize] = useState<number>(initialState.pageSize);
  const [filterField, setFilterField] = useState<FilterFieldModel>(initialState.filterField);
  const [filterValue, setFilterValue] = useState<string>(initialState.filterValue);

  useEffect(() => {
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({ sortField, sortDir, page, pageSize, filterField, filterValue }),
    );
  }, [sortField, sortDir, page, pageSize, filterField, filterValue]);

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
    filterValue: filterValue.trim() !== '' ? filterValue.trim() : undefined,
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

  function onEdit(model: VehicleModelWithMake): void {
    handleEditModel(model, navigate);
  }

  async function onDelete(id: number): Promise<void> {
    await handleDeleteModel(id, (id) => deleteVehicleModel(id).unwrap());
  }

  return (
    <div className="container">
      <h1 className="heading">Vehicle Models</h1>

      <button
        type="button"
        className="vehicle-add__button"
        onClick={() => navigate('/vehicle-models/create')}
        disabled={isDeleting}
      >
        <IoIosAddCircle />
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
          label="Sort By"
          options={sortOptions}
          value={sortField}
          onChange={(e) => setSortField(e.target.value as SortField)}
        />
        <SortSelect
          options={directionOptions}
          value={sortDir}
          onChange={(e) => setSortDir(e.target.value as SortDirection)}
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
}

export default VehicleModelComponent;
