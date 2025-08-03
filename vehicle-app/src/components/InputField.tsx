import React from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';

interface InputFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  register: UseFormRegister<any>;
  error?: FieldError;
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  type = 'text',
  placeholder,
  required,
  register,
  error,
  disabled
}) => (
  <div className="vehicle-form__field">
    <label htmlFor={name} className="vehicle-form__label">{label}</label>
    <input
      id={name}
      type={type}
      placeholder={placeholder || label}
      disabled={disabled}
      {...register(name, required ? { required: `${label} is required` } : {})}
      className="vehicle-form__input"
    />
    {error && <p className="vehicle-form__error">{error.message}</p>}
  </div>
);

export default InputField;