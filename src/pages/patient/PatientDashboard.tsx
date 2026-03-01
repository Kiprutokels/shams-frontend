/**
 * PatientDashboard.tsx
 * check-in button, AI no-show risk badge,
 * estimated wait time display, book appointment modal.
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@store/hooks";
import { Card } from "@components/common/Card/Card";
import { Button } from "@components/common/Button/Button";
import { Loader } from "@components/common/Loader/Loader";
import { BookAppointmentModal } from "@components/modals/BookAppointmentModal";
import { CheckInModal } from "@components/modals/CheckInModal";
import { appointmentService } from "@services/api/appointment.service";
import { userService } from "@services/api/user.service";
import { queueService } from "@services/api/queue.service";
import type { Appointment } from "@types";
import {
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Ticket,
  FileText,
  BookOpen,
  Timer,
  Settings,
  Droplet,
  Activity,
  Moon,
  Apple,
  LogIn,
} from "lucide-react";

interface DashboardStats {
  total: number;
  completed: number;
  upcoming: number;
  cancelled: number;
}
interface QueuePosition {
  position: number;
  estimatedWaitTime: number;
  queueNumber?: number;
}

export const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    Appointment[]
  >([]);
  const [queuePosition, setQueuePosition] = useState<QueuePosition | null>(
    null,
  );
  const [showBookModal, setShowBookModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, appointmentsData, queueData] = await Promise.all([
        userService.getStats(),
        appointmentService.getUpcoming(),
        queueService.getMyPosition().catch(() => null),
      ]);

      setStats({
        total: statsData.data?.total || 0,
        completed: statsData.data?.completed || 0,
        upcoming: statsData.data?.upcoming || 0,
        cancelled: statsData.data?.cancelled || 0,
      });
      setUpcomingAppointments(appointmentsData);
      if (queueData?.data) {
        setQueuePosition({
          position: queueData.data.position,
          estimatedWaitTime: (queueData.data as any).estimatedWaitTime ?? 0,
          queueNumber: (queueData.data as any).queueNumber,
        });
      }
    } catch (error) {
      console.error("Dashboard load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCheckIn = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setShowCheckInModal(true);
  };

  const isCheckInEligible = (apt: Appointment): boolean => {
    if (apt.checkedIn) return false;
    if (!["SCHEDULED", "CONFIRMED"].includes(apt.status)) return false;
    // Allow check-in 1 hour before until 30 min after
    const aptTime = new Date(apt.appointmentDate).getTime();
    const now = Date.now();
    return now >= aptTime - 60 * 60 * 1000 && now <= aptTime + 30 * 60 * 1000;
  };

  const getRiskBadge = (probability?: number) => {
    if (probability === undefined || probability === null) return null;
    if (probability < 0.3)
      return { label: "Low Risk", color: "bg-green-100 text-green-700" };
    if (probability < 0.6)
      return { label: "Medium Risk", color: "bg-amber-100 text-amber-700" };
    return { label: "High Risk", color: "bg-red-100 text-red-700" };
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-neutral-bg dark:bg-gray-950 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-neutral dark:text-gray-400">
            Manage your health and appointments
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowBookModal(true)}
          className="mt-4 md:mt-0 bg-primary hover:opacity-90"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Book Appointment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: Calendar,
            label: "Total",
            value: stats?.total || 0,
            border: "border-l-primary",
            bg: "bg-primary/10",
            color: "text-primary",
          },
          {
            icon: CheckCircle,
            label: "Completed",
            value: stats?.completed || 0,
            border: "border-l-secondary",
            bg: "bg-secondary/10",
            color: "text-secondary",
          },
          {
            icon: Clock,
            label: "Upcoming",
            value: stats?.upcoming || 0,
            border: "border-l-accent",
            bg: "bg-accent/10",
            color: "text-accent",
          },
          {
            icon: XCircle,
            label: "Cancelled",
            value: stats?.cancelled || 0,
            border: "border-l-warmRed",
            bg: "bg-warmRed/10",
            color: "text-warmRed",
          },
        ].map((s) => (
          <Card key={s.label} className={`border-l-4 ${s.border}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 ${s.bg} rounded-lg`}>
                <s.icon className={`w-7 h-7 ${s.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {s.value}
                </div>
                <div className="text-xs text-neutral font-semibold">
                  {s.label}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Queue Position Banner */}
      {queuePosition && (
        <Card className="mb-8 bg-linear-to-r from-blue-600 to-teal-600 text-white border-none">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Ticket className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">You're in the Queue!</h3>
                <p className="text-blue-100 text-sm">
                  Queue #{queuePosition.queueNumber} · Position{" "}
                  <strong>#{queuePosition.position}</strong>· Est. wait:{" "}
                  <strong>{queuePosition.estimatedWaitTime} min</strong>
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              onClick={() => navigate("/patient/queue-status")}
            >
              View Status
            </Button>
          </div>
        </Card>
      )}

      {/* Upcoming + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Upcoming Appointments */}
        <Card title="Upcoming Appointments" className="lg:col-span-2">
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-14 h-14 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No upcoming appointments
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBookModal(true)}
              >
                Book Now
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((apt) => {
                const risk = getRiskBadge(apt.noShowProbability ?? undefined);
                const canCheckIn = isCheckInEligible(apt);
                return (
                  <div
                    key={apt.id}
                    className="flex items-start gap-4 p-4 rounded-xl border-2 border-gray-100 dark:border-gray-800 hover:border-primary/40 transition-all"
                  >
                    {/* Date box */}
                    <div className="flex flex-col items-center justify-center w-14 h-14 bg-primary text-white rounded-xl shrink-0">
                      <div className="text-xl font-bold leading-none">
                        {new Date(apt.appointmentDate).getDate()}
                      </div>
                      <div className="text-xs uppercase">
                        {new Date(apt.appointmentDate).toLocaleDateString(
                          "en-US",
                          { month: "short" },
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-gray-900 dark:text-white">
                          Dr. {apt.doctor?.firstName} {apt.doctor?.lastName}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {apt.doctor?.specialization}
                        </span>
                        {risk && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${risk.color}`}
                          >
                            {risk.label}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {new Date(apt.appointmentDate).toLocaleTimeString(
                          "en-US",
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                        {apt.estimatedWaitTime && (
                          <span className="ml-2 text-xs text-amber-600">
                            ~{apt.estimatedWaitTime}min wait
                          </span>
                        )}
                      </p>
                      {apt.chiefComplaint && (
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {apt.chiefComplaint}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold text-center ${
                          apt.status === "CONFIRMED"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {apt.checkedIn ? "✓ Checked In" : apt.status}
                      </span>
                      {canCheckIn && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-xs"
                          onClick={() => handleOpenCheckIn(apt)}
                        >
                          <LogIn className="w-3 h-3 mr-1" /> Check In
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="space-y-3">
            {[
              {
                icon: FileText,
                title: "My Appointments",
                desc: "View & manage appointments",
                path: "/patient/appointments",
                color: "text-blue-500",
                bg: "bg-blue-50 dark:bg-blue-900/20",
              },
              {
                icon: BookOpen,
                title: "Medical History",
                desc: "View records & diagnoses",
                path: "/patient/medical-history",
                color: "text-teal-500",
                bg: "bg-teal-50 dark:bg-teal-900/20",
              },
              {
                icon: Timer,
                title: "Queue Status",
                desc: "Check your wait time",
                path: "/patient/queue-status",
                color: "text-amber-500",
                bg: "bg-amber-50 dark:bg-amber-900/20",
              },
              {
                icon: Settings,
                title: "Profile",
                desc: "Update your information",
                path: "/patient/profile",
                color: "text-purple-500",
                bg: "bg-purple-50 dark:bg-purple-900/20",
              },
            ].map((a) => (
              <button
                key={a.path}
                onClick={() => navigate(a.path)}
                className="w-full flex items-center gap-3 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary/50 hover:shadow-sm transition-all text-left"
              >
                <div className={`p-2 ${a.bg} rounded-lg`}>
                  <a.icon className={`w-5 h-5 ${a.color}`} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white text-sm">
                    {a.title}
                  </div>
                  <div className="text-xs text-gray-500">{a.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Health Tips */}
      <Card title="💡 Daily Health Tips">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              icon: Droplet,
              tip: "Drink 8+ glasses of water daily",
              color: "text-blue-500",
            },
            {
              icon: Activity,
              tip: "Exercise 30 minutes every day",
              color: "text-teal-500",
            },
            {
              icon: Moon,
              tip: "Get 7-8 hours of quality sleep",
              color: "text-purple-500",
            },
            {
              icon: Apple,
              tip: "Eat balanced meals with fruits & vegetables",
              color: "text-green-500",
            },
          ].map((t, i) => (
            <div
              key={i}
              className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl"
            >
              <t.icon className={`w-5 h-5 ${t.color} shrink-0`} />
              <p className="text-xs text-gray-700 dark:text-gray-300">
                {t.tip}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Modals */}
      <BookAppointmentModal
        isOpen={showBookModal}
        onClose={() => setShowBookModal(false)}
        onSuccess={() => loadDashboardData()}
      />
      <CheckInModal
        isOpen={showCheckInModal}
        onClose={() => setShowCheckInModal(false)}
        appointment={selectedAppointment}
        onSuccess={() => {
          loadDashboardData();
          navigate("/patient/queue-status");
        }}
      />
    </div>
  );
};
