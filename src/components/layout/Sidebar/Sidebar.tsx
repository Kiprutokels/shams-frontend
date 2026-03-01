import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@utils/cn";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import type {
  MenuItem,
  RoleTheme,
} from "@components/layout/DashboardLayout/config";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  mobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
  theme: RoleTheme;
  menuItems: MenuItem[];
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  mobileMenuOpen,
  onCloseMobileMenu,
  theme,
  menuItems,
  onLogout,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 shadow-2xl",
        theme.sidebar,
        isOpen ? "w-64" : "w-20",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          {/* Logo Container - Updated for Transparency and Circular Style */}
          <div className="flex items-center justify-center bg-transparent rounded-full overflow-hidden">
            <img
              src="/src/assets/logo.png"
              alt="SHAMS Logo"
              className={cn(
                "transition-all duration-300 object-contain rounded-full",
                isOpen ? "w-12 h-12" : "w-10 h-10",
              )}
            />
          </div>
          {/* Brand Name */}
          {isOpen && (
            <span className="text-xl font-bold tracking-tight text-white animate-in fade-in duration-500">
              SHAMS
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                onCloseMobileMenu();
              }}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 transition-all relative group",
                isActive
                  ? `${theme.active} text-white shadow-lg`
                  : "text-white/60 hover:bg-white/5 hover:text-white",
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-white rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              )}
              <Icon
                className={cn(
                  "w-6 h-6 shrink-0 transition-colors",
                  isActive
                    ? "text-white"
                    : "text-white/50 group-hover:text-white",
                )}
              />
              {isOpen && <span className="font-semibold">{item.label}</span>}
            </button>
          );
        })}
      </nav>
      <button
        onClick={onToggle}
        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors hidden lg:block"
      >
        {isOpen ? (
          <ChevronLeft className="w-5 h-5 text-white/70" />
        ) : (
          <ChevronRight className="w-5 h-5 text-white/70" />
        )}
      </button>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-3 bg-[#E53935]/10 hover:bg-[#E53935] rounded-xl transition-all text-[#E53935] hover:text-white group"
        >
          <LogOut className="w-6 h-6 shrink-0 group-hover:scale-110 transition-transform" />
          {isOpen && <span className="font-semibold">Logout</span>}
        </button>
      </div>
    </aside>
  );
};
