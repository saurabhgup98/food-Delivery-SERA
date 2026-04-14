import React from 'react';
import PrimaryInput from '../Input/PrimaryInput';
import PrimaryCheckbox from '../Input/PrimaryCheckbox';
import PrimaryTextarea from '../Input/PrimaryTextarea';
import PhoneInput from '../Input/PhoneInput';
import DatePrimary from '../Dropdown/DatePrimary';
import PrimaryDropdown from '../Dropdown/PrimaryDropdown';
import MultiSelectDropdown from '../Dropdown/MultiSelectDropdown';

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'date' | 'dropdown' | 'checkbox' | 'textarea' | 'multiselect';
  label: string;
  placeholder?: string;
  value: string | boolean | string[];
  onChange: (value: string | boolean | string[]) => void;
  disabled: boolean;
  options?: { value: string; label: string; icon?: string; iconNode?: React.ReactNode }[];
  countryCode?: string;
  onCountryCodeChange?: (value: string) => void;
  // Textarea specific props
  rows?: number;
  maxLength?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  // Checkbox specific props
  shape?: 'circular' | 'rectangle';
  checkboxSize?: 'sm' | 'md' | 'lg';
  // MultiSelect specific props
  maxSelections?: number;
  showSelectedCount?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  closeOnSelect?: boolean;
}

export interface PrimaryFormProps {
  columns: 1 | 2 | 3 | 4;
  fields: FormField[];
  className?: string;
}

const PrimaryForm: React.FC<PrimaryFormProps> = ({
  columns,
  fields,
  className = ''
}) => {
  // Get grid classes based on columns
  const getGridClasses = (): string => {
    const baseClasses = 'grid gap-3 sm:gap-6';

    switch (columns) {
      case 1:
        return `${baseClasses} grid-cols-1`;
      case 2:
        return `${baseClasses} grid-cols-1 md:grid-cols-2`;
      case 3:
        return `${baseClasses} grid-cols-1 md:grid-cols-2 lg:grid-cols-3`;
      case 4:
        return `${baseClasses} grid-cols-1 md:grid-cols-2 lg:grid-cols-4`;
      default:
        return `${baseClasses} grid-cols-1 md:grid-cols-2`;
    }
  };

  // Render individual form field
  const renderFormField = (field: FormField) => {
    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <PrimaryInput
            key={field.id}
            type={field.type}
            value={field.value as string}
            onChange={field.onChange as (value: string) => void}
            placeholder={field.placeholder}
            label={field.label}
            disabled={field.disabled}
          />
        );

      case 'phone':
        return (
          <PhoneInput
            key={field.id}
            value={field.value as string}
            onChange={field.onChange as (value: string) => void}
            countryCode={field.countryCode || 'IN'}
            onCountryCodeChange={field.onCountryCodeChange || (() => { })}
            placeholder={field.placeholder}
            label={field.label}
            disabled={field.disabled}
          />
        );

      case 'date':
        return (
          <DatePrimary
            key={field.id}
            value={field.value as string}
            onChange={field.onChange as (value: string) => void}
            placeholder={field.placeholder}
            label={field.label}
            disabled={field.disabled}
          />
        );

      case 'dropdown':
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
              {field.label}
            </label>
            <PrimaryDropdown
              value={field.value as string}
              onChange={field.onChange as (value: string) => void}
              options={field.options || []}
              placeholder={field.placeholder}
              disabled={field.disabled}
            />
          </div>
        );

      case 'multiselect':
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
              {field.label}
            </label>
            <MultiSelectDropdown
              options={field.options || []}
              value={field.value as string[]}
              onChange={field.onChange as (values: string[]) => void}
              placeholder={field.placeholder}
              disabled={field.disabled}
              maxSelections={field.maxSelections}
              showSelectedCount={field.showSelectedCount}
              searchable={field.searchable}
              clearable={field.clearable}
              closeOnSelect={field.closeOnSelect}
              size="md"
            />
          </div>
        );

      case 'checkbox':
        return (
          <PrimaryCheckbox
            key={field.id}
            id={field.id}
            checked={field.value as boolean}
            onChange={field.onChange as (checked: boolean) => void}
            label={field.label}
            shape={field.shape}
            checkboxSize={field.checkboxSize}
            disabled={field.disabled}
          />
        );

      case 'textarea':
        return (
          <PrimaryTextarea
            key={field.id}
            id={field.id}
            value={field.value as string}
            onChange={field.onChange as (value: string) => void}
            placeholder={field.placeholder}
            label={field.label}
            rows={field.rows}
            maxLength={field.maxLength}
            resize={field.resize}
            disabled={field.disabled}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`${getGridClasses()} ${className}`}>
      {fields.map((field, index) => (
        <div key={field.id} className="[&_input]:bg-dark-700 [&_input:disabled]:bg-dark-700 [&_button]:bg-dark-700 [&_button:disabled]:bg-dark-700">
          {renderFormField(field)}
        </div>
      ))}
    </div>
  );
};

export default PrimaryForm;