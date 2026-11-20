import { forwardRef, type TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
  showCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, maxLength, showCount, id, value, className = '', ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const errorId = error && textareaId ? `${textareaId}-error` : undefined;
    const charCount = typeof value === 'string' ? value.length : 0;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-midnight mb-1.5">
            {label}
            {props.required && <span className="text-action ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          maxLength={maxLength}
          className={`
            w-full rounded-lg border px-4 py-3 text-base text-midnight min-h-[120px]
            bg-white placeholder:text-midnight/40 resize-y
            border-cosmic/20 focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none
            transition-colors duration-200
            ${error ? 'border-danger focus:border-danger focus:ring-danger/30' : ''}
            ${className}
          `.trim()}
          aria-invalid={!!error}
          aria-describedby={errorId}
          {...props}
        />
        <div className="flex justify-between items-center mt-1.5">
          {error ? (
            <p id={errorId} className="text-sm text-danger" role="alert">{error}</p>
          ) : helperText ? (
            <p className="text-sm text-midnight/60">{helperText}</p>
          ) : <span />}
          {showCount && maxLength && (
            <span className={`text-xs ${charCount > maxLength * 0.9 ? 'text-danger' : 'text-midnight/40'}`}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

