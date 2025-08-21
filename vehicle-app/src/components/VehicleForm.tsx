import React, { JSX } from 'react';
import {
  useForm,
  SubmitHandler,
  FieldValues,
  DefaultValues,
  Path,
  RegisterOptions,
  FieldError,
} from "react-hook-form";

import InputField from '../components/InputField';
import SelectField from '../components/SelectField';
import '../styles/VehicleForm.css';

export interface Option {
  label: string;
  value: string | number;
}

export interface FieldConfig {
  label: string;
  name: string;
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  validate?: (value: unknown) => boolean | string;
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
}: VehicleFormProps<T>): JSX.Element {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<T>({ defaultValues: defaultValues as DefaultValues<T> });

  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const wrappedSubmit = (data: T) => onSubmit(data);

  function isFieldError(value: unknown): value is FieldError {
    return typeof value === "object" && value !== null && "message" in value;
  }

  function getFieldError(name: Path<T>): FieldError | undefined {
    const error = errors[name];
    if (isFieldError(error)) {
      return error;
    }
    return undefined;
  }

  return (
    <div className="vehicle-form-container">
    <form 
      onSubmit={handleSubmit(wrappedSubmit)}
      className="vehicle-form"
    >
      {fields.map((field) => {
        const validationRules: RegisterOptions<T, Path<T>> = {
          ...(field.required && { required: `${field.label} is required.` }),
          ...(field.pattern && { pattern: { value: field.pattern, message: `Invalid ${field.label} format.` } }),
          ...(field.minLength && { minLength: { value: field.minLength, message: `${field.label} must be at least ${field.minLength} characters.` } }),
          ...(field.maxLength && { maxLength: { value: field.maxLength, message: `${field.label} must be at most ${field.maxLength} characters.` } }),
          ...(field.validate && { validate: field.validate }),
        };

        const error = getFieldError(field.name as Path<T>);

        return (
          <InputField<T>
            key={field.name}
            name={field.name as Path<T>}
            label={field.label}
            type={field.type}
            placeholder={field.placeholder}
            required={field.required}
            register={register}
            validation={validationRules}
            error={error}
            disabled={isSubmitting}
          />
        );
      })}

      {selectFields?.map((selectField) => {
        const validationRules: RegisterOptions<T, Path<T>> = {
          ...(selectField.required && { required: `${selectField.label} is required.` }),
          ...(selectField.validate && { validate: selectField.validate }),
        };

        const error = getFieldError(selectField.name as Path<T>);

        return (
          <SelectField<T>
            key={selectField.name}
            name={selectField.name as Path<T>}
            label={selectField.label}
            options={selectField.options}
            required={selectField.required}
            disabled={selectField.disabled || isSubmitting}
            register={register}
            validation={validationRules}
            error={error}
          />
        );
      })}

    <div className="vehicle-form__actions">
      <button
        type="submit"
        disabled={isSubmitting}
        className={`vehicle-form__button${isSubmitting ? ' vehicle-form__button--disabled' : ''}`}
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
      </div>
      
      {errorMessage && (
        <div className="vehicle-form__error-message">
          {errorMessage}
        </div>
      )}
    </form>
    </div>
  );
}

export default VehicleForm;
