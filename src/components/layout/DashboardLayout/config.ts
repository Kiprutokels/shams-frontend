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
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

export interface RoleTheme {
  sidebar: string;
  header: string;
  active: string;
  text: string;
  subtext: string;
}

export const menuItems: Record<string, MenuItem[]> = {
  PATIENT: [
    { icon: Home, label: 'Dashboard', path: '/patient/dashboard' },
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

export const roleThemes: Record<string, RoleTheme> = {
  PATIENT: {
    sidebar: 'bg-[#0D47A1]',
    header: 'bg-[#1976D2]',
    active: 'bg-[#1976D2]',
    text: 'text-white',
    subtext: 'text-blue-100',
  },
  DOCTOR: {
    sidebar: 'bg-[#004D40]',
    header: 'bg-[#26A69A]',
    active: 'bg-[#26A69A]',
    text: 'text-white',
    subtext: 'text-teal-50',
  },
  ADMIN: {
    sidebar: 'bg-[#1A1A1A]',
    header: 'bg-[#0D47A1]',
    active: 'bg-[#0D47A1]',
    text: 'text-white',
    subtext: 'text-gray-300',
  },
  NURSE: {
    sidebar: 'bg-[#0D47A1]',
    header: 'bg-[#1976D2]',
    active: 'bg-[#1976D2]',
    text: 'text-white',
    subtext: 'text-blue-100',
  },
};
