import React from 'react';
import '../styles/PaginationSort.css';

export type SortOption = {
  value: string;
  label: string;
};

interface SortSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SortOption[];
  label?: string;
  id?: string;
}

const SortSelect = React.forwardRef<HTMLSelectElement, SortSelectProps>(
  ({ options, label, id, ...rest }, ref) => {
    const generatedId = React.useId();
    const selectId = id ?? generatedId;

    return (
      <label className="sort-select" htmlFor={selectId}>
        {label && <span className="sort-select__label">{label}</span>}
        <select
          id={selectId}
          ref={ref}
          {...rest}
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
  }
);

SortSelect.displayName = 'SortSelect';
export default SortSelect;