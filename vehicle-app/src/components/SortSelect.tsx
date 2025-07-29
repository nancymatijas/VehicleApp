import React from 'react';
import '../styles/PaginationSort.css';

export type SortOption = {
  value: string;
  label: string;
};

interface SortSelectProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  id?: string;
}

const SortSelect: React.FC<SortSelectProps> = ({
  options,
  value,
  onChange,
  label,
  id,
}) => {
  const generatedId = React.useId ? React.useId() : 'sort-select';

  return (
    <label className="sort-select" htmlFor={id ?? generatedId}>
      {label && <span className="sort-select__label">{label}</span>}
      <select
        id={id ?? generatedId}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        className="sort-select__select"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
};

export default SortSelect;
