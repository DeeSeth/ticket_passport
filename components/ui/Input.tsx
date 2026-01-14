'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  dark?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, dark = false, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    const labelStyles = dark
      ? 'block text-sm font-medium text-neutral-300 mb-1'
      : 'block text-sm font-medium text-gray-700 mb-1';

    const inputStyles = dark
      ? `w-full px-4 py-2.5 rounded-lg border bg-neutral-800 text-white placeholder-neutral-500
         transition-colors duration-200
         focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent
         ${error ? 'border-red-500 focus:ring-red-500' : 'border-neutral-700'}`
      : `w-full px-4 py-2.5 rounded-lg border text-gray-900 placeholder-gray-400
         transition-colors duration-200
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
         ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`;

    const errorStyles = dark ? 'mt-1 text-sm text-red-400' : 'mt-1 text-sm text-red-600';
    const helperStyles = dark ? 'mt-1 text-sm text-neutral-500' : 'mt-1 text-sm text-gray-500';

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className={labelStyles}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`${inputStyles} ${className}`}
          {...props}
        />
        {error && (
          <p className={errorStyles}>{error}</p>
        )}
        {helperText && !error && (
          <p className={helperStyles}>{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
