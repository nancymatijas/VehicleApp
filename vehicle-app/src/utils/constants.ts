import { SortOption } from '../components/SortSelect';
import { FilterFieldMake } from '../components/FilterControlMake';
import { FilterFieldModel } from '../components/FilterControlModel';
import { FieldConfig } from '../components/VehicleForm';

export const fields: FieldConfig[] = [
  { 
    label: 'Name', 
    name: 'name', 
    required: true,
    minLength: 2,
    maxLength: 20,
  pattern: /^[A-Za-z0-9 \-]+$/,
  },
  { 
    label: 'Abbreviation', 
    name: 'abrv',
    maxLength: 10,
  },
];

export const sortOptionsMake: SortOption[] = [
  { value: 'name', label: 'Name' },
  { value: 'abrv', label: 'Abbreviation' },
  { value: 'id', label: 'ID' },
];

export const filterFieldOptionsMake: { value: FilterFieldMake; label: string }[] = [
  { value: 'name', label: 'Name' },
  { value: 'abrv', label: 'Abbreviation' },
];

export const sortOptionsModel: SortOption[] = [
  { value: 'name', label: 'Model Name' },
  { value: 'abrv', label: 'Abbreviation' },
  { value: 'id', label: 'ID' },
  { value: 'make_id', label: 'Manufacturer' },
];

export const filterFieldOptionsModel: { value: FilterFieldModel; label: string }[] = [
  { value: 'name', label: 'Model Name' },
  { value: 'abrv', label: 'Abbreviation' },
  { value: 'make_id', label: 'Manufacturer' },
];

export const directionOptions: SortOption[] = [
  { value: 'asc', label: 'ASC' },
  { value: 'desc', label: 'DESC' },
];
