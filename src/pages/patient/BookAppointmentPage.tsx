import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@store/hooks';
import { Card } from '@components/common/Card/Card';
import { Button } from '@components/common/Button/Button';
import { Loader } from '@components/common/Loader/Loader';
import { appointmentService } from '@services/api/appointment.service';
import { userService } from '@services/api/user.service';
import type { User } from '@types';
import { AppointmentType } from '@types';
import { Calendar, Stethoscope, Clock, AlertCircle } from 'lucide-react';

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
  '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00',
];

export const BookAppointmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    doctorId: 0,
    appointmentDate: '',
    appointmentType: AppointmentType.CONSULTATION,
    chiefComplaint: '',
    symptoms: '',
    notes: '',
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const response = await userService.getDoctors();
      setDoctors(response.data ?? []);
    } catch (err) {
      console.error('Failed to load doctors:', err);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.doctorId || !formData.appointmentDate) {
      setError('Please select a doctor and date/time');
      return;
    }
    try {
      setSubmitting(true);
      await appointmentService.create({
        doctorId: formData.doctorId,
        appointmentDate: formData.appointmentDate,
        appointmentType: formData.appointmentType,
        chiefComplaint: formData.chiefComplaint || undefined,
        symptoms: formData.symptoms || undefined,
        notes: formData.notes || undefined,
      });
      navigate('/patient/appointments');
    } catch (err: unknown) {
      setError((err as { message?: string })?.message ?? 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  const handleDateChange = (date: string) => {
    setFormData((prev) => ({ ...prev, appointmentDate: '' }));
    const slots = TIME_SLOTS.map((slot) => `${date}T${slot}:00`);
    setAvailableSlots(slots);
  };

  const minDate = new Date().toISOString().split('T')[0];

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-neutral-bg dark:bg-gray-950 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Book Appointment
          </h1>
          <p className="text-neutral dark:text-gray-400">
            Schedule a visit with your preferred doctor
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6 border-l-4 border-l-primary">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-primary" />
              Select Doctor
            </h3>
            <select
              required
              value={formData.doctorId}
              onChange={(e) => setFormData({ ...formData, doctorId: Number(e.target.value) })}
              className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-primary"
            >
              <option value={0}>Choose a doctor</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  Dr. {doc.firstName} {doc.lastName} - {doc.specialization || 'General'}
                </option>
              ))}
            </select>
            {doctors.length === 0 && (
              <p className="text-neutral text-sm mt-2">No doctors available</p>
            )}
          </Card>

          <Card className="mb-6 border-l-4 border-l-secondary">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-secondary" />
              Select Date
            </h3>
            <input
              type="date"
              required
              min={minDate}
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                handleDateChange(e.target.value);
              }}
              className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-primary"
            />
          </Card>

          <Card className="mb-6 border-l-4 border-l-accent">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" />
              Select Time Slot
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {availableSlots.length === 0 ? (
                <p className="text-neutral col-span-full">Select a date first</p>
              ) : (
                availableSlots.map((slot) => {
                  const timeStr = new Date(slot).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setFormData({ ...formData, appointmentDate: slot })}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        formData.appointmentDate === slot
                          ? 'bg-primary text-white'
                          : 'bg-neutral-bg dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-primary'
                      }`}
                    >
                      {timeStr}
                    </button>
                  );
                })
              )}
            </div>
          </Card>

          <Card className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Appointment Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Appointment Type
                </label>
                <select
                  value={formData.appointmentType}
                  onChange={(e) =>
                    setFormData({ ...formData, appointmentType: e.target.value as AppointmentType })
                  }
                  className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                >
                  {Object.values(AppointmentType).map((type) => (
                    <option key={type} value={type}>
                      {type.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Chief Complaint
                </label>
                <input
                  type="text"
                  placeholder="Brief description of your concern"
                  value={formData.chiefComplaint}
                  onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-neutral focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Symptoms (optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe any symptoms"
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-neutral focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </Card>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-warmRed/20 text-warmRed flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/patient/dashboard')}
              className="border-neutral text-neutral"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              className="bg-primary hover:opacity-90 flex-1"
            >
              Book Appointment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
