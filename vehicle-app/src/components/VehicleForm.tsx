import React from 'react';

export interface Option {
  label: string;
  value: string | number;
}

interface VehicleFormProps<T> {
  formData: T;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  errorMessage?: string | null;
  onCancel?: () => void;
  isEditMode: boolean;
  fields: Array<{
    label: string;
    name: keyof T;
    placeholder?: string;
    required?: boolean;
    type?: string;
  }>;
  selectFields?: Array<{
    label: string;
    name: keyof T;
    options: Option[];
    required?: boolean;
    disabled?: boolean;
  }>;
}

function VehicleForm<T>({
  formData,
  onChange,
  onSubmit,
  isSubmitting,
  errorMessage,
  onCancel,
  isEditMode,
  fields,
  selectFields,
}: VehicleFormProps<T>) {
  return (
    <form onSubmit={onSubmit} style={{ marginBottom: 20 }}>
      {fields.map(({ label, name, placeholder, required, type = 'text' }) => (
        <input
          key={String(name)}
          name={String(name)}
          placeholder={placeholder || label}
          type={type}
          value={formData[name] as unknown as string}
          onChange={onChange}
          required={required}
          disabled={isSubmitting}
          style={{ marginRight: 10 }}
        />
      ))}

      {selectFields &&
        selectFields.map(({ label, name, options, required, disabled }) => (
          <select
            key={String(name)}
            name={String(name)}
            value={formData[name] as unknown as string | number}
            onChange={onChange}
            required={required}
            disabled={disabled || isSubmitting}
            style={{ marginRight: 10 }}
          >
            <option value="">Select {label}</option>
            {options.map(({ label: optLabel, value }) => (
              <option key={String(value)} value={value}>
                {optLabel}
              </option>
            ))}
          </select>
        ))}

      <button type="submit" disabled={isSubmitting}>
        {isEditMode ? 'Save' : 'Add'}
      </button>

      {isEditMode && onCancel && (
        <button type="button" onClick={onCancel} disabled={isSubmitting} style={{ marginLeft: 10 }}>
          Cancel
        </button>
      )}

      {errorMessage && <div style={{ color: 'red', marginTop: 8 }}>{errorMessage}</div>}
    </form>
  );
}

export default VehicleForm;
