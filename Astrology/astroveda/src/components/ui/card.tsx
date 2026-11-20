import { type HTMLAttributes, forwardRef } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'ivory' | 'cosmic' | 'midnight';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantClasses = {
  ivory: 'bg-[#F7F3EA] text-midnight border border-gold/20',
  cosmic: 'bg-cosmic text-ivory border border-gold/20',
  midnight: 'bg-midnight text-ivory border border-gold/20',
};

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'ivory', hover = false, padding = 'md', className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          rounded-xl shadow-sm overflow-hidden
          ${variantClasses[variant]}
          ${paddingClasses[padding]}
          ${hover ? 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1' : ''}
          ${className}
        `.trim()}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export function CardHeader({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`mb-4 ${className}`} {...props}>{children}</div>;
}

export function CardTitle({ className = '', children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`text-xl font-heading font-semibold ${className}`} {...props}>{children}</h3>;
}

export function CardDescription({ className = '', children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-sm opacity-80 mt-1 ${className}`} {...props}>{children}</p>;
}

export function CardContent({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...props}>{children}</div>;
}

export function CardFooter({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`mt-4 flex items-center gap-3 ${className}`} {...props}>{children}</div>;
}

