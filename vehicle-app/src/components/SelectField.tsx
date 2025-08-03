import React from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';

interface Option {
  label: string;
  value: string | number;
}

interface SelectFieldProps {
  name: string;
  label: string;
  options: Option[];
  required?: boolean;
  disabled?: boolean;
  register: UseFormRegister<any>;
  error?: FieldError;
}

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  options,
  required,
  disabled,
  register,
  error
}) => (
  <div className="vehicle-form__field">
    <label htmlFor={name} className="vehicle-form__label">{label}</label>
    <select
      id={name}
      disabled={disabled}
      {...register(name, required
        ? { required: `${label} is required`, valueAsNumber: true }
        : { valueAsNumber: true }
      )}
      className="vehicle-form__select"
    >
      <option value="">{`Select ${label}`}</option>
      {options.map(({ label: optLabel, value }) => (
        <option key={value} value={value}>{optLabel}</option>
      ))}
    </select>
    {error && <p className="vehicle-form__error">{error.message}</p>}
  </div>
);

export default SelectField;