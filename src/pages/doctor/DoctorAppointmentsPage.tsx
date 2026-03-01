import React, { useEffect, useState, useCallback } from 'react';
import { useAppSelector } from '@store/hooks';
import { Card } from '@components/common/Card/Card';
import { Button } from '@components/common/Button/Button';
import { Loader } from '@components/common/Loader/Loader';
import { ConsultationModal } from '@components/modals/ConsultationModal';
import { appointmentService } from '@services/api/appointment.service';
import { aiService } from '@services/api/ai.service';
import type { Appointment, AppointmentStatus } from '@types';
import {
  Calendar, Clock, Search, ChevronRight,
  AlertCircle, Stethoscope, Zap,
} from 'lucide-react';

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  SCHEDULED:   { bg: 'bg-blue-100 dark:bg-blue-900/20',   text: 'text-blue-700 dark:text-blue-300' },
  CONFIRMED:   { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-300' },
  IN_PROGRESS: { bg: 'bg-amber-100 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-300' },
  COMPLETED:   { bg: 'bg-teal-100 dark:bg-teal-900/20',   text: 'text-teal-700 dark:text-teal-300' },
  CANCELLED:   { bg: 'bg-gray-100 dark:bg-gray-800',      text: 'text-gray-500' },
  NO_SHOW:     { bg: 'bg-red-100 dark:bg-red-900/20',     text: 'text-red-700 dark:text-red-300' },
};

export const DoctorAppointmentsPage: React.FC = () => {
  useAppSelector((state) => state.auth);

  const [loading, setLoading]               = useState(true);
  const [appointments, setAppointments]     = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm]         = useState('');
  const [statusFilter, setStatusFilter]     = useState('');
  const [dateFilter, setDateFilter]         = useState('');
  const [showConsultation, setShowConsultation] = useState(false);
  const [selectedApt, setSelectedApt]       = useState<Appointment | null>(null);
  const [predictingId, setPredictingId]     = useState<number | null>(null);

  // ─── Load ───────────────────────────────────────────────────────────────────
  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, unknown> = {};
      if (statusFilter) params.status = statusFilter;

      const today = new Date().toISOString().split('T')[0];
      if (dateFilter === 'today') {
        params.startDate = today;
        params.endDate   = today;
      } else if (dateFilter === 'upcoming') {
        params.startDate = today;
      } else if (dateFilter === 'past') {
        params.endDate = new Date(Date.now() - 86_400_000).toISOString().split('T')[0];
      } else if (dateFilter) {
        params.startDate = dateFilter;
        params.endDate   = dateFilter;
      }

      const response = await appointmentService.getAll(params);
      setAppointments(response.data);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, dateFilter]);

  useEffect(() => { loadAppointments(); }, [loadAppointments]);

  // ─── Derived ────────────────────────────────────────────────────────────────
  const filtered = appointments.filter((apt) => {
    if (!searchTerm) return true;
    const term  = searchTerm.toLowerCase();
    const pName = `${apt.patient?.firstName ?? ''} ${apt.patient?.lastName ?? ''}`.toLowerCase();
    const cc    = (apt.chiefComplaint ?? '').toLowerCase();
    return pName.includes(term) || cc.includes(term);
  });

  // ─── AI no-show predict ────────────────────────────────────────────────────
  const handleRunNoShowPredict = async (apt: Appointment) => {
    setPredictingId(apt.id);
    try {
      await aiService.predictNoShow({
        appointment_id:   apt.id,
        patient_id:       apt.patientId,
        appointment_date: apt.appointmentDate,
        appointment_type: apt.appointmentType,
      });
      loadAppointments();
    } catch {
      /* silent — prediction is non-critical */
    } finally {
      setPredictingId(null);
    }
  };

  const getStyle = (s: string) => STATUS_STYLES[s] ?? STATUS_STYLES.SCHEDULED;

  const getRiskColor = (p?: number) =>
    p === undefined || p === null ? ''
      : p < 0.3 ? 'text-green-600'
      : p < 0.6 ? 'text-amber-600'
      : 'text-red-600';

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-neutral-bg dark:bg-gray-950 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Appointments
          </h1>
          <p className="text-neutral dark:text-gray-400">
            Manage and consult patient appointments
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6 border-l-4 border-l-teal-500">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral" />
              <input
                type="text"
                placeholder="Search by patient name or complaint..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 dark:border-gray-700
                           rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:outline-none focus:border-teal-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-neutral shrink-0" />
              <input
                type="date"
                value={
                  ['today', 'upcoming', 'past'].includes(dateFilter) ? '' : dateFilter
                }
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:outline-none focus:border-teal-500 text-sm"
              />
              {dateFilter && (
                <button
                  onClick={() => setDateFilter('')}
                  className="text-sm text-red-500 hover:text-red-600 font-semibold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: '',         label: 'All Dates' },
              { value: 'today',    label: 'Today' },
              { value: 'upcoming', label: 'Upcoming' },
              { value: 'past',     label: 'Past' },
            ].map((o) => (
              <button
                key={o.value || 'all-d'}
                onClick={() => setDateFilter(o.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  dateFilter === o.value
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-neutral hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {o.label}
              </button>
            ))}
            {['', 'SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'NO_SHOW'].map((s) => (
              <button
                key={s || 'all-s'}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  statusFilter === s
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-neutral hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {s || 'All Status'}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* List */}
      <Card
        title={`Appointments (${filtered.length})`}
        className="border-l-4 border-l-teal-500"
      >
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-neutral">No appointments found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((apt) => {
              const style    = getStyle(apt.status as AppointmentStatus);
              const canConsult = ['CONFIRMED', 'IN_PROGRESS', 'SCHEDULED'].includes(apt.status);
              const noShowRisk = apt.noShowProbability;

              return (
                <div
                  key={apt.id}
                  className="flex items-center gap-4 p-4 rounded-xl border-2
                             border-gray-100 dark:border-gray-800
                             hover:border-teal-400/40 transition-all"
                >
                  {/* Date block */}
                  <div className="flex flex-col items-center w-14 h-14
                                  bg-teal-500/10 border-l-4 border-l-teal-500
                                  rounded-xl justify-center shrink-0">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {new Date(apt.appointmentDate).getDate()}
                    </div>
                    <div className="text-xs font-semibold text-teal-600 uppercase">
                      {new Date(apt.appointmentDate).toLocaleDateString('en-US', {
                        month: 'short',
                      })}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        {apt.patient?.firstName} {apt.patient?.lastName}
                      </h4>
                      {noShowRisk !== undefined && noShowRisk !== null && (
                        <span className={`text-xs font-semibold ${getRiskColor(noShowRisk)}`}>
                          No-show risk: {(noShowRisk * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(apt.appointmentDate).toLocaleTimeString('en-US', {
                        hour: '2-digit', minute: '2-digit',
                      })}
                      <span className="mx-1">·</span>
                      {apt.appointmentType?.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {apt.chiefComplaint || 'No complaint specified'}
                    </p>
                    {apt.diagnosis && (
                      <p className="text-xs text-teal-600 dark:text-teal-400 truncate mt-0.5">
                        Dx: {apt.diagnosis}
                      </p>
                    )}
                  </div>

                  {/* Status badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold
                                ${style.bg} ${style.text} shrink-0`}
                  >
                    {apt.status}
                  </span>

                  {apt.status === 'NO_SHOW' && (
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    {canConsult && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="bg-teal-500 hover:bg-teal-600 text-xs"
                        onClick={() => {
                          setSelectedApt(apt);
                          setShowConsultation(true);
                        }}
                      >
                        <Stethoscope className="w-3 h-3 mr-1" /> Consult
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-300 text-purple-600 text-xs"
                      onClick={() => handleRunNoShowPredict(apt)}
                      disabled={predictingId === apt.id}
                    >
                      <Zap
                        className={`w-3 h-3 mr-1 ${
                          predictingId === apt.id ? 'animate-spin' : ''
                        }`}
                      />
                      {predictingId === apt.id ? '…' : 'AI'}
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-300">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <ConsultationModal
        isOpen={showConsultation}
        onClose={() => setShowConsultation(false)}
        appointment={selectedApt}
        onSuccess={() => {
          loadAppointments();
          setShowConsultation(false);
        }}
      />
    </div>
  );
};
