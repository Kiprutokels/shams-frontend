import React from 'react';
import { cn } from '@utils/cn';
import { ThemeToggle } from '@components/common/ThemeToggle/ThemeToggle';
import { Menu, Bell } from 'lucide-react';
import type { User } from '@types';
import type { RoleTheme } from '@components/layout/DashboardLayout/config';

interface HeaderProps {
  onMobileMenuToggle: () => void;
  theme: RoleTheme;
  user: User | null;
}

export const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle, theme, user }) => {
  const portalTitle =
    user?.role === 'PATIENT'
      ? 'Patient Portal'
      : user?.role === 'DOCTOR'
        ? 'Doctor Portal'
        : user?.role === 'ADMIN'
          ? 'Admin Portal'
          : '';

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-black/10 shadow-sm transition-colors duration-500',
        theme.header
      )}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMobileMenuToggle}
          className="p-2 rounded-lg hover:bg-white/10 lg:hidden transition-colors"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
        <h2 className="text-xl font-bold text-white">{portalTitle}</h2>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        <button className="relative p-2 rounded-lg hover:bg-white/10 transition-colors">
          <Bell className="w-5 h-5 text-white" />
          <span className="absolute top-0 right-0 w-5 h-5 bg-[#FB8C00] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-current">
            3
          </span>
        </button>

        <div className="flex items-center gap-3 p-1.5 pr-3 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer transition-all border border-white/10">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0D47A1] font-bold shadow-sm">
            {user?.firstName?.charAt(0)}
            {user?.lastName?.charAt(0)}
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-bold text-white leading-none">
              {user?.firstName} {user?.lastName}
            </div>
            <div className={cn('text-[10px] uppercase tracking-wider font-bold mt-1 opacity-80', theme.subtext)}>
              {user?.role}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
