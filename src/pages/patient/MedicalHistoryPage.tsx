import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@store/hooks';
import { Card } from '@components/common/Card/Card';
import { Loader } from '@components/common/Loader/Loader';
import { userService } from '@services/api/user.service';
import { appointmentService } from '@services/api/appointment.service';
import type { User } from '@types';
import type { Appointment } from '@types';
import {
  BookOpen,
  Droplet,
  AlertTriangle,
  FileText,
  Calendar,
  Stethoscope,
  Pill,
} from 'lucide-react';

export const MedicalHistoryPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<User | null>(null);
  const [completedAppointments, setCompletedAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileRes, historyRes] = await Promise.all([
        userService.getProfile(),
        appointmentService.getHistory(),
      ]);
      setProfile(profileRes.data ?? null);
      setCompletedAppointments(historyRes.data ?? []);
    } catch (error) {
      console.error('Failed to load medical history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-neutral-bg dark:bg-gray-950 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Medical History
        </h1>
        <p className="text-neutral dark:text-gray-400">
          Your health records and appointment history
        </p>
      </div>

      {/* Health Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-primary">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-xl">
              <Droplet className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-sm text-neutral font-semibold">Blood Type</h3>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {profile?.bloodType || 'Not specified'}
              </p>
            </div>
          </div>
        </Card>
        <Card className="border-l-4 border-l-accent">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/20 rounded-xl">
              <AlertTriangle className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h3 className="text-sm text-neutral font-semibold">Allergies</h3>
              <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2">
                {profile?.allergies || 'None recorded'}
              </p>
            </div>
          </div>
        </Card>
        <Card className="border-l-4 border-l-secondary">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary/20 rounded-xl">
              <BookOpen className="w-8 h-8 text-secondary" />
            </div>
            <div>
              <h3 className="text-sm text-neutral font-semibold">Medical History</h3>
              <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2">
                {profile?.medicalHistory ? 'View below' : 'None recorded'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Medical History Details */}
      {profile?.medicalHistory && (
        <Card className="mb-8 border-l-4 border-l-secondary" title="Medical History Details">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {profile.medicalHistory}
          </p>
        </Card>
      )}

      {/* Appointment History */}
      <Card
        title="Appointment History"
        className="border-l-4 border-l-primary"
      >
        {completedAppointments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-neutral mx-auto mb-4" />
            <p className="text-neutral dark:text-gray-400">
              No completed appointments yet
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {completedAppointments.map((apt) => (
              <div
                key={apt.id}
                className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-all"
              >
                <div className="flex flex-wrap items-start gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {new Date(apt.appointmentDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-secondary" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Dr. {apt.doctor?.firstName} {apt.doctor?.lastName}
                    </span>
                    <span className="text-neutral text-sm">
                      {apt.doctor?.specialization}
                    </span>
                  </div>
                </div>
                {apt.chiefComplaint && (
                  <p className="mt-2 text-sm text-neutral">
                    <strong>Complaint:</strong> {apt.chiefComplaint}
                  </p>
                )}
                {apt.diagnosis && (
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    <strong>Diagnosis:</strong> {apt.diagnosis}
                  </p>
                )}
                {apt.prescription && (
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                    <Pill className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <span>
                      <strong>Prescription:</strong> {apt.prescription}
                    </span>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
