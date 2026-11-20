import { forwardRef, type InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    const checkboxId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : `cb-${Math.random().toString(36).substring(2, 7)}`);
    const errorId = error ? `${checkboxId}-error` : undefined;

    return (
      <div className="w-full">
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              className={`
                peer h-5 w-5 rounded border-2 border-cosmic/30
                checked:bg-action checked:border-action
                focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus:outline-none
                transition-colors cursor-pointer appearance-none bg-white
                ${error ? 'border-danger' : ''}
                ${className}
              `.trim()}
              aria-invalid={!!error}
              aria-describedby={errorId}
              {...props}
            />
            <Check className="absolute top-0.5 left-0.5 h-4 w-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
          </div>
          {label && (
            <label htmlFor={checkboxId} className="text-sm text-midnight cursor-pointer select-none leading-relaxed">
              {label}
            </label>
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

