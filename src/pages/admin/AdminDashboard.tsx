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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">System overview and management</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button variant="outline" onClick={() => navigate('/admin/analytics')}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button variant="primary" onClick={() => navigate('/admin/users')}>
            <Users className="w-4 h-4 mr-2" />
            Manage Users
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.totalPatients || 0}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                Total Patients
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <UserPlus className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.totalDoctors || 0}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                Active Doctors
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
              <Calendar className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.todayAppointments || 0}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                Today's Appointments
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.activeQueue || 0}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                Active Queue
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card title="Appointment Statistics">
          <div className="space-y-3">
            {[
              {
                label: 'Total Appointments',
                value: stats?.totalAppointments || 0,
                color: 'text-gray-900 dark:text-white',
              },
              {
                label: 'Completed',
                value: stats?.completedAppointments || 0,
                color: 'text-green-600 dark:text-green-400',
              },
              {
                label: 'Cancelled',
                value: stats?.cancelledAppointments || 0,
                color: 'text-yellow-600 dark:text-yellow-400',
              },
              {
                label: 'No-Shows',
                value: stats?.noShows || 0,
                color: 'text-red-600 dark:text-red-400',
              },
              {
                label: 'No-Show Rate',
                value: `${stats?.noShowRate?.toFixed(1) || 0}%`,
                color: 'text-blue-600 dark:text-blue-400',
                highlight: true,
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex justify-between items-center p-3 rounded-lg ${
                  item.highlight ? 'gradient-card' : 'bg-gray-50 dark:bg-gray-900'
                }`}
              >
                <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                <span className={`font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="System Health">
          <div className="space-y-3">
            {[
              { label: 'Database Status', status: 'Operational', type: 'success', icon: Database },
              { label: 'API Response Time', status: '120ms', type: 'success', icon: Zap },
              { label: 'Email Service', status: 'Active', type: 'success', icon: Mail },
              {
                label: 'SMS Service',
                status: 'Active',
                type: 'success',
                icon: MessageSquare,
              },
              { label: 'AI Services', status: 'Running', type: 'success', icon: Cpu },
            ].map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <item.icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {item.label}
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                    item.type === 'success'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : item.type === 'warning'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  <CheckCircle className="w-3 h-3" />
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Users,
              title: 'User Management',
              desc: 'Add, edit, or remove users',
              path: '/admin/users',
            },
            {
              icon: Calendar,
              title: 'Appointments',
              desc: 'Manage all appointments',
              path: '/admin/appointments',
            },
            {
              icon: BarChart3,
              title: 'Analytics',
              desc: 'View detailed reports',
              path: '/admin/analytics',
            },
            {
              icon: Settings,
              title: 'System Settings',
              desc: 'Configure system parameters',
              path: '/admin/settings',
            },
          ].map((action) => (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className="p-6 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                  <action.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
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
