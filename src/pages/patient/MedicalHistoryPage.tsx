import React, { useEffect, useState } from "react";
import { Card } from "@components/common/Card/Card";
import { Loader } from "@components/common/Loader/Loader";
import { userService } from "@services/api/user.service";
import { appointmentService } from "@services/api/appointment.service";
import type { User } from "@types";
import type { Appointment } from "@types";
import {
  BookOpen,
  Droplet,
  AlertTriangle,
  FileText,
  Calendar,
  Stethoscope,
  Pill,
} from "lucide-react";

export const MedicalHistoryPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<User | null>(null);
  const [completedAppointments, setCompletedAppointments] = useState<
    Appointment[]
  >([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [profileRes, history] = await Promise.all([
        userService.getProfile(),
        appointmentService.getHistory(),
      ]);

      setProfile((profileRes.data as unknown as User) ?? null);
      setCompletedAppointments(history ?? []);
    } catch (error) {
      console.error("Failed to load medical history:", error);
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

      {/* ── Health summary cards ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
{/* ── Patient Vital Cards ── */}
<Card className="border-l-4 border-l-[#EF5350] hover:shadow-md transition-shadow">
  <div className="flex items-center gap-4">
    <div className="p-3 bg-[#EF5350]/10 rounded-xl">
      <Droplet className="w-8 h-8 text-[#EF5350]" />
    </div>
    <div>
      <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral">
        Blood Type
      </h3>
      <p className="text-xl font-black text-gray-900 dark:text-white">
        {profile?.bloodType || "Not specified"}
      </p>
    </div>
  </div>
</Card>

<Card className="border-l-4 border-l-[#FFC107] hover:shadow-md transition-shadow">
  <div className="flex items-center gap-4">
    <div className="p-3 bg-[#FFC107]/10 rounded-xl">
      <AlertTriangle className="w-8 h-8 text-[#FFC107]" />
    </div>
    <div>
      <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral">
        Allergies
      </h3>
      <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2">
        {profile?.allergies || "None recorded"}
      </p>
    </div>
  </div>
</Card>

<Card className="border-l-4 border-l-[#0D47A1] hover:shadow-md transition-shadow">
  <div className="flex items-center gap-4">
    <div className="p-3 bg-[#0D47A1]/10 rounded-xl">
      <BookOpen className="w-8 h-8 text-[#0D47A1]" />
    </div>
    <div>
      <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral">
        Medical History
      </h3>
      <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2">
        {profile?.medicalHistory ? "View Full History" : "None recorded"}
      </p>
    </div>
  </div>
</Card>
      </div>

      {/* ── Medical history details  */}
      {profile?.medicalHistory && (
        <Card
          className="mb-8 border-l-4 border-l-secondary"
          title="Medical History Details"
        >
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {profile.medicalHistory}
          </p>
        </Card>
      )}

      {/* Appointment History */}
   {/* ── Appointment History ── */}
<Card
  title="Appointment History"
  className="border-l-4 border-l-[#0D47A1]"
>
  {completedAppointments.length === 0 ? (
    <div className="text-center py-14">
      <FileText className="w-16 h-16 text-neutral/30 mx-auto mb-4" />
      <p className="text-sm font-medium text-neutral dark:text-gray-400">
        No completed appointments yet
      </p>
    </div>
  ) : (
    <div className="space-y-4">
      {completedAppointments.map((apt) => (
        <div
          key={apt.id}
          className="p-4 rounded-xl border-2 border-gray-100 dark:border-gray-800
                     hover:border-[#0D47A1]/40 hover:bg-blue-50/20 dark:hover:bg-blue-900/5 
                     transition-all duration-200 group"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Date with Navy Accent */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0D47A1]" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {new Date(apt.appointmentDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Doctor with Secondary Green Accent */}
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-[#43A047]" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  Dr. {apt.doctor?.firstName} {apt.doctor?.lastName}
                </span>
                {apt.doctor?.specialization && (
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-[10px] font-bold text-neutral rounded uppercase tracking-wider">
                    {apt.doctor.specialization}
                  </span>
                )}
              </div>
            </div>

            {/* Status badge - Using a subtle 'Completed' Teal */}
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-800">
              {apt.status}
            </span>
          </div>

          {/* Clinical Details */}
          <div className="mt-4 grid grid-cols-1 gap-2">
            {apt.chiefComplaint && (
              <p className="text-xs text-neutral">
                <strong className="text-gray-700 dark:text-gray-300">Complaint:</strong> {apt.chiefComplaint}
              </p>
            )}
            {apt.diagnosis && (
              <p className="text-xs text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                <strong className="text-[#0D47A1] dark:text-blue-400">Diagnosis:</strong> {apt.diagnosis}
              </p>
            )}
            {apt.prescription && (
              <p className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2 mt-1">
                <Pill className="w-3.5 h-3.5 text-[#43A047] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#43A047]">Prescription:</strong> {apt.prescription}
                </span>
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )}
</Card>
    </div>
  );
};
