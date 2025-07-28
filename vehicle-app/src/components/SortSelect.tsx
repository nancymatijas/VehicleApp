import React from 'react';

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

const SortSelect: React.FC<SortSelectProps> = ({ options, value, onChange, label }) => (
  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
    {label && <span>{label}</span>}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ padding: '4px 8px', fontSize: 14 }}
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
