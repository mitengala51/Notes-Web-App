import React, { forwardRef } from 'react';

export interface InputProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  icon?: React.ReactNode;
  focused?: boolean;
  disabled?: boolean;
  maxLength?: number;
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'search' | 'email' | 'url';
  pattern?: string;
  autoComplete?: string;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  icon,
  focused = false,
  disabled = false,
  maxLength,
  inputMode,
  pattern,
  autoComplete,
  className = '',
  ...rest
}, ref) => {
  const baseInputClasses = `
    w-full px-4 py-3 border rounded-lg transition-colors duration-200
    ${disabled 
      ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed' 
      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20'
    }
    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20' : ''}
    ${icon ? 'pr-12' : ''}
    ${className}
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          inputMode={inputMode}
          pattern={pattern}
          autoComplete={autoComplete}
          className={baseInputClasses}
          {...rest}
        />
        {icon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
});