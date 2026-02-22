import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@store/hooks';
import { Card } from '@components/common/Card/Card';
import { Button } from '@components/common/Button/Button';
import { Loader } from '@components/common/Loader/Loader';
import { appointmentService } from '@services/api/appointment.service';
import type { Appointment, AppointmentStatus } from '@types';
import {
  Calendar,
  Clock,
  Search,
  ChevronRight,
  AlertCircle,
  CalendarClock,
} from 'lucide-react';

export const DoctorAppointmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  useEffect(() => {
    loadAppointments();
  }, [user?.id, statusFilter, dateFilter]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const params: Record<string, unknown> = { doctorId: user?.id };
      if (statusFilter) params.status = statusFilter;
      const today = new Date().toISOString().split('T')[0];
      if (dateFilter === 'today' || dateFilter === today) {
        params.startDate = today;
        params.endDate = today;
      } else if (dateFilter === 'upcoming') {
        params.startDate = today;
        params.endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      } else if (dateFilter === 'past') {
        params.startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        params.endDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      } else if (dateFilter) {
        params.startDate = dateFilter;
        params.endDate = dateFilter;
      }

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
    const patientName = `${apt.patient?.firstName ?? ''} ${apt.patient?.lastName ?? ''}`.toLowerCase();
    const complaint = (apt.chiefComplaint ?? '').toLowerCase();
    const term = searchTerm.toLowerCase();
    return !searchTerm || patientName.includes(term) || complaint.includes(term);
  });

  const statusStyles: Record<string, { bg: string; text: string }> = {
    SCHEDULED: { bg: 'bg-primary/20', text: 'text-primary' },
    CONFIRMED: { bg: 'bg-teal/20', text: 'text-teal' },
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Appointments
          </h1>
          <p className="text-neutral dark:text-gray-400">
            View and manage all your patient appointments
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6 border-l-4 border-l-primary">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral" />
              <input
                type="text"
                placeholder="Search by patient name or chief complaint..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-neutral shrink-0" />
              <input
                type="date"
                value={['upcoming', 'past'].includes(dateFilter) ? '' : dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-primary"
              />
              {dateFilter && (
                <button
                  onClick={() => setDateFilter('')}
                  className="px-3 py-2 text-sm text-accent hover:bg-accent/10 rounded-lg font-semibold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: '', label: 'All' },
              { value: new Date().toISOString().split('T')[0], label: 'Today' },
              { value: 'upcoming', label: 'Upcoming' },
              { value: 'past', label: 'Past' },
            ].map((opt) => (
              <button
                key={opt.value || 'all'}
                onClick={() => setDateFilter(opt.value)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  dateFilter === opt.value
                    ? 'bg-primary text-white'
                    : 'bg-neutral-bg dark:bg-gray-800 text-neutral hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
            {['', 'SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'NO_SHOW'].map((status) => (
              <button
                key={status || 'all-status'}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  statusFilter === status
                    ? 'bg-primary text-white'
                    : 'bg-neutral-bg dark:bg-gray-800 text-neutral hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {status || 'All Status'}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Appointments List */}
      <Card title={`Appointments (${filteredAppointments.length})`} className="border-l-4 border-l-primary">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-neutral mx-auto mb-4" />
            <p className="text-neutral dark:text-gray-400 mb-4">
              No appointments found
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((apt) => {
              const style = getStatusStyle(apt.status as AppointmentStatus);
              return (
                <div
                  key={apt.id}
                  className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-all cursor-pointer"
                  onClick={() => navigate(`/doctor/appointments/${apt.id}`)}
                >
                  <div className="flex flex-col items-center justify-center w-16 h-16 bg-teal/10 rounded-xl shrink-0 border-l-4 border-l-teal">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {new Date(apt.appointmentDate).getDate()}
                    </div>
                    <div className="text-xs font-semibold text-teal uppercase">
                      {new Date(apt.appointmentDate).toLocaleDateString('en-US', {
                        month: 'short',
                      })}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {apt.patient?.firstName} {apt.patient?.lastName}
                    </h4>
                    <p className="text-sm text-neutral flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(apt.appointmentDate).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-sm text-neutral truncate mt-1">
                      {apt.chiefComplaint || 'No complaint specified'}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${style.bg} ${style.text}`}
                  >
                    {apt.status}
                  </span>
                  {apt.status === 'NO_SHOW' && (
                    <AlertCircle className="w-5 h-5 text-warmRed shrink-0" />
                  )}
                  {(apt.status === 'SCHEDULED' || apt.status === 'CONFIRMED') && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-accent text-accent hover:bg-accent/10 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/doctor/appointments/${apt.id}?reschedule=true`);
                      }}
                    >
                      <CalendarClock className="w-4 h-4 mr-1" />
                      Reschedule
                    </Button>
                  )}
                  <ChevronRight className="w-5 h-5 text-neutral shrink-0" />
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
