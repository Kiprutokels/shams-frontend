/**
 * BookAppointmentModal.tsx
 *
 * Modal for booking an appointment:
 * - Doctor selection is OPTIONAL (patient may choose "Any Available Doctor")
 * - Uses AI wait-time estimate after booking
 * - Sends to backend which auto-runs no-show prediction
 */
import React, { useEffect, useState } from 'react';
import { appointmentService } from '@services/api/appointment.service';
import { userService } from '@services/api/user.service';
import { Button } from '@components/common/Button/Button';
import { Alert } from '@components/common/Alert/Alert';
import type { User } from '@types';
import { AppointmentType } from '@types';
import { X, Calendar, Clock, Stethoscope, FileText, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TIME_SLOTS = [
  '08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30',
  '12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30',
  '16:00','16:30','17:00',
];

export const BookAppointmentModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    doctorId: 0,  // 0 = any available
    appointmentDate: '',
    appointmentType: AppointmentType.CONSULTATION,
    chiefComplaint: '',
    symptoms: '',
    notes: '',
  });

  useEffect(() => {
    if (isOpen) {
      loadDoctors();
      setFormData({ doctorId: 0, appointmentDate: '', appointmentType: AppointmentType.CONSULTATION, chiefComplaint: '', symptoms: '', notes: '' });
      setSelectedDate('');
      setAvailableSlots([]);
      setError('');
      setSuccess('');
    }
  }, [isOpen]);

  const loadDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const res = await userService.getDoctors();
      setDoctors(res.data ?? []);
    } catch {
      setDoctors([]);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setFormData((p) => ({ ...p, appointmentDate: '' }));
    setAvailableSlots(TIME_SLOTS.map((t) => `${date}T${t}:00`));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.appointmentDate) {
      setError('Please select a date and time slot');
      return;
    }
    if (!formData.chiefComplaint.trim()) {
      setError('Please describe your chief complaint');
      return;
    }
    setLoading(true);
    try {
      const payload: any = {
        appointmentDate: formData.appointmentDate,
        appointmentType: formData.appointmentType,
        chiefComplaint: formData.chiefComplaint,
        symptoms: formData.symptoms || undefined,
        notes: formData.notes || undefined,
      };
      if (formData.doctorId && formData.doctorId > 0) {
        payload.doctorId = formData.doctorId;
      }
      await appointmentService.create(payload);
      setSuccess('✅ Appointment booked! Confirmation email sent.');
      setTimeout(() => { onSuccess(); onClose(); }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto animate-slide-up border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Book an Appointment</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Schedule a visit with a healthcare provider</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          {success && <Alert type="success" message={success} />}

          {/* Doctor Selection (optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Stethoscope className="w-4 h-4 inline mr-1 text-teal-500" />
              Doctor <span className="text-gray-400 font-normal text-xs">(optional – leave blank for any available)</span>
            </label>
            <select value={formData.doctorId}
              onChange={(e) => setFormData((p) => ({ ...p, doctorId: Number(e.target.value) }))}
              className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all">
              <option value={0}>👨‍⚕️ Any Available Doctor</option>
              {loadingDoctors ? (
                <option disabled>Loading doctors...</option>
              ) : (
                doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    Dr. {d.firstName} {d.lastName} – {d.specialization || 'General'}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-1 text-blue-500" />
              Preferred Date <span className="text-red-500">*</span>
            </label>
            <input type="date" min={minDate} value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {/* Time Slots */}
          {availableSlots.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="w-4 h-4 inline mr-1 text-amber-500" />
                Select Time Slot <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {availableSlots.map((slot) => {
                  const timeStr = new Date(slot).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                  const isSelected = formData.appointmentDate === slot;
                  return (
                    <button key={slot} type="button"
                      onClick={() => setFormData((p) => ({ ...p, appointmentDate: slot }))}
                      className={`py-2 px-1 rounded-lg text-xs font-bold border-2 transition-all ${
                        isSelected
                          ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400'
                      }`}>
                      {timeStr}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Appointment Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Appointment Type</label>
            <select value={formData.appointmentType}
              onChange={(e) => setFormData((p) => ({ ...p, appointmentType: e.target.value as AppointmentType }))}
              className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all">
              {Object.values(AppointmentType).map((t) => (
                <option key={t} value={t}>{t.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          {/* Chief Complaint */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <FileText className="w-4 h-4 inline mr-1 text-purple-500" />
              Chief Complaint <span className="text-red-500">*</span>
            </label>
            <input type="text" placeholder="Brief description of your main concern"
              value={formData.chiefComplaint}
              onChange={(e) => setFormData((p) => ({ ...p, chiefComplaint: e.target.value }))}
              className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {/* Symptoms */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Symptoms <span className="text-gray-400 font-normal text-xs">(optional)</span>
            </label>
            <textarea rows={3} placeholder="Describe your symptoms in detail..."
              value={formData.symptoms}
              onChange={(e) => setFormData((p) => ({ ...p, symptoms: e.target.value }))}
              className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all resize-none"
            />
          </div>

          {/* Info Box */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 flex gap-2">
            <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Note:</strong> You'll receive a confirmation email with appointment details. 
              Please arrive 15 minutes early to check in.
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" variant="primary" loading={loading} className="flex-1">
              <Calendar className="w-4 h-4 mr-2" /> Book Appointment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};