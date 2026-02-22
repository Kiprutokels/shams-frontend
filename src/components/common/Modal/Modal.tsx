import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react'; // Using Lucide for a cleaner "X" icon
import { cn } from '@utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',     // Small alerts
    md: 'max-w-2xl',    // Standard forms
    lg: 'max-w-4xl',    // Detailed patient records
    xl: 'max-w-6xl',    // Analytics/Data tables
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-navy/40 backdrop-blur-md flex items-center justify-center z-[10000] p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className={cn(
          'bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-h-[95vh] flex flex-col animate-slide-up',
          'border border-gray-100 dark:border-gray-800',
          sizes[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-50 dark:border-gray-800">
          <div>
            {title && <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-neutral hover:text-warmRed transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="px-8 py-6 overflow-y-auto flex-1 custom-scrollbar">
          {children}
        </div>
        
        {/* Modal Footer - Using SHAMS Neutral Gray BG (#F5F5F5) */}
        {footer && (
          <div className="px-8 py-5 bg-neutral-bg dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};