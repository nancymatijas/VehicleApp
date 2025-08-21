import React, { JSX } from 'react';
import { FieldError, UseFormRegister, RegisterOptions, FieldValues, Path } from 'react-hook-form';

interface InputFieldProps<T extends FieldValues = FieldValues> {
  name: Path<T>;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  register: UseFormRegister<T>;
  validation?: RegisterOptions<T, Path<T>>;
  error?: FieldError;
  disabled?: boolean;
}

const InputField = <T extends FieldValues = FieldValues>({
  name,
  label,
  type = 'text',
  placeholder,
  required,
  register,
  validation = {},
  error,
  disabled,
}: InputFieldProps<T>): JSX.Element => {
  const combinedValidation: RegisterOptions<T, Path<T>> = {
    ...(required ? { required: `${label} is required` } : {}),
    ...validation,
  };

  return (
    <div className="vehicle-form__field">
      <label htmlFor={name} className="vehicle-form__label">{label} {required && '*'}</label>
      <input
        id={name}
        type={type}
        placeholder={placeholder || label}
        disabled={disabled}
        {...register(name, combinedValidation)}
        className="vehicle-form__input"
      />
      {error && <p role="alert" className="error-message">{error.message}</p>}
    </div>
  );
};

export default InputField;
