import React from 'react';
import { useForm, SubmitHandler, FieldValues, DefaultValues } from 'react-hook-form';
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
    <div className="vehicle-form-container">
      <form 
        onSubmit={handleSubmit(wrappedSubmit)} 
        className="vehicle-form"
      >
        {fields.map(field => (
          <InputField
            key={field.name}
            name={field.name}
            label={field.label}
            type={field.type}
            placeholder={field.placeholder}
            required={field.required}
            register={register}
            disabled={isSubmitting}
          />
        ))}

        {selectFields?.map(selectField => (
          <SelectField
            key={selectField.name}
            name={selectField.name}
            label={selectField.label}
            options={selectField.options}
            required={selectField.required}
            disabled={selectField.disabled || isSubmitting}
            register={register}
          />
        ))}

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