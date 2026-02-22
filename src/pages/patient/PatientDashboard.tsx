import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@store/hooks';
import { Card } from '@components/common/Card/Card';
import { Button } from '@components/common/Button/Button';
import { Loader } from '@components/common/Loader/Loader';
import { appointmentService } from '@services/api/appointment.service';
import { userService } from '@services/api/user.service';
import { queueService } from '@services/api/queue.service';
import type { Appointment } from '@types';
import {
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Ticket,
  FileText,
  BookOpen,
  Timer,
  Settings,
  Droplet,
  Activity,
  Moon,
  Apple,
} from 'lucide-react';

interface DashboardStats {
  total: number;
  completed: number;
  upcoming: number;
  cancelled: number;
}

interface QueuePosition {
  position: number;
  estimatedWaitTime: number;
}

export const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [queuePosition, setQueuePosition] = useState<QueuePosition | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, appointmentsData, queueData] = await Promise.all([
        userService.getStats(),
        appointmentService.getUpcoming(),
        queueService.getMyPosition().catch(() => null),
      ]);

      setStats({
        total: statsData.data.total || 0,
        completed: statsData.data.completed || 0,
        upcoming: statsData.data.upcoming || 0,
        cancelled: statsData.data.cancelled || 0,
      });
      setUpcomingAppointments(appointmentsData.data);
      setQueuePosition(
        queueData?.data
          ? {
              position: queueData.data.position,
              estimatedWaitTime: queueData.data.estimatedWaitTime ?? 0,
            }
          : null
      );
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
    <div className="min-h-screen bg-neutral-bg dark:bg-gray-950 p-6 ">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-neutral dark:text-gray-400">
            Manage your appointments and health records
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/patient/book-appointment')}
          className="mt-4 md:mt-0 bg-primary hover:opacity-90"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Book Appointment
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-primary">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-xl">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.total || 0}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                Total Appointments
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary/20 rounded-xl">
              <CheckCircle className="w-8 h-8 text-secondary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.completed || 0}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                Completed
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/20 rounded-xl">
              <Clock className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.upcoming || 0}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                Upcoming
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-warmRed">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-warmRed/20 rounded-xl">
              <XCircle className="w-8 h-8 text-warmRed" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.cancelled || 0}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                Cancelled
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Queue Alert */}
      {queuePosition && (
        <Card className="mb-8 gradient-card border-none">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 rounded-xl">
                <Ticket className="w-12 h-12 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  You're in the queue!
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Queue Position: <strong>#{queuePosition.position}</strong>
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Estimated wait time: <strong>{queuePosition.estimatedWaitTime} minutes</strong>
                </p>
              </div>
            </div>
            <Button variant="primary" className="bg-primary hover:opacity-90" onClick={() => navigate('/patient/queue-status')}>
              View Queue
            </Button>
          </div>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Upcoming Appointments */}
        <Card title="Upcoming Appointments" className="lg:col-span-2">
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <Calendar className="w-16 h-16 text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No upcoming appointments
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/patient/book-appointment')}
              >
                Book Now
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center gap-4 p-4 bg-neutral-bg dark:bg-gray-900 rounded-xl border-2 border-transparent hover:border-primary transition-all cursor-pointer"
                  onClick={() => navigate(`/patient/appointments/${appointment.id}`)}
                >
                  <div className="flex flex-col items-center justify-center w-16 h-16 bg-primary text-white rounded-xl shrink-0">
                    <div className="text-2xl font-bold leading-none">
                      {new Date(appointment.appointmentDate).getDate()}
                    </div>
                    <div className="text-xs font-semibold uppercase">
                      {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                        month: 'short',
                      })}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {appointment.doctor?.specialization}
                    </p>
                    <p className="text-sm font-semibold text-primary">
                      {new Date(appointment.appointmentDate).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        appointment.status === 'SCHEDULED'
                          ? 'bg-primary/20 text-primary'
                          : appointment.status === 'CONFIRMED'
                          ? 'bg-secondary/20 text-secondary'
                          : 'bg-accent/20 text-accent'
                      }`}
                    >
                      {appointment.status}
                    </span>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="space-y-3">
            {[
              {
                icon: FileText,
                title: 'My Appointments',
                desc: 'View all appointments',
                path: '/patient/appointments',
              },
              {
                icon: BookOpen,
                title: 'Medical History',
                desc: 'View your records',
                path: '/patient/medical-history',
              },
              {
                icon: Timer,
                title: 'Queue Status',
                desc: 'Check wait time',
                path: '/patient/queue-status',
              },
              {
                icon: Settings,
                title: 'Profile Settings',
                desc: 'Update your info',
                path: '/patient/profile',
              },
            ].map((action) => (
              <button
                key={action.path}
                onClick={() => navigate(action.path)}
                className="w-full flex items-center gap-4 p-4 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary hover:bg-neutral-bg dark:hover:bg-gray-800 transition-all text-left"
              >
                <div className="p-2 bg-primary/20 rounded-lg">
                  <action.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{action.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{action.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Health Tips */}
      <Card title="Health Tips">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Droplet,
              text: 'Drink at least 8 glasses of water daily',
              color: 'text-primary',
            },
            {
              icon: Activity,
              text: 'Exercise for 30 minutes every day',
              color: 'text-secondary',
            },
            {
              icon: Moon,
              text: 'Get 7-8 hours of sleep each night',
              color: 'text-primary',
            },
            {
              icon: Apple,
              text: 'Eat a balanced diet with fruits and vegetables',
              color: 'text-secondary',
            },
          ].map((tip, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 bg-neutral-bg dark:bg-gray-900 rounded-xl"
            >
              <tip.icon className={`w-6 h-6 ${tip.color}`} />
              <p className="text-sm text-gray-700 dark:text-gray-300">{tip.text}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
