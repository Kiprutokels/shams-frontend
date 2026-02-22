import React from 'react';
import { useTheme } from '@context/ThemeContext';
import { Sun, Moon } from 'lucide-react'; // Using Lucide for consistent icon weight
import { cn } from '@utils/cn';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        // Using SHAMS palette for background and interaction
        "relative p-2.5 rounded-xl transition-all duration-300 group",
        "bg-neutral-bg dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700",
        "border border-gray-200 dark:border-gray-700 shadow-sm active:scale-90"
      )}
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5 overflow-hidden">
        {/* Sun Icon - For switching to Light mode */}
        <div className={cn(
          "absolute inset-0 transition-transform duration-500",
          theme === 'light' ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}>
          <Sun className="w-5 h-5 text-accent group-hover:rotate-45 transition-transform duration-500" />
        </div>

        {/* Moon Icon - For switching to Dark mode */}
        <div className={cn(
          "absolute inset-0 transition-transform duration-500",
          theme === 'dark' ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
        )}>
          <Moon className="w-5 h-5 text-primary" />
        </div>
      </div>

      {/* Subtle Glow Effect on Hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 bg-primary transition-opacity" />
    </button>
  );
};