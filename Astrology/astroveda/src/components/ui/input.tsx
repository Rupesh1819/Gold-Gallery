import { forwardRef, type InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, className = '', ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const errorId = error && inputId ? `${inputId}-error` : undefined;
    const helperId = helperText && inputId ? `${inputId}-helper` : undefined;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-midnight mb-1.5">
            {label}
            {props.required && <span className="text-action ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full rounded-lg border px-4 py-3 text-base text-midnight
            bg-white placeholder:text-midnight/40
            border-cosmic/20 focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none
            transition-colors duration-200
            disabled:bg-ivory/50 disabled:cursor-not-allowed
            ${error ? 'border-danger focus:border-danger focus:ring-danger/30' : ''}
            ${className}
          `.trim()}
          aria-invalid={!!error}
          aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-danger" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-1.5 text-sm text-midnight/60">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

