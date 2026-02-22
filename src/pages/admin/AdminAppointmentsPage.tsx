import React, { useEffect, useState } from 'react';
import { Card } from '@components/common/Card/Card';
import { Button } from '@components/common/Button/Button';
import { Loader } from '@components/common/Loader/Loader';
import { appointmentService } from '@services/api/appointment.service';
import type { Appointment, AppointmentStatus } from '@types';
import {
  Calendar,
  Search,
  Clock,
} from 'lucide-react';

export const AdminAppointmentsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    loadAppointments();
  }, [statusFilter]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const params: Record<string, unknown> = {};
      if (statusFilter) params.status = statusFilter;
      const response = await appointmentService.getAll(params);
      const data = response.data;
      const items = data?.data ?? (data as { items?: Appointment[] })?.items ?? [];
      setAppointments(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error('Failed to load appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const patient = `${apt.patient?.firstName ?? ''} ${apt.patient?.lastName ?? ''}`.toLowerCase();
    const doctor = `${apt.doctor?.firstName ?? ''} ${apt.doctor?.lastName ?? ''}`.toLowerCase();
    const term = searchTerm.toLowerCase();
    return !searchTerm || patient.includes(term) || doctor.includes(term);
  });

  const statusStyles: Record<string, { bg: string; text: string }> = {
    SCHEDULED: { bg: 'bg-primary/20', text: 'text-primary' },
    CONFIRMED: { bg: 'bg-secondary/20', text: 'text-secondary' },
    IN_PROGRESS: { bg: 'bg-accent/20', text: 'text-accent' },
    COMPLETED: { bg: 'bg-secondary/20', text: 'text-secondary' },
    CANCELLED: { bg: 'bg-neutral/20', text: 'text-neutral' },
    NO_SHOW: { bg: 'bg-warmRed/20', text: 'text-warmRed' },
  };

  const getStatusStyle = (status: AppointmentStatus) =>
    statusStyles[status] ?? statusStyles.SCHEDULED;

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-neutral-bg dark:bg-gray-950 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Appointments
          </h1>
          <p className="text-neutral dark:text-gray-400">
            View and manage all system appointments
          </p>
        </div>
      </div>

      <Card className="mb-6 border-l-4 border-l-navy">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral" />
            <input
              type="text"
              placeholder="Search by patient or doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-navy"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['', 'SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'].map(
              (status) => (
                <button
                  key={status || 'all'}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    statusFilter === status
                      ? 'bg-navy text-white'
                      : 'bg-neutral-bg dark:bg-gray-800 text-neutral hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {status || 'All'}
                </button>
              )
            )}
          </div>
        </div>
      </Card>

      <Card title={`Appointments (${filteredAppointments.length})`} className="border-l-4 border-l-navy">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-neutral mx-auto mb-4" />
            <p className="text-neutral dark:text-gray-400">No appointments found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((apt) => {
              const style = getStatusStyle(apt.status as AppointmentStatus);
              return (
                <div
                  key={apt.id}
                  className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-navy/50 transition-all"
                >
                  <div className="flex flex-col items-center justify-center w-16 h-16 bg-navy/10 rounded-xl shrink-0 border-l-4 border-l-navy">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {new Date(apt.appointmentDate).getDate()}
                    </div>
                    <div className="text-xs font-semibold text-navy uppercase">
                      {new Date(apt.appointmentDate).toLocaleDateString('en-US', {
                        month: 'short',
                      })}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 dark:text-white">
                        {apt.patient?.firstName} {apt.patient?.lastName}
                      </span>
                      <span className="text-neutral">→</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Dr. {apt.doctor?.firstName} {apt.doctor?.lastName}
                      </span>
                    </div>
                    <p className="text-sm text-neutral flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {new Date(apt.appointmentDate).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    {apt.chiefComplaint && (
                      <p className="text-sm text-neutral truncate mt-1">
                        {apt.chiefComplaint}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${style.bg} ${style.text}`}
                  >
                    {apt.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
