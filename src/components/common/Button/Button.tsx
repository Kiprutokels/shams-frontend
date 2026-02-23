import React from 'react';
import { cn } from '@utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Updated variants to match your SHAMS palette
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  disabled,
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';
  
  const variants = {
    // Primary Blue (#1976D2) - Trust & Professionalism
    primary: 'bg-[#1565C0] text-white hover:bg-[#1565C0] shadow-md hover:shadow-lg',
    
    // Secondary Green (#43A047) - Success & Confirmation
    secondary: 'bg-secondary text-white hover:bg-[#388E3C] shadow-md hover:shadow-lg',
    
    // Accent Orange (#FB8C00) - Warnings & Reschedule
    accent: 'bg-accent text-white hover:bg-[#F57C00] shadow-md hover:shadow-lg',
    
    // Outline - Professional Blue border
    outline: 'border-2 border-primary text-primary hover:bg-primary/5 dark:border-primary dark:text-primary',
    
    // Ghost - Subtle interactions
    ghost: 'text-neutral hover:bg-neutral-bg dark:text-gray-400 dark:hover:bg-gray-800',
    
    // Warm Red (#E53935) - Errors & No-shows
    danger: 'bg-warmRed text-white hover:bg-[#D32F2F] shadow-md hover:shadow-lg',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        loading && 'cursor-wait',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Processing...</span>
        </div>
      ) : (
        <>
          {icon && <span className="flex items-center">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};