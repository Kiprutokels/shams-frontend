/**
 * DoctorQueuePage.tsx
 * Full queue management with consultation modal.
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@components/common/Card/Card";
import { Button } from "@components/common/Button/Button";
import { Loader } from "@components/common/Loader/Loader";
import { ConsultationModal } from "@components/modals/ConsultationModal";
import { queueService } from "@services/api/queue.service";
import { appointmentService } from "@services/api/appointment.service";
import type { Queue, QueueStatus, Appointment } from "@types";
import { Users, Phone, ChevronRight, Clock, Stethoscope } from "lucide-react";

const STATUS_CONFIG: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  WAITING: {
    bg: "bg-amber-100 dark:bg-amber-900/20",
    text: "text-amber-700 dark:text-amber-300",
    label: "Waiting",
  },
  CALLED: {
    bg: "bg-blue-100 dark:bg-blue-900/20",
    text: "text-blue-700 dark:text-blue-300",
    label: "Called",
  },
  IN_SERVICE: {
    bg: "bg-teal-100 dark:bg-teal-900/20",
    text: "text-teal-700 dark:text-teal-300",
    label: "In Service",
  },
  COMPLETED: {
    bg: "bg-green-100 dark:bg-green-900/20",
    text: "text-green-700 dark:text-green-300",
    label: "Completed",
  },
  SKIPPED: {
    bg: "bg-red-100 dark:bg-red-900/20",
    text: "text-red-700 dark:text-red-300",
    label: "No-Show",
  },
};

export const DoctorQueuePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [queueList, setQueueList] = useState<Queue[]>([]);
  const [filter, setFilter] = useState<string>("WAITING");
  const [showConsultation, setShowConsultation] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    loadQueue();
  }, [filter]);

  const loadQueue = async () => {
    try {
      setLoading(true);
      const res = await queueService.getAll({ status: filter || undefined });
      setQueueList(Array.isArray(res.data) ? res.data : []);
    } catch {
      setQueueList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (entry: Queue, newStatus: string) => {
    try {
      await queueService.update(Number(entry.id), { status: newStatus as any });
      loadQueue();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartConsultation = async (entry: Queue) => {
    if (!entry.appointmentId) {
      // If no appointment linked, just mark in service
      handleAction(entry, "IN_SERVICE");
      return;
    }
    try {
      const res = await appointmentService.getById(entry.appointmentId);
      setSelectedAppointment(res || null);
      setShowConsultation(true);
      if (entry.status === "CALLED") {
        await queueService.update(Number(entry.id), { status: "IN_SERVICE" });
      }
    } catch {
      handleAction(entry, "IN_SERVICE");
    }
  };

  const statsData = [
    {
      label: "Waiting",
      count: queueList.length > 0 ? 0 : 0,
      status: "WAITING",
      border: "border-l-amber-500",
    },
    {
      label: "In Service",
      count: 0,
      status: "IN_SERVICE",
      border: "border-l-teal-500",
    },
    {
      label: "Completed",
      count: 0,
      status: "COMPLETED",
      border: "border-l-green-500",
    },
    {
      label: "Total",
      count: queueList.length,
      status: "",
      border: "border-l-blue-500",
    },
  ];

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-neutral-bg dark:bg-gray-950 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Queue Management
          </h1>
          <p className="text-neutral dark:text-gray-400">
            Manage patient flow in real-time
          </p>
        </div>
        <Button
          variant="outline"
          className="border-primary text-primary"
          onClick={loadQueue}
        >
          Refresh Queue
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsData.map((s) => (
          <div
            key={s.label}
            onClick={() => s.status && setFilter(s.status)}
            className="cursor-pointer"
          >
            <Card
              className={`border-l-4 ${s.border} hover:shadow-md transition-all`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Users className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {s.count}
                  </div>
                  <div className="text-xs text-neutral font-semibold">
                    {s.label}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {["WAITING", "CALLED", "IN_SERVICE", "COMPLETED", ""].map((s) => (
          <button
            key={s || "all"}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap text-sm ${
              filter === s
                ? "bg-primary text-white"
                : "bg-white dark:bg-gray-800 text-neutral hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {/* Queue List */}
      <Card
        title={`Queue (${queueList.length})`}
        className="border-l-4 border-l-teal-500"
      >
        {queueList.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-neutral dark:text-gray-400">
              No patients in {filter.toLowerCase().replace("_", " ")} queue
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {queueList.map((entry, index) => {
              const cfg =
                STATUS_CONFIG[entry.status as QueueStatus] ||
                STATUS_CONFIG.WAITING;
              const isNext = index === 0 && filter === "WAITING";

              return (
                <div
                  key={entry.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    isNext
                      ? "border-amber-400 bg-amber-50/50 dark:bg-amber-900/10"
                      : "border-gray-200 dark:border-gray-700 hover:border-primary/30"
                  }`}
                >
                  {/* Queue Number */}
                  <div className="text-2xl font-bold text-primary w-12 text-center shrink-0">
                    #{entry.queueNumber}
                  </div>

                  {/* Status Icon */}
                  <div className={`p-2 rounded-lg ${cfg.bg} shrink-0`}>
                    <Clock className={`w-5 h-5 ${cfg.text}`} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        {entry.patientName}
                      </h4>
                      {entry.isEmergency && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                          EMERGENCY
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral">
                      {entry.serviceType} · {entry.department}
                    </p>
                    <div className="flex gap-4 text-xs text-neutral mt-1">
                      <span>Wait: {entry.estimatedWaitTime ?? "–"} min</span>
                      {entry.doctorName && <span>Dr: {entry.doctorName}</span>}
                    </div>
                  </div>

                  {/* Status */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text} shrink-0`}
                  >
                    {cfg.label}
                  </span>

                  {/* Action Buttons */}
                  <div className="flex gap-2 shrink-0 flex-wrap justify-end">
                    {entry.status === "WAITING" && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          className="bg-blue-500 hover:bg-blue-600 text-xs"
                          onClick={() => handleAction(entry, "CALLED")}
                        >
                          <Phone className="w-3 h-3 mr-1" /> Call
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-300 text-red-500 text-xs"
                          onClick={() => handleAction(entry, "SKIPPED")}
                        >
                          No-Show
                        </Button>
                      </>
                    )}

                    {entry.status === "CALLED" && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="bg-teal-500 hover:bg-teal-600 text-xs"
                        onClick={() => handleStartConsultation(entry)}
                      >
                        <Stethoscope className="w-3 h-3 mr-1" /> Start
                      </Button>
                    )}

                    {entry.status === "IN_SERVICE" && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          className="bg-teal-500 hover:bg-teal-600 text-xs"
                          onClick={() => handleStartConsultation(entry)}
                        >
                          <Stethoscope className="w-3 h-3 mr-1" /> Consult
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-xs"
                          onClick={() => handleAction(entry, "COMPLETED")}
                        >
                          Done
                        </Button>
                      </>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-xs"
                      onClick={() =>
                        entry.appointmentId &&
                        navigate(`/doctor/appointments/${entry.appointmentId}`)
                      }
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={showConsultation}
        onClose={() => setShowConsultation(false)}
        appointment={selectedAppointment}
        onSuccess={() => {
          loadQueue();
          setShowConsultation(false);
        }}
      />
    </div>
  );
};
