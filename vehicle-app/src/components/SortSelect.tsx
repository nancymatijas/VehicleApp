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
}

const SortSelect: React.FC<SortSelectProps> = ({
  options,
  value,
  onChange,
  label,
}) => (
  <label className="sort-select" htmlFor="sort-select">
    {label && (
      <span className="sort-select__label">{label}</span>
    )}
    <select
      id="sort-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
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

export default SortSelect;
