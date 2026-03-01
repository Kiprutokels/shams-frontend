import React, { useEffect, useState, useCallback } from 'react';
import { Card } from '@components/common/Card/Card';
import { Loader } from '@components/common/Loader/Loader';
import { appointmentService } from '@services/api/appointment.service';
import type { Appointment, PaginatedResponse } from '@types';
import { Calendar, Search, CheckCircle, AlertCircle } from 'lucide-react';

// ─── Status badge styles ──────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  SCHEDULED:   { bg: 'bg-blue-100 dark:bg-blue-900/20',    text: 'text-blue-700 dark:text-blue-300' },
  CONFIRMED:   { bg: 'bg-green-100 dark:bg-green-900/20',  text: 'text-green-700 dark:text-green-300' },
  IN_PROGRESS: { bg: 'bg-amber-100 dark:bg-amber-900/20',  text: 'text-amber-700 dark:text-amber-300' },
  COMPLETED:   { bg: 'bg-teal-100 dark:bg-teal-900/20',    text: 'text-teal-700 dark:text-teal-300' },
  CANCELLED:   { bg: 'bg-gray-100 dark:bg-gray-800',       text: 'text-gray-500' },
  NO_SHOW:     { bg: 'bg-red-100 dark:bg-red-900/20',      text: 'text-red-700 dark:text-red-300' },
  RESCHEDULED: { bg: 'bg-amber-100 dark:bg-amber-900/20',  text: 'text-amber-700 dark:text-amber-300' },
};

const STATUS_TABS = [
  '', 'SCHEDULED', 'CONFIRMED', 'IN_PROGRESS',
  'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED',
] as const;

export const AdminAppointmentsPage: React.FC = () => {
  const [loading, setLoading]           = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pagination, setPagination]     = useState<PaginatedResponse<Appointment>['pagination'] | null>(null);
  const [searchTerm, setSearchTerm]     = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  // ─── Load ───────────────────────────────────────────────────────────────────
  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, unknown> = {};
      if (statusFilter) params.status = statusFilter;

      const response = await appointmentService.getAll(params);
      setAppointments(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Failed to load appointments:', err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { loadAppointments(); }, [loadAppointments]);

  // ─── Confirm ────────────────────────────────────────────────────────────────
  const handleConfirm = async (id: number) => {
    setConfirmingId(id);
    try {
      const confirmed = await appointmentService.confirm(id);
      setAppointments((prev) =>
        prev.map((a) => (a.id === confirmed.id ? confirmed : a)),
      );
    } catch (err: any) {
      alert(err?.response?.data?.message ?? 'Failed to confirm appointment');
    } finally {
      setConfirmingId(null);
    }
  };

  // ─── Client-side search ──────────────────────────────────────────────────────
  const filtered = appointments.filter((apt) => {
    if (!searchTerm) return true;
    const term    = searchTerm.toLowerCase();
    const patient = `${apt.patient?.firstName ?? ''} ${apt.patient?.lastName ?? ''}`.toLowerCase();
    const doctor  = `${apt.doctor?.firstName ?? ''} ${apt.doctor?.lastName ?? ''}`.toLowerCase();
    return patient.includes(term) || doctor.includes(term);
  });

  const getStyle = (status: string) =>
    STATUS_STYLES[status] ?? STATUS_STYLES.SCHEDULED;

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
            Manage all system appointments — confirm, review, and track
          </p>
        </div>
        {pagination && (
          <span className="text-sm text-neutral dark:text-gray-500 mt-2 md:mt-0">
            {pagination.total} total
          </span>
        )}
      </div>

      {/* Filters */}
      <Card className="mb-6 border-l-4 border-l-navy">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral" />
            <input
              type="text"
              placeholder="Search by patient or doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         focus:outline-none focus:border-navy"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_TABS.map((s) => (
              <button
                key={s || 'all'}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  statusFilter === s
                    ? 'bg-navy text-white'
                    : 'bg-neutral-bg dark:bg-gray-800 text-neutral hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {s || 'All'}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* List */}
      <Card
        title={`Appointments (${filtered.length})`}
        className="border-l-4 border-l-navy"
      >
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-neutral mx-auto mb-4" />
            <p className="text-neutral dark:text-gray-400">No appointments found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((apt) => {
              const style      = getStyle(apt.status);
              const doctorLabel =
                apt.doctor
                  ? `Dr. ${apt.doctor.firstName} ${apt.doctor.lastName}`
                  : 'Unassigned';
              const canConfirm =
                apt.status === 'SCHEDULED' || apt.status === 'RESCHEDULED';

              return (
                <div
                  key={apt.id}
                  className="flex items-center gap-4 p-4 rounded-xl border-2
                             border-gray-200 dark:border-gray-700
                             hover:border-navy/50 transition-all"
                >
                  {/* Date block */}
                  <div className="flex flex-col items-center justify-center w-16 h-16
                                  bg-navy/10 rounded-xl shrink-0 border-l-4 border-l-navy">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {new Date(apt.appointmentDate).getDate()}
                    </div>
                    <div className="text-xs font-semibold text-navy uppercase">
                      {new Date(apt.appointmentDate).toLocaleDateString('en-US', {
                        month: 'short',
                      })}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-gray-900 dark:text-white">
                        {apt.patient?.firstName} {apt.patient?.lastName}
                      </span>
                      <span className="text-neutral text-sm">→</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                        {doctorLabel}
                      </span>
                    </div>
                    <p className="text-xs text-neutral mt-0.5">
                      {new Date(apt.appointmentDate).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {' · '}
                      {apt.appointmentType?.replace('_', ' ')}
                      {' · '}
                      {apt.durationMinutes} min
                    </p>
                    {apt.chiefComplaint && (
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {apt.chiefComplaint}
                      </p>
                    )}
                    {apt.confirmedAt && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-0.5 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Confirmed {new Date(apt.confirmedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Status badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold shrink-0
                                ${style.bg} ${style.text}`}
                  >
                    {apt.status}
                  </span>

                  {/* Confirm action */}
                  {canConfirm && (
                    <button
                      onClick={() => handleConfirm(apt.id)}
                      disabled={confirmingId === apt.id}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                                 bg-green-500 hover:bg-green-600 disabled:opacity-50
                                 text-white text-xs font-semibold transition-all"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      {confirmingId === apt.id ? 'Confirming…' : 'Confirm'}
                    </button>
                  )}

                  {/* No-show indicator */}
                  {apt.status === 'NO_SHOW' && (
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
