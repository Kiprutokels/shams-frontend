import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@store/hooks';
import { Card } from '@components/common/Card/Card';
import { Button } from '@components/common/Button/Button';
import { Loader } from '@components/common/Loader/Loader';
import { appointmentService } from '@services/api/appointment.service';
import type { Appointment } from '@types';
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit3,
} from 'lucide-react';

export const DoctorSchedulePage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00',
  ];

  useEffect(() => {
    loadSchedule();
  }, [currentDate, user?.id]);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const start = new Date(currentDate);
      start.setDate(1);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);

      const response = await appointmentService.getAll({
        doctorId: user?.id,
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
      });
      const items = response.data?.data ?? response.data?.items ?? [];
      setAppointments(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error('Failed to load schedule:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter((a) =>
      a.appointmentDate?.startsWith(dateStr)
    );
  };

  const navigateMonth = (delta: number) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + delta)
    );
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-neutral-bg dark:bg-gray-950 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Schedule
          </h1>
          <p className="text-neutral dark:text-gray-400">
            Manage your availability and appointments
          </p>
        </div>
        <Button
          variant="primary"
          className="mt-4 md:mt-0 bg-primary hover:opacity-90"
          onClick={() => setSelectedSlot('new')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Availability
        </Button>
      </div>

      {/* Calendar Navigation */}
      <Card className="mb-6 border-l-4 border-l-teal">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 rounded-lg hover:bg-neutral-bg dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {currentDate.toLocaleString('default', {
              month: 'long',
              year: 'numeric',
            })}
          </h2>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 rounded-lg hover:bg-neutral-bg dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-primary" />
          </button>
        </div>
      </Card>

      {/* Week View */}
      <Card title="Weekly Overview" className="mb-6">
        <div className="overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {Array.from({ length: 7 }, (_, i) => {
              const date = new Date(currentDate);
              date.setDate(currentDate.getDate() - currentDate.getDay() + i);
              const dayAppointments = getAppointmentsForDate(date);
              const isToday =
                date.toDateString() === new Date().toDateString();

              return (
                <div
                  key={i}
                  className={`min-w-[140px] p-4 rounded-xl border-2 transition-all ${
                    isToday
                      ? 'border-teal bg-teal/10'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="text-center mb-3">
                    <div className="text-sm text-neutral font-semibold">
                      {weekDays[date.getDay()]}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {date.getDate()}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {dayAppointments.slice(0, 3).map((apt) => (
                      <div
                        key={apt.id}
                        className="p-2 rounded-lg bg-primary/10 border-l-4 border-l-primary text-sm"
                      >
                        <div className="font-semibold text-gray-900 dark:text-white truncate">
                          {apt.patient?.firstName} {apt.patient?.lastName}
                        </div>
                        <div className="text-xs text-neutral flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(apt.appointmentDate).toLocaleTimeString(
                            'en-US',
                            { hour: '2-digit', minute: '2-digit' }
                          )}
                        </div>
                      </div>
                    ))}
                    {dayAppointments.length > 3 && (
                      <div className="text-xs text-neutral font-semibold">
                        +{dayAppointments.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Time Slots - Today's Schedule */}
      <Card
        title={`Today's Time Slots - ${new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        })}`}
        className="border-l-4 border-l-teal"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {timeSlots.map((slot) => {
            const todayStr = new Date().toISOString().split('T')[0];
            const slotDateTime = `${todayStr}T${slot}:00`;
            const hasAppointment = appointments.some(
              (a) => a.appointmentDate?.startsWith(slotDateTime.slice(0, 16))
            );
            const apt = appointments.find((a) =>
              a.appointmentDate?.startsWith(slotDateTime.slice(0, 16))
            );

            return (
              <div
                key={slot}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  hasAppointment
                    ? 'border-teal bg-teal/10 hover:bg-teal/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                }`}
                onClick={() => setSelectedSlot(slot)}
              >
                <div className="flex items-center justify-between">
                  <Clock className="w-4 h-4 text-teal" />
                  {hasAppointment && (
                    <Edit3 className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div className="font-bold text-gray-900 dark:text-white mt-2">
                  {slot}
                </div>
                {apt && (
                  <div className="text-xs text-neutral mt-1 truncate">
                    {apt.patient?.firstName} {apt.patient?.lastName}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
