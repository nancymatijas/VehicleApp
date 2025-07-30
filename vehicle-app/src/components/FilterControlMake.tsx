import React from 'react';
import '../styles/FilterControl.css';

export type FilterFieldMake = 'name' | 'abrv';

export interface FilterControlMakeProps {
  filterField: FilterFieldMake;
  filterValue: string;
  onFilterFieldChange: (field: FilterFieldMake) => void;
  onFilterValueChange: (value: string) => void;
  filterFieldOptions: { value: FilterFieldMake; label: string }[];
}

const FilterControlMake: React.FC<FilterControlMakeProps> = ({
  filterField,
  filterValue,
  onFilterFieldChange,
  onFilterValueChange,
  filterFieldOptions,
}) => {
  return (
    <div className="filter-control">
      <label htmlFor="filterField" className="filter-control__label">Filter by:</label>
      <select
        id="filterField"
        className="filter-control__select"
        value={filterField}
        onChange={(e) => onFilterFieldChange(e.target.value as FilterFieldMake)}
      >
        {filterFieldOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <input
        type="text"
        className="filter-control__input"
        placeholder={`Filter by ${filterField === 'abrv' ? 'Abbreviation' : 'Name'}...`}
        value={filterValue}
        onChange={(e) => onFilterValueChange(e.target.value)}
      />
    </div>
  );
};

export default FilterControlMake;
