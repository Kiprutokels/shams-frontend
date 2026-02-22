import React from 'react';
import { cn } from '@utils/cn';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  loading?: boolean;
  /** Option to add an icon or element to the right of the header */
  headerAction?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  className,
  hoverable = false,
  loading = false,
  headerAction,
}) => {
  return (
    <div
      className={cn(
        // Using your Neutral Gray (#F5F5F5) for the card and shadow-medical for depth
        'relative bg-white dark:bg-gray-900 rounded-2xl shadow-medical overflow-hidden transition-all duration-300',
        'border border-gray-100 dark:border-gray-800',
        hoverable && 'hover:shadow-lg hover:-translate-y-1 cursor-pointer',
        className
      )}
    >
      {/* Loading Overlay with Backdrop Blur */}
      {loading && (
        <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-2xl">
          <div className="flex flex-col items-center gap-3">
            {/* Primary Blue Spinner (#1976D2) */}
            <svg className="animate-spin h-10 w-10 text-primary" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        </div>
      )}
      
      {/* Header Section */}
      {(title || subtitle || headerAction) && (
        <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
          <div>
            {title && <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-none">{title}</h3>}
            {subtitle && <p className="text-sm text-neutral mt-1.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      
      {/* Content Section */}
      <div className="p-6">{children}</div>
      
      {/* Footer Section - Using Neutral BG (#F5F5F5) */}
      {footer && (
        <div className="px-6 py-4 bg-neutral-bg dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
          {footer}
        </div>
      )}
    </div>
  );
};