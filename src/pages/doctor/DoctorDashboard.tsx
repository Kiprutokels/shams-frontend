import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@store/hooks';
import { Card } from '@components/common/Card/Card';
import { Button } from '@components/common/Button/Button';
import { Loader } from '@components/common/Loader/Loader';
import { appointmentService } from '@services/api/appointment.service';
import { userService } from '@services/api/user.service';
import { queueService } from '@services/api/queue.service';
import {
  Calendar,
  CheckCircle,
  Clock,
  Users,
  BarChart3,
  Phone,
} from 'lucide-react';

interface DashboardStats {
  today: number;
  completed: number;
  pending: number;
}

interface Appointment {
  id: string;
  appointmentDate: string;
  priority: string;
  chiefComplaint: string;
  patient: {
    firstName: string;
    lastName: string;
    phone: string;
  };
}

interface QueueEntry {
  id: string;
  queueNumber: number;
  patientName: string;
  serviceType: string;
  estimatedWaitTime: number;
}

export const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [queueEntries, setQueueEntries] = useState<QueueEntry[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];

      const [statsData, appointmentsData, queueData] = await Promise.all([
        userService.getStats(),
        appointmentService.getAll({
          doctorId: user?.id,
          startDate: today,
          endDate: today,
        }),
        queueService.getAll({ status: 'WAITING' }),
      ]);

      setStats({
        today: statsData.data.today ?? 0,
        completed: statsData.data.completed ?? 0,
        pending: statsData.data.pending ?? 0,
      });
      setTodayAppointments(appointmentsData.data?.items || []);
      setQueueEntries(
        (queueData.data || []).map((queue: any) => ({
          ...queue,
          id: String(queue.id),
        }))
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
    <div className="min-h-screen bg-neutral-bg dark:bg-gray-950 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Good day, Dr. {user?.lastName}!
          </h1>
          <p className="text-neutral dark:text-gray-400">
            Manage your schedule and patient care
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/doctor/schedule')}
          className="mt-4 md:mt-0 bg-primary hover:opacity-90"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          View Full Schedule
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
                {stats?.today || 0}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                Today's Appointments
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
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Completed</p>
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
                {stats?.pending || 0}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Pending</p>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-teal">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal/20 rounded-xl">
              <Users className="w-8 h-8 text-teal" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {queueEntries.length}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">In Queue</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Today's Schedule */}
        <Card title="Today's Schedule" className="lg:col-span-2">
          {todayAppointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <Calendar className="w-16 h-16 text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                No appointments scheduled for today
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center gap-4 p-4 bg-neutral-bg dark:bg-gray-900 rounded-xl border-2 border-transparent hover:border-primary transition-all"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-xl font-bold text-primary">
                      {new Date(appointment.appointmentDate).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        appointment.priority === 'EMERGENCY'
                          ? 'bg-warmRed/20 text-warmRed'
                          : appointment.priority === 'HIGH'
                          ? 'bg-accent/20 text-accent'
                          : 'bg-teal/20 text-teal'
                      }`}
                    >
                      {appointment.priority}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {appointment.patient?.firstName} {appointment.patient?.lastName}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {appointment.patient?.phone}
                    </p>
                    <p className="text-sm italic text-gray-700 dark:text-gray-300 mt-1">
                      {appointment.chiefComplaint || 'No complaint specified'}
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-primary hover:opacity-90"
                    onClick={() => navigate(`/doctor/appointments/${appointment.id}`)}
                  >
                    Start Consultation
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Patient Queue */}
        <Card title="Patient Queue">
          {queueEntries.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">No patients in queue</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {queueEntries.slice(0, 5).map((entry, index) => (
                  <div
                    key={entry.id}
                    className="flex items-center gap-3 p-3 bg-neutral-bg dark:bg-gray-900 rounded-xl border-2 border-transparent hover:border-primary transition-all"
                  >
                    <div className="text-xl font-bold text-primary min-w-15 text-center">
                      #{entry.queueNumber}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        {entry.patientName}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {entry.serviceType}
                      </p>
                      <p className="text-xs font-semibold text-accent">
                        Wait: {entry.estimatedWaitTime || 'N/A'} min
                      </p>
                    </div>
                    {index === 0 && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="bg-primary hover:opacity-90"
                        onClick={() => navigate(`/doctor/queue/${entry.id}`)}
                      >
                        Call Next
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button variant="outline" fullWidth onClick={() => navigate('/doctor/queue')}>
                View All Queue
              </Button>
            </>
          )}
        </Card>
      </div>

      {/* Performance Summary */}
      <Card title="Performance Summary">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Average Consultation Time', value: '25 min' },
            { label: 'Patient Satisfaction', value: '4.8 ⭐' },
            { label: 'This Month Completed', value: stats?.completed || 0 },
            { label: 'No-Show Rate', value: '5%' },
          ].map((item, index) => (
            <div
              key={index}
              className="text-center p-4 bg-neutral-bg dark:bg-gray-900 rounded-xl"
            >
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.label}</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
