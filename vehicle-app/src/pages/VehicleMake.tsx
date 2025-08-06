import React from 'react';
import { IoIosAddCircle } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  useGetVehicleMakesQuery,
  useDeleteVehicleMakeMutation,
  VehicleMake,
  SortField,
  SortDirection 
} from '../api/vehicleMakeApi';
import PaginationControl from '../components/PaginationControl';
import EntityTable, { Column } from '../components/EntityTable';
import FilterControlMake, { FilterFieldMake } from '../components/FilterControlMake';
import SortSelect from '../components/SortSelect';
import { handleEditMake, handleDeleteMake } from '../utils/vehicleHandlers';
import { usePersistentState } from '../utils/usePersistentState';
import { sortOptionsMake, filterFieldOptionsMake, directionOptions } from '../utils/constants';

const LS_KEY = 'vehicleMakeListState';

interface VehicleMakeListState {
  sortField: SortField;
  sortDir: SortDirection;
  page: number;
  pageSize: number;
  filterField: FilterFieldMake;
  filterValue: string;
}

const defaultUiState: VehicleMakeListState = {
  sortField: 'name',
  sortDir: 'asc',
  page: 1,
  pageSize: 5,
  filterField: 'name',
  filterValue: '',
};

function VehicleMakeComponent(): React.JSX.Element {
  const navigate = useNavigate();

  const [uiState, setUiState] = usePersistentState<VehicleMakeListState>(LS_KEY, defaultUiState);

  const { sortField, sortDir, page, pageSize, filterField, filterValue } = uiState;

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

  function onEdit(make: VehicleMake): void {
    handleEditMake(make, navigate);
  }

  async function onDelete(id: number): Promise<void> {
    await handleDeleteMake(id, (id) => deleteVehicleMake(id).unwrap());
  }

  return (
    <motion.div 
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="heading">Vehicle Manufacturers</h1>

      <button
        type="button"
        className="vehicle-add__button"
        onClick={() => navigate('/vehicle-makes/create')}
        disabled={isDeleting}
        aria-label="Add new vehicle make"
      >
        <IoIosAddCircle />
      </button>

      <FilterControlMake
        filterField={filterField}
        filterValue={filterValue}
        onFilterFieldChange={(field) => setUiState(s => ({ ...s, filterField: field, page: 1 }))}
        onFilterValueChange={(value) => setUiState(s => ({ ...s, filterValue: value, page: 1 }))}
        filterFieldOptions={filterFieldOptionsMake}
      />

      <div className="sortControls">
        <SortSelect
          label="Sort By"
          options={sortOptionsMake}
          value={sortField}
          onChange={(e) => setUiState(s => ({ ...s, sortField: e.target.value as SortField }))}
        />
        <SortSelect
          options={directionOptions}
          value={sortDir}
          onChange={(e) => setUiState(s => ({ ...s, sortDir: e.target.value as SortDirection }))}
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
            onPrev={() => setUiState(s => ({ ...s, page: Math.max(1, s.page - 1) }))}
            onNext={() => {
              if (makes.length === pageSize) setUiState(s => ({ ...s, page: s.page + 1 }));
            }}
            disablePrev={page === 1}
            disableNext={!makes || makes.length < pageSize}
            onPageSizeChange={(size) => setUiState(s => ({ ...s, pageSize: size, page: 1 }))}
          />
        </>
      )}
    </motion.div>
  );
}

export default VehicleMakeComponent;
