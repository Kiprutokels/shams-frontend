/**
 * AdminAnalyticsPage.tsx
 * Full analytics dashboard with Recharts visualizations.
 * Install: npm install recharts
 */
import React, { useEffect, useState } from "react";
import { Card } from "@components/common/Card/Card";
import { Loader } from "@components/common/Loader/Loader";
import { analyticsService } from "@services/api/analytics.service";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  BarChart3,
  Users,
  Calendar,
  Clock,
  Activity,
  AlertCircle,
  TrendingDown,
  CheckCircle,
} from "lucide-react";

export const AdminAnalyticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Record<string, any> | null>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [doctorPerf, setDoctorPerf] = useState<any[]>([]);
  const [waitTime, setWaitTime] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [sRes, tRes, dRes, wRes] = await Promise.all([
        analyticsService.getDashboardStats(),
        analyticsService.getAppointmentTrends(30),
        analyticsService.getDoctorPerformance(),
        analyticsService.getWaitTimeAnalysis(),
      ]);
      setStats(sRes.data ?? null);
      setTrends(Array.isArray(tRes.data) ? tRes.data : []);
      setDoctorPerf(Array.isArray(dRes.data) ? dRes.data : []);
      setWaitTime(Array.isArray(wRes.data) ? wRes.data : []);
    } catch (err) {
      console.error("Analytics load error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const s = stats as Record<string, number> | null;

  // Appointment status pie chart data
  const statusPieData = [
    {
      name: "Completed",
      value: s?.completedAppointments || 0,
      color: "#10B981",
    },
    {
      name: "Cancelled",
      value: s?.cancelledAppointments || 0,
      color: "#F59E0B",
    },
    { name: "No-Shows", value: s?.noShows || 0, color: "#EF4444" },
    {
      name: "Active",
      value:
        (s?.totalAppointments || 0) -
        (s?.completedAppointments || 0) -
        (s?.cancelledAppointments || 0) -
        (s?.noShows || 0),
      color: "#3B82F6",
    },
  ].filter((d) => d.value > 0);

  // Doctor performance bar data
  const doctorBarData = doctorPerf.slice(0, 8).map((d: any) => ({
    name: d.doctorName?.split(" ").pop() || "Dr",
    appointments: d.totalAppointments || 0,
    completed: d.completed || 0,
    rate: Math.round(d.completionRate || 0),
  }));

  // Trends data (format for chart)
  const trendsChartData = trends.map((t: any) => ({
    status: t.status?.replace("_", " ") || "Unknown",
    count: t.count || 0,
  }));

  // Wait time bar data
  const waitTimeData = waitTime.slice(0, 6).map((w: any) => ({
    dept: w.department?.substring(0, 10) || "Dept",
    avgWait: w.avgWaitTime || 0,
    patients: w.totalPatients || 0,
  }));

  const kpiCards = [
    {
      label: "Total Patients",
      value: s?.totalPatients || 0,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-l-blue-500",
      trend: "+12%",
    },
    {
      label: "Total Doctors",
      value: s?.totalDoctors || 0,
      icon: Activity,
      color: "text-teal-500",
      bg: "bg-teal-50 dark:bg-teal-900/20",
      border: "border-l-teal-500",
      trend: "+3%",
    },
    {
      label: "Today's Appointments",
      value: s?.todayAppointments || 0,
      icon: Calendar,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      border: "border-l-amber-500",
      trend: "",
    },
    {
      label: "No-Show Rate",
      value: `${(s?.noShowRate || 0).toFixed(1)}%`,
      icon: AlertCircle,
      color: "text-red-500",
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-l-red-500",
      trend: "-2%",
    },
    {
      label: "Total Appointments",
      value: s?.totalAppointments || 0,
      icon: BarChart3,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      border: "border-l-purple-500",
      trend: "+8%",
    },
    {
      label: "Active Queue",
      value: s?.activeQueue || 0,
      icon: Clock,
      color: "text-cyan-500",
      bg: "bg-cyan-50 dark:bg-cyan-900/20",
      border: "border-l-cyan-500",
      trend: "",
    },
    {
      label: "Completed Appointments",
      value: s?.completedAppointments || 0,
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-l-green-500",
      trend: "+15%",
    },
    {
      label: "Cancellation Rate",
      value: `${(s?.cancellationRate || 0).toFixed(1)}%`,
      icon: TrendingDown,
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-900/20",
      border: "border-l-orange-500",
      trend: "",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-bg dark:bg-gray-950 p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Analytics Dashboard
          </h1>
          <p className="text-neutral dark:text-gray-400">
            System metrics and performance insights
          </p>
        </div>
        <button
          onClick={loadAnalytics}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          Refresh Data
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpiCards.map((k) => (
          <Card key={k.label} className={`border-l-4 ${k.border}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 ${k.bg} rounded-lg`}>
                  <k.icon className={`w-6 h-6 ${k.color}`} />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {k.value}
                  </div>
                  <div className="text-xs text-neutral font-medium">
                    {k.label}
                  </div>
                </div>
              </div>
              {k.trend && (
                <span
                  className={`text-xs font-bold ${k.trend.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                >
                  {k.trend}
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Appointment Status Breakdown – Pie */}
        <Card
          title="Appointment Status Breakdown"
          className="border-l-4 border-l-blue-500"
        >
          {statusPieData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {statusPieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-neutral">
              No appointment data available
            </div>
          )}
        </Card>

        {/* Appointment Trends by Status – Bar */}
        <Card
          title="Appointment Trends (30 Days)"
          className="border-l-4 border-l-teal-500"
        >
          {trendsChartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendsChartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-gray-200 dark:stroke-gray-700"
                  />
                  <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-neutral">
              No trend data available
            </div>
          )}
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Doctor Performance */}
        <Card
          title="Doctor Performance"
          className="border-l-4 border-l-purple-500"
        >
          {doctorBarData.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={doctorBarData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-gray-200 dark:stroke-gray-700"
                  />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    width={60}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="appointments"
                    name="Total"
                    fill="#8B5CF6"
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar
                    dataKey="completed"
                    name="Completed"
                    fill="#10B981"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-neutral">
              No doctor data available
            </div>
          )}
        </Card>

        {/* Wait Time by Department */}
        <Card
          title="Average Wait Time by Department"
          className="border-l-4 border-l-amber-500"
        >
          {waitTimeData.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={waitTimeData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-gray-200 dark:stroke-gray-700"
                  />
                  <XAxis dataKey="dept" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [`${v} min`, "Avg Wait"]} />
                  <Area
                    type="monotone"
                    dataKey="avgWait"
                    stroke="#F59E0B"
                    fill="#FEF3C7"
                    name="Avg Wait (min)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-neutral">
              <div className="text-center">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p>
                  Wait time data will appear here once patients are processed
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Doctor Performance Table */}
      {doctorPerf.length > 0 && (
        <Card
          title="Doctor Performance Summary"
          className="border-l-4 border-l-teal-500"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  {[
                    "Doctor",
                    "Specialization",
                    "Total",
                    "Completed",
                    "Completion Rate",
                    "Avg Time",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left py-3 px-4 text-sm font-bold text-gray-900 dark:text-white"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(doctorPerf as any[]).map((d, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      {d.doctorName}
                    </td>
                    <td className="py-3 px-4 text-sm text-neutral">
                      {d.specialization || "–"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                      {d.totalAppointments || 0}
                    </td>
                    <td className="py-3 px-4 text-sm text-teal-600 dark:text-teal-400">
                      {d.completed || 0}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-teal-500 rounded-full"
                            style={{
                              width: `${Math.round((d.completionRate || 0) * 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-bold text-teal-600">
                          {Math.round((d.completionRate || 0) * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-neutral">
                      {d.avgConsultationTime || 0} min
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
