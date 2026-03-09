import React, { useState, useEffect } from 'react';
import { appointmentService } from '@services/api/appointment.service';
import type { Appointment } from '@types';
import { Calendar, Clock, RefreshCw, X, AlertCircle } from 'lucide-react';
import { Button } from '@components/common/Button/Button';

interface RescheduleAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onSuccess: () => void;
}

export const RescheduleAppointmentModal: React.FC<RescheduleAppointmentModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onSuccess,
}) => {
  const [date, setDate]     = useState('');
  const [time, setTime]     = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  // ── Pre-fill with current appointment values when modal opens ────────────
  useEffect(() => {
    if (isOpen && appointment) {
      const d = new Date(appointment.appointmentDate);
      // YYYY-MM-DD in local time
      const localDate =
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      // HH:mm in local time
      const localTime =
        `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      setDate(localDate);
      setTime(localTime);
      setReason('');
      setError('');
    }
  }, [isOpen, appointment]);

  if (!isOpen || !appointment) return null;

  // Min date = tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate =
    `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

  const doctorName = appointment.doctor
    ? `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`
    : 'Any Available Doctor';

  const handleSubmit = async () => {
    if (!date || !time) {
      setError('Please select both a date and a time.');
      return;
    }
    const newDateTime = new Date(`${date}T${time}:00`);
    if (isNaN(newDateTime.getTime()) || newDateTime <= new Date()) {
      setError('Please select a valid future date and time.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await appointmentService.update(appointment.id, {
        appointmentDate: newDateTime.toISOString(),
        status: 'RESCHEDULED' as Appointment['status'],
        ...(reason.trim() ? { notes: reason.trim() } : {}),
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? 'Failed to reschedule. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md
                   border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
              <RefreshCw className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Reschedule Appointment
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{doctorName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* ── Body */}
        <div className="p-6 space-y-5">
          {/* Current appointment summary */}
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm">
            <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Current appointment
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              {' at '}
              {new Date(appointment.appointmentDate).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {/* New date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              <Calendar className="w-4 h-4 inline mr-1" />
              New Date
            </label>
            <input
              type="date"
              value={date}
              min={minDate}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* New time */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              <Clock className="w-4 h-4 inline mr-1" />
              New Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Reason (optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Reason{' '}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., work conflict, feeling better, travel plans…"
              className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         focus:outline-none focus:border-amber-500 transition-colors
                         placeholder-gray-400 dark:placeholder-gray-600 resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg
                            border border-red-200 dark:border-red-800">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
        </div>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3 p-6
                        border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="border-gray-300 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 border-amber-500 text-white min-w-35"
          >
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Rescheduling…
              </span>
            ) : (
              <span className="flex items-center gap-2 justify-center">
                <RefreshCw className="w-4 h-4" />
                Confirm Reschedule
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
