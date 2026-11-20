'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItemProps {
  id: string;
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ id, title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = `accordion-content-${id}`;
  const triggerId = `accordion-trigger-${id}`;

  return (
    <div className="border-b border-cosmic/15 last:border-b-0">
      <h3>
        <button
          id={triggerId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between py-4 text-left text-base font-medium text-midnight hover:text-gold-ink transition-colors min-h-[44px] cursor-pointer"
        >
          <span className="font-semibold pr-4">{title}</span>
          <ChevronDown
            className={`h-5 w-5 text-gold shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </h3>
      <div
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="text-midnight/80 text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

export interface AccordionProps {
  children: ReactNode;
  className?: string;
}

export function Accordion({ children, className = '' }: AccordionProps) {
  return (
    <div className={`divide-y divide-cosmic/15 ${className}`}>
      {children}
    </div>
  );
}

