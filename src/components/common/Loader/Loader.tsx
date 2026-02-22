import React from 'react';
import { cn } from '@utils/cn';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  text = "Loading patient data...",
  fullScreen = false,
}) => {
  const sizes = {
    // Border thicknesses adjusted for SHAMS professionalism
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-[3px]',
    lg: 'h-20 w-20 border-4',
  };

  const content = (
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        {/* Static Background Ring - Neutral Gray (#F5F5F5) */}
        <div className={cn(
          "rounded-full border-neutral-bg absolute inset-0",
          sizes[size]
        )} />
        
        {/* Animated Primary Ring - SHAMS Primary Blue (#1976D2) */}
        <svg 
          className={cn(
            'animate-spin text-primary relative z-10', 
            sizes[size]
          )} 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-10" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4" 
            fill="none" 
          />
          <path 
            className="opacity-100" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
          />
        </svg>
      </div>

      {text && (
        <div className="flex flex-col items-center">
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300 tracking-wide uppercase">
            {text}
          </p>
          <div className="flex gap-1 mt-1">
             <span className="w-1 h-1 bg-primary rounded-full animate-bounce" />
             <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
             <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-950/90 backdrop-blur-md flex items-center justify-center z-[9999]">
        {content}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-8">{content}</div>;
};