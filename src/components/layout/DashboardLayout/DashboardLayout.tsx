import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { logout } from '@store/slices/authSlice';
import { ThemeToggle } from '@components/common/ThemeToggle/ThemeToggle';
import { Footer } from '@components/layout/Footer';
import { cn } from '@utils/cn';
import {
  Home,
  Calendar,
  FileText,
  Clock,
  BookOpen,
  User,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Bell,
  Activity,
} from 'lucide-react';

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
}

export const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems: Record<string, MenuItem[]> = {
    PATIENT: [
      { icon: Home, label: 'Dashboard', path: '/patient/dashboard' },
      { icon: Calendar, label: 'Book Appointment', path: '/patient/book-appointment' },
      { icon: FileText, label: 'My Appointments', path: '/patient/appointments' },
      { icon: Clock, label: 'Queue Status', path: '/patient/queue-status' },
      { icon: BookOpen, label: 'Medical History', path: '/patient/medical-history' },
      { icon: User, label: 'Profile', path: '/patient/profile' },
    ],
    DOCTOR: [
      { icon: Home, label: 'Dashboard', path: '/doctor/dashboard' },
      { icon: Calendar, label: 'Schedule', path: '/doctor/schedule' },
      { icon: Users, label: 'Queue Management', path: '/doctor/queue' },
      { icon: FileText, label: 'Appointments', path: '/doctor/appointments' },
      { icon: User, label: 'Profile', path: '/doctor/profile' },
    ],
    ADMIN: [
      { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
      { icon: Users, label: 'Users', path: '/admin/users' },
      { icon: Calendar, label: 'Appointments', path: '/admin/appointments' },
      { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
      { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ],
    NURSE: [],
  };

  const currentMenu = user ? menuItems[user.role] : [];

// 1. Define the Theme Mapping based on your Palette guidelines
  const roleThemes: Record<string, { sidebar: string; header: string; active: string; text: string; subtext: string }> = {
    PATIENT: {
      sidebar: 'bg-[#0D47A1]', // Deep Navy
      header: 'bg-[#1976D2]',  // Primary Blue
      active: 'bg-[#1976D2]',  // Primary Blue
      text: 'text-white',
      subtext: 'text-blue-100'
    },
    DOCTOR: {
      sidebar: 'bg-[#004D40]', // Dark Teal
      header: 'bg-[#26A69A]',  // Soft Teal
      active: 'bg-[#26A69A]',  // Soft Teal
      text: 'text-white',
      subtext: 'text-teal-50'
    },
    ADMIN: {
      sidebar: 'bg-[#1A1A1A]', // Neutral Dark
      header: 'bg-[#0D47A1]',  // Deep Navy
      active: 'bg-[#0D47A1]',  // Deep Navy
      text: 'text-white',
      subtext: 'text-gray-300'
    }
  };

  const theme = roleThemes[user?.role || 'PATIENT'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 shadow-2xl',
          theme.sidebar, // DYNAMIC SIDEBAR COLOR
          sidebarOpen ? 'w-64' : 'w-20',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
              <Activity className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && <span className="text-xl font-bold tracking-tight text-white">SHAMS</span>}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors hidden lg:block"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5 text-white/70" />
            ) : (
              <ChevronRight className="w-5 h-5 text-white/70" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {currentMenu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-4 px-4 py-3 transition-all relative group',
                  isActive
                    ? `${theme.active} text-white shadow-lg` // DYNAMIC ACTIVE BUTTON
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-white rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                )}
                
                <item.icon className={cn(
                  "w-6 h-6 shrink-0 transition-colors",
                  isActive ? "text-white" : "text-white/50 group-hover:text-white"
                )} />
                
                {sidebarOpen && <span className="font-semibold">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 bg-[#E53935]/10 hover:bg-[#E53935] rounded-xl transition-all text-[#E53935] hover:text-white group"
          >
            <LogOut className="w-6 h-6 shrink-0 group-hover:scale-110 transition-transform" />
            {sidebarOpen && <span className="font-semibold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className={cn('flex-1 flex flex-col min-w-0', sidebarOpen ? 'lg:ml-64' : 'lg:ml-20')}>
        {/* Top Bar */}
        <header className={cn(
          "sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-black/10 shadow-sm transition-colors duration-500",
          theme.header // DYNAMIC HEADER COLOR
        )}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-white/10 lg:hidden transition-colors"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
            
            <h2 className="text-xl font-bold text-white">
              {user?.role === 'PATIENT' && 'Patient Portal'}
              {user?.role === 'DOCTOR' && 'Doctor Portal'}
              {user?.role === 'ADMIN' && 'Admin Portal'}
            </h2>
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
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              
              <div className="hidden md:block">
                <div className="text-sm font-bold text-white leading-none">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className={cn("text-[10px] uppercase tracking-wider font-bold mt-1 opacity-80", theme.subtext)}>
                  {user?.role}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};
