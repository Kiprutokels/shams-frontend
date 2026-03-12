import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@components/common/Card/Card";
import { Button } from "@components/common/Button/Button";
import { Loader } from "@components/common/Loader/Loader";
import { BookAppointmentModal } from "@components/modals/BookAppointmentModal";
import { CheckInModal } from "@components/modals/CheckInModal";
import { RescheduleAppointmentModal } from "@components/modals/RescheduleAppointmentModal";
import { appointmentService } from "@services/api/appointment.service";
import type { Appointment, AppointmentStatus } from "@types";
import {
  Calendar,
  Clock,
  Search,
  XCircle,
  ChevronRight,
  LogIn,
  Filter,
  CheckCircle,
  AlertCircle,
  Info,
  RefreshCw,
} from "lucide-react";

// ─── Status styles
const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  SCHEDULED: {
    bg: "bg-blue-100 dark:bg-blue-900/20",
    text: "text-blue-700 dark:text-blue-300",
  },
  CONFIRMED: {
    bg: "bg-green-100 dark:bg-green-900/20",
    text: "text-green-700 dark:text-green-300",
  },
  IN_PROGRESS: {
    bg: "bg-amber-100 dark:bg-amber-900/20",
    text: "text-amber-700 dark:text-amber-300",
  },
  COMPLETED: {
    bg: "bg-teal-100 dark:bg-teal-900/20",
    text: "text-teal-700 dark:text-teal-300",
  },
  CANCELLED: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-500" },
  NO_SHOW: {
    bg: "bg-red-100 dark:bg-red-900/20",
    text: "text-red-700 dark:text-red-300",
  },
  RESCHEDULED: {
    bg: "bg-amber-100 dark:bg-amber-900/20",
    text: "text-amber-700 dark:text-amber-300",
  },
};

const STATUS_TABS = [
  "",
  "SCHEDULED",
  "CONFIRMED",
  "RESCHEDULED",
  "COMPLETED",
  "CANCELLED",
] as const;

// ─── Check-in state types ─────────────────────────────────────────────────────
type CheckInState =
  | { state: "available" }
  | { state: "already_checked_in" }
  | { state: "too_early"; opensAt: Date }
  | { state: "too_late" }
  | { state: "not_applicable" };

const getCheckInState = (apt: Appointment): CheckInState => {
  if (apt.checkedIn) return { state: "already_checked_in" };
  if (!["SCHEDULED", "CONFIRMED"].includes(apt.status))
    return { state: "not_applicable" };

  const apptTime = new Date(apt.appointmentDate).getTime();
  const now = Date.now();
  const opensAt = apptTime - 3_600_000; // 1 h before
  const closesAt = apptTime + 1_800_000; // 30 min after

  if (now < opensAt) return { state: "too_early", opensAt: new Date(opensAt) };
  if (now > closesAt) return { state: "too_late" };
  return { state: "available" };
};

const fmtTime = (d: Date) =>
  d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

// ─── CheckInButton ────────────────────────────────────────────────────────────
const CheckInButton: React.FC<{
  apt: Appointment;
  onCheckIn: (apt: Appointment) => void;
}> = ({ apt, onCheckIn }) => {
  const ci = getCheckInState(apt);

  if (ci.state === "not_applicable" || ci.state === "already_checked_in")
    return null;

  const isEnabled = ci.state === "available";
  const hintText =
    ci.state === "too_early"
      ? `Check-in opens at ${fmtTime(ci.opensAt)}`
      : ci.state === "too_late"
        ? "Check-in window has closed"
        : null;

  return (
    <div className="flex flex-col items-center gap-0.5">
      <button
        disabled={!isEnabled}
        onClick={(e) => {
          e.stopPropagation();
          if (isEnabled) onCheckIn(apt);
        }}
        title={hintText ?? "Check in for your appointment"}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold
          transition-all border
          ${
            isEnabled
              ? "bg-green-500 hover:bg-green-600 text-white border-green-500 cursor-pointer shadow-sm hover:shadow-md"
              : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-70"
          }`}
      >
        <LogIn
          className={`w-3 h-3 ${isEnabled ? "text-white" : "text-gray-400"}`}
        />
        Check In
        <span
          className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold leading-none
          ${
            isEnabled
              ? "bg-green-600/30 text-green-100"
              : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
          }`}
        >
          {isEnabled ? "OPEN" : "LOCKED"}
        </span>
      </button>
      {hintText && (
        <span className="text-[10px] text-gray-400 dark:text-gray-500 text-center leading-tight max-w-25">
          {hintText}
        </span>
      )}
    </div>
  );
};

// ─── Page ─
export const MyAppointmentsPage: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");

  // ── Modal states ──────────────────────────────────────────────────────────
  const [showBookModal, setShowBookModal] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);

  // ─── Load appointments ────────────────────────────────────────────────────
  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, unknown> = {};
      if (filter) params.status = filter;
      const response = await appointmentService.getAll(params);
      setAppointments(response.data);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  // ─── Derived ──────────────────────────────────────────────────────────────
  const filtered = appointments.filter((apt) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const doc = apt.doctor
      ? `Dr. ${apt.doctor.firstName} ${apt.doctor.lastName}`.toLowerCase()
      : "unassigned";
    const cc = (apt.chiefComplaint ?? "").toLowerCase();
    return doc.includes(term) || cc.includes(term);
  });

  const getStyle = (s: string) => STATUS_STYLES[s] ?? STATUS_STYLES.SCHEDULED;

  // ─── Cancel ───────────────────────────────────────────────────────────────
  const handleCancel = async (id: number) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await appointmentService.cancel(id);
      loadAppointments();
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Failed to cancel appointment");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-neutral-bg dark:bg-gray-950 p-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            My Appointments
          </h1>
          <p className="text-neutral dark:text-gray-400">
            View, reschedule, check-in, and manage your appointments
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowBookModal(true)}
          className="border-[#1565C0] text-[#1565C0] hover:bg-[#1565C0] hover:text-white transition-colors"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Book New
        </Button>
      </div>

      {/* ── Check-in info banner ────────────────────────────────────────────── */}
      <div
        className="mb-6 flex items-start gap-3 px-4 py-3 rounded-xl
                      bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
      >
        <Info className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
            How Check-In Works
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5 leading-relaxed">
            The <span className="font-bold">Check In</span> button becomes
            active <span className="font-bold">1 hour before</span> your
            appointment and stays open until{" "}
            <span className="font-bold">30 minutes after</span> the scheduled
            time. The <span className="font-bold">Reschedule</span> button is
            available for any SCHEDULED or CONFIRMED appointment.
          </p>
        </div>
      </div>

{/* ── Filters */}
<Card className="mb-6 border-l-4 border-l-[#0D47A1]">
  <div className="flex flex-col md:flex-row gap-4">
    {/* Search Input with Hover & Focus Effects */}
    <div className="relative flex-1 group">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral group-focus-within:text-[#0D47A1] transition-colors" />
      <input
        type="text"
        placeholder="Search by doctor or complaint…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 dark:border-gray-700
                   rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium
                   transition-all duration-200
                   hover:border-[#0D47A1]/40 hover:bg-blue-50/20 dark:hover:bg-blue-900/5
                   focus:outline-none focus:border-[#0D47A1] focus:ring-4 focus:ring-[#0D47A1]/10"
      />
    </div>

    {/* Filter Buttons */}
    <div className="flex gap-2 flex-wrap items-center">
      <Filter className="w-4 h-4 text-[#0D47A1]" />
      {STATUS_TABS.map((s) => (
        <button
          key={s || "all"}
          onClick={() => setFilter(s)}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
            filter === s
              ? "bg-[#0D47A1] text-white shadow-md shadow-blue-900/20"
              : "bg-gray-100 dark:bg-gray-800 text-neutral hover:bg-[#0D47A1]/10 hover:text-[#0D47A1] dark:hover:bg-gray-700"
          }`}
        >
          {s || "All"}
        </button>
      ))}
    </div>
  </div>
</Card>

      {/* ── Appointment list ────────────────────────────────────────────────── */}
      <Card
        title={`Appointments (${filtered.length})`}
        className="border-l-4 border-l-[#0D47A1]"
      >
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-neutral mb-4">No appointments found</p>
            <Button variant="primary" onClick={() => setShowBookModal(true)}>
              Book Appointment
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((apt) => {
              const style = getStyle(apt.status as AppointmentStatus);
              const canCancel = ["SCHEDULED", "CONFIRMED"].includes(apt.status);
              const canReschedule = ["SCHEDULED", "CONFIRMED"].includes(
                apt.status,
              );
              const isConfirmed = !!apt.confirmedAt;
              const isPending = apt.status === "SCHEDULED" && !apt.confirmedAt;
              const ci = getCheckInState(apt);

              const doctorTitle = apt.doctor
                ? `Dr. ${apt.doctor.firstName} ${apt.doctor.lastName}`
                : "Any Available Doctor";

              const showCheckInSection =
                ci.state !== "not_applicable" &&
                ci.state !== "already_checked_in";

              return (
                <div
                  key={apt.id}
                  className="flex items-center gap-4 p-4 rounded-xl border-2
                             border-gray-100 dark:border-gray-800
                             hover:border-primary/30 transition-all"
                >
                  {/* ── Date block ────────────────────────────────────────── */}
                  <div
                    className="flex flex-col items-center w-14 h-14
                                  bg-primary/10 border-l-4 border-l-primary
                                  rounded-xl shrink-0 justify-center"
                  >
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {new Date(apt.appointmentDate).getDate()}
                    </div>
                    <div className="text-xs font-semibold text-primary uppercase">
                      {new Date(apt.appointmentDate).toLocaleDateString(
                        "en-US",
                        { month: "short" },
                      )}
                    </div>
                  </div>

                  {/* ── Info ──────────────────────────────────────────────── */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        {doctorTitle}
                      </h4>
                      {apt.checkedIn && (
                        <span
                          className="text-xs bg-green-100 text-green-700
                                         dark:bg-green-900/30 dark:text-green-400
                                         px-2 py-0.5 rounded-full font-bold flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" /> Checked In
                        </span>
                      )}
                      {isPending && (
                        <span
                          className="text-xs bg-amber-100 text-amber-700
                                         dark:bg-amber-900/30 dark:text-amber-400
                                         px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" /> Awaiting
                          Confirmation
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-neutral">
                      {apt.doctor?.specialization ?? "—"}
                    </p>

                    <p className="text-sm text-neutral flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {new Date(apt.appointmentDate).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                      {" · "}
                      {apt.durationMinutes} min
                    </p>

                    {apt.chiefComplaint && (
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {apt.chiefComplaint}
                      </p>
                    )}

                    {isConfirmed && (
                      <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-0.5">
                        <CheckCircle className="w-3 h-3" /> Confirmed by clinic
                      </p>
                    )}

                    {/* Check-in window hints */}
                    {showCheckInSection && ci.state === "too_early" && (
                      <p
                        className="text-[11px] text-amber-600 dark:text-amber-400
                                    flex items-center gap-1 mt-1 font-medium"
                      >
                        <Clock className="w-3 h-3" />
                        Check-in opens at{" "}
                        <span className="font-bold ml-1">
                          {fmtTime(ci.opensAt)}
                        </span>
                      </p>
                    )}
                    {showCheckInSection && ci.state === "too_late" && (
                      <p
                        className="text-[11px] text-red-500 dark:text-red-400
                                    flex items-center gap-1 mt-1 font-medium"
                      >
                        <XCircle className="w-3 h-3" /> Check-in window has
                        passed
                      </p>
                    )}
                    {showCheckInSection && ci.state === "available" && (
                      <p
                        className="text-[11px] text-green-600 dark:text-green-400
                                    flex items-center gap-1 mt-1 font-medium"
                      >
                        <CheckCircle className="w-3 h-3" /> Check-in is open
                        now!
                      </p>
                    )}
                  </div>

                  {/* ── Status badge ──────────────────────────────────────── */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${style.bg} ${style.text}`}
                  >
                    {apt.status}
                  </span>

                  {/* ── Actions ───────────────────────────────────────────── */}
                  <div className="flex flex-col gap-2 shrink-0 items-end">
                    <div className="flex gap-2 items-center flex-wrap justify-end">
                      {/* Check-in */}
                      <CheckInButton
                        apt={apt}
                        onCheckIn={(a) => {
                          setSelectedApt(a);
                          setShowCheckIn(true);
                        }}
                      />

                      {/* Reschedule */}
                      {canReschedule && (
                        <Button
                          variant="outline"
                          size="sm"
                          title="Reschedule appointment"
                          className="border-amber-300 text-amber-600 hover:bg-amber-50
                                     dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-900/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRescheduleApt(apt);
                            setShowReschedule(true);
                          }}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Cancel */}
                      {canCancel && (
                        <Button
                          variant="outline"
                          size="sm"
                          title="Cancel appointment"
                          className="border-red-300 text-red-500 hover:bg-red-50
                                     dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancel(apt.id);
                          }}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Detail chevron */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-300"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* ── Modals  */}
      <BookAppointmentModal
        isOpen={showBookModal}
        onClose={() => setShowBookModal(false)}
        onSuccess={loadAppointments}
      />

      <CheckInModal
        isOpen={showCheckIn}
        onClose={() => setShowCheckIn(false)}
        appointment={selectedApt}
        onSuccess={() => {
          loadAppointments();
          navigate("/patient/queue-status");
        }}
      />

      <RescheduleAppointmentModal
        isOpen={showReschedule}
        onClose={() => {
          setShowReschedule(false);
          setRescheduleApt(null);
        }}
        appointment={rescheduleApt}
        onSuccess={loadAppointments}
      />
    </div>
  );
};
