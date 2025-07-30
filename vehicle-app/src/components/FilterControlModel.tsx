import React from 'react';
import '../styles/FilterControl.css';

export type FilterFieldModel = 'name' | 'abrv' | 'make_id';

export interface FilterControlModelProps {
  filterField: FilterFieldModel;
  filterValue: string;
  onFilterFieldChange: (field: FilterFieldModel) => void;
  onFilterValueChange: (value: string) => void;
  filterFieldOptions: { value: FilterFieldModel; label: string }[];
  manufacturerOptions: { label: string; value: string }[];
}

const FilterControlModel: React.FC<FilterControlModelProps> = ({
  filterField,
  filterValue,
  onFilterFieldChange,
  onFilterValueChange,
  filterFieldOptions,
  manufacturerOptions,
}) => {
  return (
    <div className="filter-control">
      <label htmlFor="filterField" className="filter-control__label">Filter by:</label>
      <select
        id="filterField"
        className="filter-control__select"
        value={filterField}
        onChange={(e) => onFilterFieldChange(e.target.value as FilterFieldModel)}
      >
        {filterFieldOptions.map((opt) => (
          <option key={opt.value} value={opt.value} className="filter-control__option">
            {opt.label}
          </option>
        ))}
      </select>

      {filterField === 'make_id' ? (
        <select
          className="filter-control__select filter-control__select--manufacturer"
          value={filterValue}
          onChange={(e) => onFilterValueChange(e.target.value)}
        >
          <option value="" className="filter-control__option">All</option>
          {manufacturerOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="filter-control__option">
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          className="filter-control__input"
          placeholder={`Filter by ${filterField === 'abrv' ? 'Abbreviation' : 'Model Name'}...`}
          value={filterValue}
          onChange={(e) => onFilterValueChange(e.target.value)}
        />
      )}
    </div>
  );
};

export default FilterControlModel;
