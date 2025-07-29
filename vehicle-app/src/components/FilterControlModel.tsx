import React from 'react';

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
    <div
      className="filterControl"
      style={{ marginBottom: 12, display: 'flex', gap: '8px', alignItems: 'center' }}
    >
      <label htmlFor="filterField">Filter by:</label>
      <select
        id="filterField"
        value={filterField}
        onChange={(e) => onFilterFieldChange(e.target.value as FilterFieldModel)}
      >
        {filterFieldOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {filterField === 'make_id' ? (
        <select
          value={filterValue}
          onChange={(e) => onFilterValueChange(e.target.value)}
          style={{ flexGrow: 1 }}
        >
          <option value="">All</option>
          {manufacturerOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          placeholder={`Filter by ${filterField === 'abrv' ? 'Abbreviation' : 'Model Name'}...`}
          value={filterValue}
          onChange={(e) => onFilterValueChange(e.target.value)}
          style={{ flexGrow: 1 }}
        />
      )}
    </div>
  );
};

export default FilterControlModel;
