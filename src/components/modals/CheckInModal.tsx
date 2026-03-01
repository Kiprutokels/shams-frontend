/**
 * CheckInModal.tsx
 *
 * Patient checks in for an appointment.
 * On check-in:
 * 1. PATCH /appointments/:id with checkedIn=true
 * 2. POST /queue to create queue entry
 * 3. Shows assigned queue number + estimated wait
 */
import React, { useState } from 'react';
import { appointmentService } from '@services/api/appointment.service';
import { queueService } from '@services/api/queue.service';
import { Button } from '@components/common/Button/Button';
import { Alert } from '@components/common/Alert/Alert';
import type { Appointment } from '@types';
import { X, Ticket, Clock, CheckCircle, MapPin } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onSuccess: () => void;
}

export const CheckInModal: React.FC<Props> = ({ isOpen, onClose, appointment, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkedIn, setCheckedIn] = useState<{ queueNumber: number; estimatedWaitTime: number; department: string } | null>(null);

  const handleCheckIn = async () => {
    if (!appointment) return;
    setLoading(true);
    setError('');
    try {
      // 1. Mark appointment as checked in
      await appointmentService.update(appointment.id, { checkedIn: true });

      // 2. Create queue entry
      const patientName = `${appointment.patient?.firstName ?? ''} ${appointment.patient?.lastName ?? ''}`.trim();
      const department = appointment.doctor?.department || 'General';
      const queueResponse = await queueService.checkIn({
        patientId: appointment.patientId,
        appointmentId: appointment.id,
        patientName: patientName || 'Patient',
        department,
        serviceType: appointment.appointmentType || 'CONSULTATION',
        doctorName: `Dr. ${appointment.doctor?.firstName} ${appointment.doctor?.lastName}`,
        priorityLevel: appointment.priority || 'MEDIUM',
        isEmergency: appointment.priority === 'EMERGENCY',
      });

      setCheckedIn({
        queueNumber: queueResponse.data?.queueNumber ?? 1,
        estimatedWaitTime: queueResponse.data?.estimatedWaitTime ?? 20,
        department,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Check-in failed. Please try again at the reception.');
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    onSuccess();
    onClose();
    setCheckedIn(null);
    setError('');
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md animate-slide-up border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {checkedIn ? '✅ Checked In!' : 'Check In for Appointment'}
          </h2>
          <button onClick={checkedIn ? handleDone : onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {error && <div className="mb-4"><Alert type="error" message={error} onClose={() => setError('')} /></div>}

          {!checkedIn ? (
            <>
              {/* Appointment Summary */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Appointment Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {new Date(appointment.appointmentDate).toLocaleString('en-US', {
                        weekday: 'long', month: 'long', day: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 dark:text-gray-300">
                      👨‍⚕️ Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                      {appointment.doctor?.specialization && (
                        <span className="text-gray-500"> — {appointment.doctor.specialization}</span>
                      )}
                    </span>
                  </div>
                  {appointment.chiefComplaint && (
                    <div className="text-gray-600 dark:text-gray-400">📋 {appointment.chiefComplaint}</div>
                  )}
                </div>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mb-6">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  ⚠️ By checking in, you confirm you are physically present at the clinic.
                  You will be added to the waiting queue.
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                <Button variant="primary" onClick={handleCheckIn} loading={loading} className="flex-1 bg-green-500 hover:bg-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" /> Confirm Check-In
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              {/* Success state */}
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Ticket className="w-14 h-14 text-green-500" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Queue #{checkedIn.queueNumber}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">You have been added to the queue</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center border border-gray-200 dark:border-gray-700">
                  <Clock className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{checkedIn.estimatedWaitTime}</div>
                  <div className="text-xs text-gray-500">Est. Wait (min)</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center border border-gray-200 dark:border-gray-700">
                  <MapPin className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                  <div className="text-lg font-bold text-gray-900 dark:text-white capitalize">{checkedIn.department}</div>
                  <div className="text-xs text-gray-500">Department</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mb-6 text-sm text-blue-700 dark:text-blue-300">
                Please wait in the {checkedIn.department} waiting area. You will be called when it's your turn.
              </div>

              <Button variant="primary" onClick={handleDone} fullWidth>
                View Queue Status
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};