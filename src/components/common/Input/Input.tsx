import React, { forwardRef } from 'react';
import { cn } from '@utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, fullWidth = false, className, ...props }, ref) => {
    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-0.5">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <span className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200",
              error ? "text-warmRed" : "text-neutral group-focus-within:text-primary"
            )}>
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              // Base Styles: Using SHAMS Neutral Gray for borders
              'w-full px-4 py-2.5 border border-neutral/30 dark:border-gray-700 rounded-xl',
              'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100',
              'placeholder:text-neutral/60 dark:placeholder:text-gray-500',
              
              // Focus State: SHAMS Primary Blue (#1976D2) with soft glow
              'focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10',
              
              // Transition & Layout
              'transition-all duration-200 shadow-sm',
              icon && 'pl-10',
              
              // Error State: SHAMS Warm Red (#E53935)
              error && 'border-warmRed focus:border-warmRed focus:ring-warmRed/10',
              
              className
            )}
            {...props}
          />
        </div>
        
        {/* Error Message using Warm Red */}
        {error && (
          <span className="text-xs font-semibold text-warmRed dark:text-red-400 ml-1 animate-fade-in">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';