// src/components/admin/FormField.tsx
import { UseFormRegister, FieldError, Path, FieldValues } from 'react-hook-form';
import { ReactNode } from 'react';

interface FormFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;  // Path<T> asegura que el nombre existe en el tipo del formulario
  register: UseFormRegister<T>;
  error?: FieldError;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  type?: string;
  rows?: number;
  helperText?: string;
  icon?: ReactNode;
  children?: ReactNode;
}

export function FormField<T extends FieldValues>({
  label,
  name,
  register,
  error,
  required = false,
  disabled = false,
  placeholder,
  type = 'text',
  rows,
  helperText,
  icon,
  children,
}: FormFieldProps<T>) {
  const inputClasses = `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
    error ? 'border-red-500' : 'border-gray-300'
  } ${icon ? 'pl-10' : ''}`;

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {icon}
          </div>
        )}
        
        {children ? children : (
          rows ? (
            <textarea
              id={name}
              rows={rows}
              className={inputClasses}
              placeholder={placeholder}
              disabled={disabled}
              {...register(name)}
            />
          ) : (
            <input
              type={type}
              id={name}
              className={inputClasses}
              placeholder={placeholder}
              disabled={disabled}
              {...register(name)}
            />
          ))}
      </div>
      
      {error && (
        <p className="text-red-500 text-sm mt-1">{error.message}</p>
      )}
      
      {helperText && !error && (
        <p className="text-gray-400 text-xs mt-1">{helperText}</p>
      )}
    </div>
  );
}