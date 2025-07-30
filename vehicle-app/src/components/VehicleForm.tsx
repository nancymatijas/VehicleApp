import React from 'react';
import { useForm, SubmitHandler, FieldValues, DefaultValues } from 'react-hook-form';
import '../styles/VehicleForm.css';

export interface Option {
  label: string;
  value: string | number;
}

export interface FieldConfig {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
}

export interface SelectFieldConfig extends FieldConfig {
  options: Option[];
  disabled?: boolean;
}

interface VehicleFormProps<T extends FieldValues> {
  defaultValues: T;
  fields: FieldConfig[];
  selectFields?: SelectFieldConfig[];
  onSubmit: SubmitHandler<T>;
  isSubmitting: boolean;
  errorMessage?: string | null;
  onCancel?: () => void;
  isEditMode: boolean;
}

function VehicleForm<T extends FieldValues>({
  defaultValues,
  fields,
  selectFields,
  onSubmit,
  isSubmitting,
  errorMessage,
  onCancel,
  isEditMode,
}: VehicleFormProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<T>({
    defaultValues: defaultValues as DefaultValues<T>,
  });

  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const wrappedSubmit = (data: FieldValues) => {
    return onSubmit(data as T);
  };

  return (
    <form
      onSubmit={handleSubmit(wrappedSubmit)}
      className="vehicle-form"
    >
      {fields.map(({ label, name, required, type = 'text', placeholder }) => (
        <div
          key={name}
          className="vehicle-form__field"
        >
          <label
            htmlFor={name}
            className="vehicle-form__label"
          >
            {label}
          </label>
          <input
            id={name}
            type={type}
            placeholder={placeholder || label}
            disabled={isSubmitting}
            {...register(
              name as any,
              required ? { required: `${label} is required` } : {},
            )}
            className="vehicle-form__input"
          />
          {errors[name] && (
            <p className="vehicle-form__error">
              {(errors[name] as any).message}
            </p>
          )}
        </div>
      ))}

      {selectFields && selectFields.map(({ label, name, options, required, disabled }) => (
        <div
          key={name}
          className="vehicle-form__field"
        >
          <label
            htmlFor={name}
            className="vehicle-form__label"
          >
            {label}
          </label>
          <select
            id={name}
            disabled={disabled || isSubmitting}
            {...register(
              name as any,
              required
                ? { required: `${label} is required`, valueAsNumber: true }
                : { valueAsNumber: true },
            )}
            className="vehicle-form__select"
          >
            <option value="">
              {`Select ${label}`}
            </option>
            {options.map(({ label: optLabel, value }) => (
              <option
                key={value}
                value={value}
              >
                {optLabel}
              </option>
            ))}
          </select>
          {errors[name] && (
            <p className="vehicle-form__error">
              {(errors[name] as any).message}
            </p>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`vehicle-form__button${isSubmitting ? ' vehicle-form__button--disabled' : ''}`}
        style={{ marginRight: isEditMode && onCancel ? 8 : 0 }}
      >
        {isEditMode ? 'Save' : 'Add'}
      </button>

      {onCancel && (
        <button
          type="button"
          onClick={() => {
            reset(defaultValues);
            onCancel();
          }}
          disabled={isSubmitting}
          className="vehicle-form__button vehicle-form__button--cancel"
        >
          Cancel
        </button>
      )}

      {errorMessage && (
        <div className="vehicle-form__error-message">
          {errorMessage}
        </div>
      )}
    </form>
  );
}

export default VehicleForm;
