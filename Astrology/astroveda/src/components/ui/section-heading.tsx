export interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  alignment?: 'left' | 'center';
  light?: boolean;
  className?: string;
}

export function SectionHeading({ title, subtitle, alignment = 'center', light = false, className = '' }: SectionHeadingProps) {
  return (
    <div className={`${alignment === 'center' ? 'text-center' : 'text-left'} mb-10 md:mb-14 ${className}`}>
      <h2 className={`font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-normal ${light ? 'text-ivory' : 'text-midnight'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-base sm:text-lg max-w-2xl font-body ${alignment === 'center' ? 'mx-auto' : ''} ${light ? 'text-ivory/80' : 'text-midnight/70'}`}>
          {subtitle}
        </p>
      )}
      <div className={`mt-4 h-0.5 w-16 ${alignment === 'center' ? 'mx-auto' : ''} bg-gold`} />
    </div>
  );
}

