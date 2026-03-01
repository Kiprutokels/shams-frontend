/**
 * QueueStatusPage.tsx
 * Real-time queue position with WebSocket support + AI wait time estimate.
 */
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@store/hooks";
import { Card } from "@components/common/Card/Card";
import { Button } from "@components/common/Button/Button";
import { Loader } from "@components/common/Loader/Loader";
import { queueService } from "@services/api/queue.service";
import { aiService } from "@services/api/ai.service";
import {
  Ticket,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  TrendingDown,
  MapPin,
  User,
  DoorOpen,
  Calendar,
} from "lucide-react";

interface QueueData {
  id: number;
  position: number;
  estimatedWaitTime: number;
  queueNumber: number;
  department: string;
  status: string;
  doctorName?: string;
  roomNumber?: string;
}

const STATUS_STYLES: Record<
  string,
  {
    bg: string;
    text: string;
    label: string;
    icon: React.ElementType;
    accent: string;
  }
> = {
  WAITING: {
    bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700",
    text: "text-amber-700 dark:text-amber-300",
    label: "Waiting",
    icon: Clock,
    accent: "border-l-amber-500",
  },
  CALLED: {
    bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700",
    text: "text-blue-700 dark:text-blue-300",
    label: "Called – Please proceed!",
    icon: AlertCircle,
    accent: "border-l-blue-500",
  },
  IN_SERVICE: {
    bg: "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-700",
    text: "text-teal-700 dark:text-teal-300",
    label: "In Service",
    icon: CheckCircle,
    accent: "border-l-teal-500",
  },
  COMPLETED: {
    bg: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700",
    text: "text-green-700 dark:text-green-300",
    label: "Completed",
    icon: CheckCircle,
    accent: "border-l-green-500",
  },
};

export const QueueStatusPage: React.FC = () => {
  const navigate = useNavigate();
  useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [queueData, setQueueData] = useState<QueueData | null>(null);
  const [error, setError] = useState("");
  const [aiWaitTime, setAiWaitTime] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // ─── Load ──────────────────────────────────────────────────────────────────
  const loadQueueStatus = useCallback(async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError("");

      const response = await queueService.getMyPosition();
      if (response?.data) {
        const d = response.data as any;
        setQueueData({
          id: d.id,
          position: d.position,
          estimatedWaitTime: d.estimatedWaitTime ?? 0,
          queueNumber: d.queueNumber,
          department: d.department,
          status: d.status,
          doctorName: d.doctorName,
          roomNumber: d.roomNumber,
        });
        setLastUpdated(new Date());

        // AI wait time estimate
        try {
          const aiRes = await aiService.estimateWaitTime({
            doctor_id: 0,
            appointment_date: new Date().toISOString(),
            appointment_type: d.serviceType || "CONSULTATION",
            current_queue_length: d.position || 1,
            time_of_day: (() => {
              const h = new Date().getHours();
              return h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
            })(),
            day_of_week: new Date().toLocaleDateString("en-US", {
              weekday: "long",
            }),
          });
          setAiWaitTime(
            (aiRes as any).data?.estimated_wait_time ??
              (aiRes as any).estimated_wait_time ??
              null,
          );
        } catch {
          /* silent */
        }
      } else {
        setQueueData(null);
      }
    } catch {
      setQueueData(null);
      setError("Unable to load queue status");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadQueueStatus();
    const interval = setInterval(() => loadQueueStatus(true), 30000);
    return () => clearInterval(interval);
  }, [loadQueueStatus]);

  const getStatusConfig = (status: string) =>
    STATUS_STYLES[status] ?? STATUS_STYLES.WAITING;

  const displayWait = aiWaitTime ?? queueData?.estimatedWaitTime ?? 0;
  const progressPct = queueData
    ? Math.max(10, 100 - (queueData.position - 1) * 15)
    : 10;

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-neutral-bg dark:bg-gray-950 p-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Queue Status
          </h1>
          <p className="text-neutral dark:text-gray-400">
            {lastUpdated
              ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
              : "Real-time queue position tracking"}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => loadQueueStatus(true)}
          className="mt-4 md:mt-0 border-primary text-primary"
          disabled={refreshing}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Refreshing…" : "Refresh"}
        </Button>
      </div>

      {/* ── Error Banner ───────────────────────────────────────────────────── */}
      {error && (
        <Card className="mb-6 border-l-4 border-l-red-500">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        </Card>
      )}

      {queueData ? (
        <>
          {/* ── CALLED alert ─────────────────────────────────────────────── */}
          {queueData.status === "CALLED" && (
            <div className="mb-6 p-4 bg-blue-600 text-white rounded-2xl shadow-lg animate-pulse">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-8 h-8 shrink-0" />
                <div>
                  <p className="font-bold text-lg">
                    Your Name Was Just Called!
                  </p>
                  <p className="text-blue-100 text-sm">
                    Please proceed to the consultation room immediately.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Main grid ────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Queue ticket card — spans 2 cols on large screens */}
            <Card
              className={`lg:col-span-2 border-2 border-l-4
                          ${getStatusConfig(queueData.status).bg}
                          ${getStatusConfig(queueData.status).accent}`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* Ticket icon */}
                <div className="p-5 bg-primary/10 rounded-2xl shrink-0">
                  <Ticket className="w-14 h-14 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  {/* Queue number + badge */}
                  <div className="flex flex-wrap items-baseline gap-3 mb-3">
                    <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
                      #{queueData.queueNumber}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold border
                                  ${getStatusConfig(queueData.status).bg}
                                  ${getStatusConfig(queueData.status).text}`}
                    >
                      {getStatusConfig(queueData.status).label}
                    </span>
                  </div>

                  {/* Detail rows */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-6 text-sm">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <TrendingDown className="w-4 h-4 text-primary shrink-0" />
                      Position in queue:{" "}
                      <strong className="ml-1">#{queueData.position}</strong>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                      Est. wait:{" "}
                      <strong className="ml-1">{displayWait} min</strong>
                      {aiWaitTime && (
                        <span className="text-xs text-purple-600 dark:text-purple-400 ml-1">
                          (AI)
                        </span>
                      )}
                    </div>

                    {queueData.department && (
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <MapPin className="w-4 h-4 text-teal-500 shrink-0" />
                        Dept:{" "}
                        <strong className="ml-1">{queueData.department}</strong>
                      </div>
                    )}

                    {queueData.doctorName && (
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <User className="w-4 h-4 text-indigo-500 shrink-0" />
                        <strong>{queueData.doctorName}</strong>
                      </div>
                    )}

                    {queueData.roomNumber && (
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <DoorOpen className="w-4 h-4 text-gray-500 shrink-0" />
                        Room:{" "}
                        <strong className="ml-1">{queueData.roomNumber}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Instructions card */}
            <Card className="border-l-4 border-l-secondary">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-secondary" />
                What to Expect
              </h3>
              <ul className="space-y-2.5 text-sm text-neutral dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span>✅</span>
                  <span>
                    Stay in the{" "}
                    <strong className="text-gray-800 dark:text-gray-200">
                      {queueData.department}
                    </strong>{" "}
                    waiting area
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span>🔔</span>
                  <span>You'll be notified when your number is called</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>📱</span>
                  <span>Keep this page open for real-time updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>⏱</span>
                  <span>Estimated times may vary based on consultations</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* ── Queue Progress ───────────────────────────────────────────── */}
          <Card className="mb-6 border-l-4 border-l-amber-500">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">
              Queue Progress
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Progress bar */}
              <div className="flex-1">
                <div className="flex justify-between text-xs text-neutral dark:text-gray-400 mb-1.5">
                  <span>Position #{queueData.position}</span>
                  <span>~{displayWait} min remaining</span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-blue-500 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Stats pills */}
              <div className="flex gap-3 shrink-0">
                <div className="flex flex-col items-center px-4 py-2 bg-primary/10 rounded-xl">
                  <span className="text-xl font-extrabold text-primary">
                    #{queueData.position}
                  </span>
                  <span className="text-xs text-neutral dark:text-gray-400">
                    in line
                  </span>
                </div>
                <div className="flex flex-col items-center px-4 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                  <span className="text-xl font-extrabold text-amber-600">
                    {displayWait}
                  </span>
                  <span className="text-xs text-neutral dark:text-gray-400">
                    min
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* ── Bottom refresh ───────────────────────────────────────────── */}
          <Button
            variant="outline"
            className="w-full border-primary text-primary"
            onClick={() => loadQueueStatus(true)}
            disabled={refreshing}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing…" : "Refresh Queue Status"}
          </Button>
        </>
      ) : (
        /* ── Empty state ──────────────────────────────────────────────────── */
        <Card className="border-l-4 border-l-gray-300">
          <div className="text-center py-16">
            <div
              className="p-5 bg-gray-100 dark:bg-gray-800 rounded-full
                          w-24 h-24 flex items-center justify-center mx-auto mb-4"
            >
              <Ticket className="w-14 h-14 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Not Currently in Queue
            </h3>
            <p className="text-neutral dark:text-gray-400 mb-6 max-w-sm mx-auto">
              You don't have an active queue position today. Check in at your
              appointment time to join the queue.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate("/patient/appointments")}
            >
              <Calendar className="w-4 h-4 mr-2" />
              View My Appointments
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
