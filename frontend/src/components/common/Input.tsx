import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-xs font-bold uppercase tracking-wider text-slate-600">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-3.5 py-2 bg-white border text-slate-900 placeholder-slate-400 rounded-md focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
          error
            ? 'border-red-500 focus:ring-red-200'
            : 'border-slate-300 focus:border-blue-800 focus:ring-blue-100'
        } ${className}`}
        {...props}
      />
      {error ? (
        <span className="text-xs text-red-600 font-semibold">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-slate-500">{helperText}</span>
      ) : null}
    </div>
  );
};
