/**
 * ConsultationModal.tsx
 *
 * Doctor fills consultation records during/after seeing a patient.
 * Includes: vital signs, diagnosis, prescription, notes.
 * Also shows AI priority suggestion.
 */
import React, { useState, useEffect } from 'react';
import { appointmentService } from '@services/api/appointment.service';
import { aiService } from '@services/api/ai.service';
import { Button } from '@components/common/Button/Button';
import { Alert } from '@components/common/Alert/Alert';
import type { Appointment } from '@types';
import { X, Stethoscope, Pill, FileText, Activity, Zap, CheckCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onSuccess: () => void;
}

export const ConsultationModal: React.FC<Props> = ({ isOpen, onClose, appointment, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);

  const [formData, setFormData] = useState({
    status: 'IN_PROGRESS' as string,
    vitalSigns: '',
    diagnosis: '',
    prescription: '',
    notes: '',
    symptoms: '',
  });

  useEffect(() => {
    if (isOpen && appointment) {
      setFormData({
        status: 'IN_PROGRESS',
        vitalSigns: appointment.vitalSigns || '',
        diagnosis: appointment.diagnosis || '',
        prescription: appointment.prescription || '',
        notes: appointment.notes || '',
        symptoms: appointment.symptoms || '',
      });
      setError('');
      setAiSuggestion(null);
    }
  }, [isOpen, appointment]);

  const handleAiClassify = async () => {
    if (!appointment || !formData.diagnosis && !appointment.chiefComplaint) return;
    setAiLoading(true);
    try {
      const res = await aiService.classifyPriority({
        patient_id: appointment.patientId,
        appointment_id: appointment.id,
        chief_complaint: appointment.chiefComplaint || '',
        symptoms: formData.symptoms || appointment.symptoms,
        vital_signs: formData.vitalSigns ? { raw: formData.vitalSigns } : undefined,
        patient_age: undefined,
        medical_history: appointment.patient?.medicalHistory,
      });
      setAiSuggestion(res.data || res);
    } catch {
      // silent fail
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = async (complete = false) => {
    if (!appointment) return;
    setError('');
    if (complete && !formData.diagnosis.trim()) {
      setError('Diagnosis is required to complete the consultation');
      return;
    }
    setLoading(true);
    try {
      await appointmentService.update(appointment.id, {
        ...formData,
        status: complete ? 'COMPLETED' : 'IN_PROGRESS',
      } as any);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save consultation');
    } finally {
      setLoading(false);
    }
  };

  const priorityColors: Record<string, string> = {
    EMERGENCY: 'bg-red-100 text-red-700 border-red-300',
    HIGH:      'bg-orange-100 text-orange-700 border-orange-300',
    MEDIUM:    'bg-yellow-100 text-yellow-700 border-yellow-300',
    LOW:       'bg-green-100 text-green-700 border-green-300',
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto animate-slide-up border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Consultation – {appointment.patient?.firstName} {appointment.patient?.lastName}
            </h2>
            <p className="text-sm text-gray-500">
              {new Date(appointment.appointmentDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              {' · '}{appointment.appointmentType?.replace('_', ' ')}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}

          {/* Patient info strip */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="text-sm">
              <span className="text-gray-500">Patient:</span>
              <strong className="ml-2 text-gray-900 dark:text-white">
                {appointment.patient?.firstName} {appointment.patient?.lastName}
              </strong>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Blood Type:</span>
              <strong className="ml-2 text-gray-900 dark:text-white">
                {appointment.patient?.bloodType || 'Unknown'}
              </strong>
            </div>
            {appointment.patient?.allergies && (
              <div className="col-span-2 text-sm">
                <span className="text-red-500">⚠ Allergies:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{appointment.patient.allergies}</span>
              </div>
            )}
            {appointment.chiefComplaint && (
              <div className="col-span-2 text-sm">
                <span className="text-gray-500">Chief Complaint:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{appointment.chiefComplaint}</span>
              </div>
            )}
          </div>

          {/* AI Priority button */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">AI Priority Classification</span>
            <Button variant="outline" size="sm" onClick={handleAiClassify} loading={aiLoading}
              className="border-purple-400 text-purple-600 hover:bg-purple-50">
              <Zap className="w-4 h-4 mr-1" /> Run AI Analysis
            </Button>
          </div>

          {aiSuggestion && (
            <div className={`p-4 rounded-xl border ${priorityColors[aiSuggestion.priority_level?.toUpperCase()] || 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <strong className="font-bold">AI Priority: {aiSuggestion.priority_level?.toUpperCase()}</strong>
                <span className="text-xs">Score: {(aiSuggestion.priority_score * 100).toFixed(0)}%</span>
              </div>
              <p className="text-sm">{aiSuggestion.recommendation}</p>
              {aiSuggestion.urgency_factors?.length > 0 && (
                <ul className="mt-2 text-xs space-y-1">
                  {aiSuggestion.urgency_factors.map((f: string, i: number) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Vital Signs */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              <Activity className="w-4 h-4 inline mr-1 text-red-500" />
              Vital Signs
            </label>
            <textarea rows={2} placeholder="BP: 120/80, HR: 75, Temp: 37°C, SpO2: 98%, RR: 16"
              value={formData.vitalSigns}
              onChange={(e) => setFormData((p) => ({ ...p, vitalSigns: e.target.value }))}
              className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none text-sm"
            />
          </div>

          {/* Symptoms (updatable) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              <Stethoscope className="w-4 h-4 inline mr-1 text-teal-500" />
              Symptoms (Observed)
            </label>
            <textarea rows={2} placeholder="Clinical observation of symptoms..."
              value={formData.symptoms}
              onChange={(e) => setFormData((p) => ({ ...p, symptoms: e.target.value }))}
              className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none text-sm"
            />
          </div>

          {/* Diagnosis */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              <FileText className="w-4 h-4 inline mr-1 text-blue-500" />
              Diagnosis <span className="text-red-500">*</span>
            </label>
            <textarea rows={3} placeholder="Primary and secondary diagnoses..."
              value={formData.diagnosis}
              onChange={(e) => setFormData((p) => ({ ...p, diagnosis: e.target.value }))}
              className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none text-sm"
            />
          </div>

          {/* Prescription */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              <Pill className="w-4 h-4 inline mr-1 text-purple-500" />
              Prescription
            </label>
            <textarea rows={3} placeholder="Medication name, dosage, frequency, duration..."
              value={formData.prescription}
              onChange={(e) => setFormData((p) => ({ ...p, prescription: e.target.value }))}
              className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none text-sm"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Doctor's Notes
            </label>
            <textarea rows={2} placeholder="Follow-up instructions, referrals, special notes..."
              value={formData.notes}
              onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
              className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => handleSave(false)} loading={loading} className="flex-1">
              Save Draft
            </Button>
            <Button type="button" variant="primary" onClick={() => handleSave(true)} loading={loading}
              className="flex-1 bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" /> Complete & Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};