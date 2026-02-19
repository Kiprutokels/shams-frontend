import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { logout } from '@store/slices/authSlice';
import { ThemeToggle } from '@components/common/ThemeToggle/ThemeToggle';
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-linear-to-b from-gray-900 to-gray-800 text-white transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-20',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && <span className="text-xl font-bold">SHAMS</span>}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors hidden lg:block"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
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
                  'w-full flex items-center gap-4 px-4 py-3 transition-all',
                  isActive
                    ? 'bg-blue-500/20 border-r-4 border-blue-500 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                )}
              >
                <item.icon className="w-6 h-6 shrink-0" />
                {sidebarOpen && <span className="font-semibold">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all text-red-300 hover:text-white"
          >
            <LogOut className="w-6 h-6 shrink-0" />
            {sidebarOpen && <span className="font-semibold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className={cn('flex-1 flex flex-col', sidebarOpen ? 'lg:ml-64' : 'lg:ml-20')}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {user?.role === 'PATIENT' && 'Patient Portal'}
              {user?.role === 'DOCTOR' && 'Doctor Portal'}
              {user?.role === 'ADMIN' && 'Admin Portal'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                  {user?.role.toLowerCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
