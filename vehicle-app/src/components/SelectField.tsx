import React, { JSX } from 'react';
import { FieldError, UseFormRegister, RegisterOptions, FieldValues, Path } from 'react-hook-form';

interface Option {
  label: string;
  value: string | number;
}

interface SelectFieldProps<T extends FieldValues = FieldValues> {
  name: Path<T>;
  label: string;
  options: Option[];
  required?: boolean;
  disabled?: boolean;
  register: UseFormRegister<T>;
  validation?: RegisterOptions<T, Path<T>>;
  error?: FieldError;
}

const SelectField = <T extends FieldValues = FieldValues>({
  name,
  label,
  options,
  required,
  disabled,
  register,
  validation = {},
  error,
}: SelectFieldProps<T>): JSX.Element => {
  const combinedValidation: RegisterOptions<T, Path<T>> = required
    ? { required: `${label} is required`, ...validation }
    : { ...validation };

  return (
    <div className="vehicle-form__field">
      <label htmlFor={name} className="vehicle-form__label">{label} {required && '*'}</label>
      <select
        id={name}
        disabled={disabled}
        {...register(name, combinedValidation)}
        className="vehicle-form__select"
      >
        <option value="">{`Select ${label}`}</option>
        {options.map(({ label: optLabel, value }) => (
          <option key={value} value={value}>
            {optLabel}
          </option>
        ))}
      </select>
      {error && <p role="alert" className="error-message">{error.message}</p>}
    </div>
  );
};

export default SelectField;
