import React, { useEffect, useState, useCallback } from "react";

import { Card } from "@components/common/Card/Card";
import { Loader } from "@components/common/Loader/Loader";
import { appointmentService } from "@services/api/appointment.service";
import type { Appointment, PaginatedResponse } from "@types";
import {
  Calendar,
  Search,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

// ─── Status badge styles ──────────────────────────────────────────────────────
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
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
  "RESCHEDULED",
] as const;

// ─── Label helpers ────────────────────────────────────────────────────────────
const TAB_LABELS: Record<string, string> = {
  "": "All",
  SCHEDULED: "Scheduled",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "No-Show",
  RESCHEDULED: "Rescheduled",
};

export const AdminAppointmentsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [silentLoading, setSilentLoading] = useState(false); 
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pagination, setPagination] = useState<
    PaginatedResponse<Appointment>["pagination"] | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  // ─── Load (silent = skip full-page loader) ─────────────────────────────────
  const loadAppointments = useCallback(
    async (silent = false) => {
      try {
        silent ? setSilentLoading(true) : setLoading(true);

        const params: Record<string, unknown> = {};
        if (statusFilter) params.status = statusFilter;

        const response = await appointmentService.getAll(params);
        setAppointments(response.data);
        setPagination(response.pagination);
      } catch (err) {
        console.error("Failed to load appointments:", err);
        setAppointments([]);
      } finally {
        setLoading(false);
        setSilentLoading(false);
      }
    },
    [statusFilter],
  );

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleConfirm = async (id: number) => {
    setConfirmingId(id);
    try {
      await appointmentService.confirm(id);

      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                status: "CONFIRMED" as Appointment["status"],
                confirmedAt: new Date().toISOString(),
              }
            : a,
        ),
      );
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Failed to confirm appointment");
    } finally {
      setConfirmingId(null);
    }
  };

  // ─── Client-side search ───────────────────────────────────────────────────
  const filtered = appointments.filter((apt) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const patient =
      `${apt.patient?.firstName ?? ""} ${apt.patient?.lastName ?? ""}`.toLowerCase();
    const doctor =
      `${apt.doctor?.firstName ?? ""} ${apt.doctor?.lastName ?? ""}`.toLowerCase();
    return patient.includes(term) || doctor.includes(term);
  });

  const getStyle = (status: string) =>
    STATUS_STYLES[status] ?? STATUS_STYLES.SCHEDULED;

  // ─── Full-page initial loader ─────────────────────────────────────────────
  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-neutral-bg dark:bg-gray-950 p-3 sm:p-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Appointments
          </h1>
          <p className="text-sm text-neutral dark:text-gray-400">
            Manage all system appointments — confirm, review, and track
          </p>
        </div>

        <div className="flex items-center gap-3 self-start">
          {/* Silent-refresh spinner */}
          {silentLoading && (
            <RefreshCw className="w-4 h-4 text-navy animate-spin" />
          )}
          {pagination && (
            <span className="text-sm font-medium text-neutral dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              {pagination.total} total
            </span>
          )}
        </div>
      </div>

      {/* ── Filters ────────────────────────────────────────────────────────── */}
      <Card className="mb-4 sm:mb-6 border-l-4 border-l-navy">
        <div className="flex flex-col gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral pointer-events-none" />
            <input
              type="text"
              placeholder="Search by patient or doctor name…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm
                         focus:outline-none focus:border-navy transition-colors"
            />
          </div>

          {/* Status tabs — horizontally scrollable on mobile */}
          <div
            className="flex gap-1.5 overflow-x-auto pb-0.5 -mx-1 px-1
                          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {STATUS_TABS.map((s) => (
              <button
                key={s || "all"}
                onClick={() => setStatusFilter(s)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0
                  ${
                    statusFilter === s
                      ? "bg-navy text-white shadow-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-neutral hover:bg-gray-200 dark:hover:bg-gray-700"
                  }
                `}
              >
                {TAB_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* ── Appointments list ───────────────────────────────────────────────── */}
      <Card
        title={`Appointments (${filtered.length})`}
        className="border-l-4 border-l-navy"
      >
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3">
            <Calendar className="w-14 h-14 text-neutral/40" />
            <p className="text-sm text-neutral dark:text-gray-400">
              No appointments found
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((apt) => {
              const style = getStyle(apt.status);
              const doctorLabel = apt.doctor
                ? `Dr. ${apt.doctor.firstName} ${apt.doctor.lastName}`
                : "Unassigned";
              const canConfirm =
                apt.status === "SCHEDULED" || apt.status === "RESCHEDULED";
              const apptDate = new Date(apt.appointmentDate);

              return (
                <div
                  key={apt.id}
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-700
                             hover:border-navy/40 hover:shadow-sm transition-all p-3 sm:p-4"
                >
                  {/* ── Row 1: date block + main info + status badge ── */}
                  <div className="flex items-start gap-3">
                    {/* Date block */}
                    <div
                      className="flex flex-col items-center justify-center
                                    w-12 h-12 sm:w-16 sm:h-16 shrink-0
                                    bg-navy/10 dark:bg-navy/20 rounded-xl border-l-4 border-l-navy"
                    >
                      <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white leading-none">
                        {apptDate.getDate()}
                      </span>
                      <span className="text-[10px] sm:text-xs font-semibold text-navy uppercase">
                        {apptDate.toLocaleDateString("en-US", {
                          month: "short",
                        })}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      {/* Names + status badge (badge floats right on ALL breakpoints) */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                            <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                              {apt.patient?.firstName} {apt.patient?.lastName}
                            </span>
                            <span className="text-neutral text-xs shrink-0">
                              →
                            </span>
                            <span className="font-semibold text-gray-600 dark:text-gray-400 text-xs sm:text-sm truncate">
                              {doctorLabel}
                            </span>
                          </div>

                          {/* Time / type / duration */}
                          <p className="text-xs text-neutral dark:text-gray-500 mt-0.5">
                            {apptDate.toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {" · "}
                            {apt.appointmentType?.replace(/_/g, " ")}
                            {" · "}
                            {apt.durationMinutes}&nbsp;min
                          </p>

                          {/* Chief complaint */}
                          {apt.chiefComplaint && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 truncate mt-0.5">
                              {apt.chiefComplaint}
                            </p>
                          )}

                          {/* Confirmed-at timestamp */}
                          {apt.confirmedAt && (
                            <p className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mt-0.5">
                              <CheckCircle className="w-3 h-3 shrink-0" />
                              Confirmed{" "}
                              {new Date(apt.confirmedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>

                        {/* Status badge — always top-right */}
                        <span
                          className={`
                          shrink-0 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold
                          ${style.bg} ${style.text}
                        `}
                        >
                          {apt.status.replace(/_/g, "\u00A0")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ── Row 2 (conditional): action buttons ── */}
                  {(canConfirm || apt.status === "NO_SHOW") && (
                    <div
                      className="flex items-center justify-end gap-2 mt-2.5 pt-2.5
                                    border-t border-gray-100 dark:border-gray-800"
                    >
                      {apt.status === "NO_SHOW" && (
                        <span className="flex items-center gap-1 text-xs text-red-500 font-medium mr-auto">
                          <AlertCircle className="w-3.5 h-3.5" />
                          No-show recorded
                        </span>
                      )}

                      {canConfirm && (
                        <button
                          onClick={() => handleConfirm(apt.id)}
                          disabled={confirmingId === apt.id}
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold
                                     bg-green-500 hover:bg-green-600 active:bg-green-700
                                     disabled:opacity-50 disabled:cursor-not-allowed
                                     text-white transition-all shadow-sm hover:shadow"
                        >
                          <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                          {confirmingId === apt.id ? "Confirming…" : "Confirm"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
