import React from 'react';
import { IoIosAddCircle } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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

import { usePersistentState } from '../utils/usePersistentState';

const LS_KEY = 'vehicleModelListState';

interface VehicleModelListState {
  sortField: SortField;
  sortDir: SortDirection;
  page: number;
  pageSize: number;
  filterField: FilterFieldModel;
  filterValue: string;
}

const defaultUiState: VehicleModelListState = {
  sortField: 'name',
  sortDir: 'asc',
  page: 1,
  pageSize: 5,
  filterField: 'name',
  filterValue: '',
};

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

  const [uiState, setUiState] = usePersistentState<VehicleModelListState>(
    LS_KEY,
    defaultUiState,
  );

  const { sortField, sortDir, page, pageSize, filterField, filterValue } = uiState;

  const { data: makes, isLoading: isLoadingMakes } = useGetVehicleMakesQuery();

  const manufacturerOptions = makes
    ? makes.map(make => ({ label: make.name, value: make.id.toString() }))
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
    await handleDeleteModel(id, id => deleteVehicleModel(id).unwrap());
  }

  return (
    <motion.div
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="heading">Vehicle Models</h1>

      <button
        type="button"
        className="vehicle-add__button"
        onClick={() => navigate('/vehicle-models/create')}
        disabled={isDeleting}
        aria-label="Add new vehicle model"
      >
        <IoIosAddCircle />
      </button>

      <FilterControlModel
        filterField={filterField}
        filterValue={filterValue}
        onFilterFieldChange={(field) => setUiState(s => ({ ...s, filterField: field, page: 1 }))}
        onFilterValueChange={(value) => setUiState(s => ({ ...s, filterValue: value, page: 1 }))}
        filterFieldOptions={filterFieldOptionsModel}
        manufacturerOptions={manufacturerOptions}
      />

      <div className="sortControls">
        <SortSelect
          label="Sort By"
          options={sortOptions}
          value={sortField}
          onChange={(e) => setUiState(s => ({ ...s, sortField: e.target.value as SortField }))}
        />
        <SortSelect
          options={directionOptions}
          value={sortDir}
          onChange={(e) => setUiState(s => ({ ...s, sortDir: e.target.value as SortDirection }))}
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
            onPrev={() => setUiState(s => ({ ...s, page: Math.max(s.page - 1, 1) }))}
            onNext={() => {
              if (models.length === pageSize) {
                setUiState(s => ({ ...s, page: s.page + 1 }));
              }
            }}
            disablePrev={page === 1}
            disableNext={!models || models.length < pageSize}
            onPageSizeChange={(size) => setUiState(s => ({ ...s, pageSize: size, page: 1 }))}
          />
        </>
      )}
    </motion.div>
  );
}

export default VehicleModelComponent;
