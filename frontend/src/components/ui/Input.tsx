// import React from 'react';

// interface InputProps {
//   label: string;
//   type?: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   placeholder?: string;
//   required?: boolean;
//   className?: string;
//   icon?: React.ReactNode;
//   error?: string;
//   focused?: boolean;
// }

// export const Input: React.FC<InputProps> = ({
//   label,
//   type = 'text',
//   value,
//   onChange,
//   placeholder,
//   required = false,
//   className = '',
//   icon,
//   error,
//   focused = false,
// }) => {
//   const labelColorClass = focused ? 'text-blue-500' : 'text-gray-700';
//   const borderColorClass = focused ? 'border-2 border-blue-500' : 'border border-gray-300';
//   const bgClass = focused ? 'bg-white' : 'bg-gray-50 lg:bg-white';

//   return (
//     <div className={className}>
//       <label className={`block text-sm font-medium mb-2 ${labelColorClass}`}>
//         {label}
//       </label>
//       <div className="relative">
//         <input
//           type={type}
//           value={value}
//           onChange={onChange}
//           placeholder={placeholder}
//           required={required}
//           className={`w-full px-4 py-3.5 lg:py-3 ${borderColorClass} rounded-xl lg:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-base ${bgClass} ${icon ? 'pr-12' : ''}`}
//         />
//         {icon && (
//           <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
//             {icon}
//           </div>
//         )}
//       </div>
//       {error && (
//         <p className="mt-1 text-sm text-red-500">{error}</p>
//       )}
//     </div>
//   );
// };








// components/ui/Input.tsx
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