import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@components/common/Card/Card';
import { Button } from '@components/common/Button/Button';
import { Loader } from '@components/common/Loader/Loader';
import { analyticsService } from '@services/api/analytics.service';
import {
  Users,
  UserPlus,
  Calendar,
  Clock,
  BarChart3,
  Settings,
  CheckCircle,
  Database,
  Zap,
  Mail,
  MessageSquare,
  Cpu,
} from 'lucide-react';

interface AdminStats {
  totalPatients: number;
  totalDoctors: number;
  todayAppointments: number;
  activeQueue: number;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShows: number;
  noShowRate: number;
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const statsData = await analyticsService.getDashboardStats();
      setStats(statsData.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-neutral-bg dark:bg-gray-950 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-neutral dark:text-gray-400">System overview and management</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button variant="primary" 
          className="border-primary-dark text-primary-dark hover:bg-primary-dark hover:text-white transition-colors" 
          onClick={() => navigate('/admin/analytics')}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
       <Button 
  variant="primary" 
  className="border-primary-dark text-primary-dark hover:bg-primary-dark hover:text-white transition-colors" 
  onClick={() => navigate('/admin/users')}
>
  <Users className="w-4 h-4 mr-2" />
  Manage Users
</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-[#0D47A1]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#0D47A1]/10 rounded-xl">
              <Users className="w-8 h-8 text-[#0D47A1]" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.totalPatients || 0}
              </h3>
              <p className="text-sm text-neutral font-semibold">
                Total Patients
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-[#43A047]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#43A047]/10 rounded-xl">
              <UserPlus className="w-8 h-8 text-[#43A047]" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.totalDoctors || 0}
              </h3>
              <p className="text-sm text-neutral font-semibold">
                Active Doctors
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-[#1976D2]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#1976D2]/10 rounded-xl">
              <Calendar className="w-8 h-8 text-[#1976D2]" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.todayAppointments || 0}
              </h3>
              <p className="text-sm text-neutral font-semibold">
                Today's Appointments
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-[#FFC107]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#FFC107]/10 rounded-xl">
              <Clock className="w-8 h-8 text-[#FFC107]" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.activeQueue || 0}
              </h3>
              <p className="text-sm text-neutral font-semibold">
                Active Queue
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
<Card title="Appointment Statistics" className="border-l-4 border-l-[#0D47A1]">
  <div className="space-y-3">
    {[
      {
        label: 'Total Appointments',
        value: stats?.totalAppointments || 0,
        color: '#0D47A1', // Navy
        bg: 'bg-blue-50 dark:bg-blue-900/10',
      },
      {
        label: 'Completed',
        value: stats?.completedAppointments || 0,
        color: '#43A047', // Green
        bg: 'bg-green-50 dark:bg-green-900/10',
      },
      {
        label: 'Cancelled',
        value: stats?.cancelledAppointments || 0,
        color: '#FFC107', // Amber
        bg: 'bg-amber-50 dark:bg-amber-900/10',
      },
      {
        label: 'No-Shows',
        value: stats?.noShows || 0,
        color: '#EF5350', // Red
        bg: 'bg-red-50 dark:bg-red-900/10',
      },
      {
        label: 'No-Show Rate',
        value: `${stats?.noShowRate?.toFixed(1) || 0}%`,
        color: '#0D47A1', // Highlight Navy
        highlight: true,
      },
    ].map((item, index) => (
      <div
        key={index}
        className={`flex justify-between items-center p-3 rounded-lg border-l-4 transition-all ${
          item.highlight 
            ? 'bg-navy/10 border-l-navy shadow-sm' 
            : `${item.bg} border-l-transparent hover:border-l-current`
        }`}
        style={{ borderLeftColor: item.highlight ? undefined : item.color }}
      >
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {item.label}
        </span>
        <span 
          className="text-lg font-bold" 
          style={{ color: item.color }}
        >
          {item.value}
        </span>
      </div>
    ))}
  </div>
</Card>

<Card title="System Health" className="border-l-4 border-l-[#43A047]">
  <div className="space-y-3">
    {[
      { label: 'Database Status', status: 'Operational', type: 'success', icon: Database },
      { label: 'API Response Time', status: '120ms', type: 'success', icon: Zap },
      { label: 'Email Service', status: 'Active', type: 'success', icon: Mail },
      { label: 'SMS Service', status: 'Active', type: 'success', icon: MessageSquare },
      { label: 'AI Services', status: 'Running', type: 'success', icon: Cpu },
    ].map((item, index) => {
      // Define colors based on type
      const isSuccess = item.type === 'success';
      const isWarning = item.type === 'warning';
      
      const iconColor = isSuccess ? 'text-[#43A047]' : isWarning ? 'text-[#FFC107]' : 'text-[#EF5350]';
      const bgColor = isSuccess ? 'bg-[#43A047]/10' : isWarning ? 'bg-[#FFC107]/10' : 'bg-[#EF5350]/10';
      const badgeClass = isSuccess 
        ? 'bg-[#43A047]/20 text-[#2E7D32]' 
        : isWarning 
        ? 'bg-[#FFC107]/20 text-[#F57F17]' 
        : 'bg-[#EF5350]/20 text-[#C62828]';

      return (
        <div
          key={index}
          className="flex justify-between items-center p-3 bg-neutral-bg dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl transition-all hover:shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 ${bgColor} rounded-lg`}>
              <item.icon className={`w-4 h-4 ${iconColor}`} />
            </div>
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
              {item.label}
            </span>
          </div>
          
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${badgeClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isSuccess ? 'bg-[#43A047]' : 'bg-current'}`} />
            {item.status}
          </span>
        </div>
      );
    })}
  </div>
</Card>
      </div>

      {/* Quick Actions */}
<Card title="Quick Actions" className='border-l-4 border-l-[#0D47A1]'>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {[
      {
        icon: Users,
        title: 'User Management',
        desc: 'Add, edit, or remove users',
        path: '/admin/users',
        color: '#FFC107', // Amber
      },
      {
        icon: Calendar,
        title: 'Appointments',
        desc: 'Manage all appointments',
        path: '/admin/appointments',
        color: '#4CAF50', // Green
      },
      {
        icon: BarChart3,
        title: 'Analytics',
        desc: 'View detailed reports',
        path: '/admin/analytics',
        color: '#2196F3', // Blue
      },
      {
        icon: Settings,
        title: 'System Settings',
        desc: 'Configure system parameters',
        path: '/admin/settings',
        color: '#F44336', // Red
      },
    ].map((action) => (
      <button
        key={action.path}
        onClick={() => navigate(action.path)}
        style={{ borderLeftColor: action.color }} // Dynamic border color
        className="p-6 bg-white dark:bg-gray-900 border-l-[4px] shadow-sm rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all text-center group"
      >
        <div className="flex justify-center mb-4">
          {/* Background tint uses 10% opacity of the specific color */}
          <div 
            className="p-4 rounded-xl transition-colors" 
            style={{ backgroundColor: `${action.color}1A` }} 
          >
            <action.icon 
              className="w-8 h-8 transition-transform group-hover:scale-110" 
              style={{ color: action.color }} 
            />
          </div>
        </div>
        <h4 className="font-bold text-gray-900 dark:text-white mb-2">{action.title}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">{action.desc}</p>
      </button>
    ))}
  </div>
</Card>
    </div>
  );
};
