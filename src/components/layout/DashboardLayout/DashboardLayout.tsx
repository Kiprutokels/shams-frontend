import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { logout } from '@store/slices/authSlice';
import { Footer } from '@components/layout/Footer';
import { Header } from '@components/layout/Header';
import { Sidebar } from '@components/layout/Sidebar';
import { cn } from '@utils/cn';
import { menuItems, roleThemes } from './config';

export const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const currentMenu = user ? menuItems[user.role] ?? [] : [];
  const theme = roleThemes[user?.role ?? 'PATIENT'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
        theme={theme}
        menuItems={currentMenu}
        onLogout={handleLogout}
      />

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className={cn('flex-1 flex flex-col min-w-0', sidebarOpen ? 'lg:ml-64' : 'lg:ml-20')}>
        <Header
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          theme={theme}
          user={user}
        />

        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};
