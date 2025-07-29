import React from 'react';

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
    <div
      className="filterControl"
      style={{ marginBottom: 12, display: 'flex', gap: '8px', alignItems: 'center' }}
    >
      <label htmlFor="filterField">Filter by:</label>
      <select
        id="filterField"
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
        placeholder={`Filter by ${filterField}...`}
        value={filterValue}
        onChange={(e) => onFilterValueChange(e.target.value)}
        style={{ flexGrow: 1 }}
      />
    </div>
  );
};

export default FilterControlMake;
