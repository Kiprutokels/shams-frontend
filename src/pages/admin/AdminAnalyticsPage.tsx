import React, { useEffect, useState } from 'react';
import { Card } from '@components/common/Card/Card';
import { Loader } from '@components/common/Loader/Loader';
import { analyticsService } from '@services/api/analytics.service';
import {
  BarChart3,
  Users,
  Calendar,
  Clock,
  Activity,
  AlertCircle,
} from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<Record<string, unknown> | null>(null);
  const [trends, setTrends] = useState<unknown[]>([]);
  const [doctorPerformance, setDoctorPerformance] = useState<unknown[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [statsRes, trendsRes, perfRes] = await Promise.all([
        analyticsService.getDashboardStats(),
        analyticsService.getAppointmentTrends(30),
        analyticsService.getDoctorPerformance(),
      ]);
      setDashboardStats(statsRes.data ?? null);
      setTrends(Array.isArray(trendsRes.data) ? trendsRes.data : []);
      setDoctorPerformance(Array.isArray(perfRes.data) ? perfRes.data : []);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const stats = dashboardStats as Record<string, number> | null;

  return (
    <div className="min-h-screen bg-neutral-bg dark:bg-gray-950 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics
        </h1>
        <p className="text-neutral dark:text-gray-400">
          System metrics and performance reports
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: 'Total Patients',
            value: stats?.totalPatients ?? 0,
            icon: Users,
            border: 'border-l-navy',
            bg: 'bg-navy/20',
            text: 'text-navy',
          },
          {
            label: 'Total Doctors',
            value: stats?.totalDoctors ?? 0,
            icon: Activity,
            border: 'border-l-primary',
            bg: 'bg-primary/20',
            text: 'text-primary',
          },
          {
            label: 'Today\'s Appointments',
            value: stats?.todayAppointments ?? 0,
            icon: Calendar,
            border: 'border-l-secondary',
            bg: 'bg-secondary/20',
            text: 'text-secondary',
          },
          {
            label: 'No-Show Rate',
            value: `${(stats?.noShowRate ?? 0).toFixed(1)}%`,
            icon: AlertCircle,
            border: 'border-l-warmRed',
            bg: 'bg-warmRed/20',
            text: 'text-warmRed',
          },
        ].map((item) => (
          <Card key={item.label} className={`border-l-4 ${item.border}`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 ${item.bg} rounded-xl`}>
                <item.icon className={`w-8 h-8 ${item.text}`} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {item.value}
                </h3>
                <p className="text-sm text-neutral font-semibold">{item.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Appointment Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card title="Appointment Overview" className="border-l-4 border-l-navy">
          <div className="space-y-4">
            {[
              { label: 'Total Appointments', value: stats?.totalAppointments ?? 0, color: 'text-navy' },
              { label: 'Completed', value: stats?.completedAppointments ?? 0, color: 'text-secondary' },
              { label: 'Cancelled', value: stats?.cancelledAppointments ?? 0, color: 'text-accent' },
              { label: 'No-Shows', value: stats?.noShows ?? 0, color: 'text-warmRed' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center p-4 bg-neutral-bg dark:bg-gray-800 rounded-xl"
              >
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {item.label}
                </span>
                <span className={`text-xl font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Queue & Activity" className="border-l-4 border-l-navy">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-neutral-bg dark:bg-gray-800 rounded-xl">
              <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Clock className="w-5 h-5 text-navy" />
                Active Queue
              </span>
              <span className="text-xl font-bold text-navy">
                {stats?.activeQueue ?? 0}
              </span>
            </div>
            {trends.length > 0 ? (
              <div className="p-4 bg-neutral-bg dark:bg-gray-800 rounded-xl">
                <p className="text-sm text-neutral font-semibold mb-2">
                  Appointment trends (last 30 days)
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Data available from API
                </p>
              </div>
            ) : (
              <div className="p-8 bg-neutral-bg dark:bg-gray-800 rounded-xl text-center">
                <BarChart3 className="w-12 h-12 text-neutral mx-auto mb-2" />
                <p className="text-neutral text-sm">Trend data will appear here</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Doctor Performance */}
      <Card title="Doctor Performance" className="border-l-4 border-l-secondary">
        {doctorPerformance.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-neutral mx-auto mb-4" />
            <p className="text-neutral dark:text-gray-400">
              Performance data will appear when available
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-4 px-4 font-bold text-gray-900 dark:text-white">
                    Doctor
                  </th>
                  <th className="text-left py-4 px-4 font-bold text-gray-900 dark:text-white">
                    Appointments
                  </th>
                  <th className="text-left py-4 px-4 font-bold text-gray-900 dark:text-white">
                    Completion Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {(doctorPerformance as { doctorName?: string; appointments?: number; completionRate?: number }[]).map((item, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-neutral-bg dark:hover:bg-gray-800/50"
                  >
                    <td className="py-4 px-4 font-semibold text-gray-900 dark:text-white">
                      {item.doctorName ?? 'N/A'}
                    </td>
                    <td className="py-4 px-4 text-neutral">{item.appointments ?? 0}</td>
                    <td className="py-4 px-4">
                      <span className="text-secondary font-bold">
                        {((item.completionRate ?? 0) * 100).toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
