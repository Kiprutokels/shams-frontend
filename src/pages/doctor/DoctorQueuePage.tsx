import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@store/hooks';
import { Card } from '@components/common/Card/Card';
import { Button } from '@components/common/Button/Button';
import { Loader } from '@components/common/Loader/Loader';
import { queueService } from '@services/api/queue.service';
import type { Queue, QueueStatus } from '@types';
import {
  Users,
  Phone,
  UserCheck,
  AlertCircle,
  ChevronRight,
  Clock,
} from 'lucide-react';

export const DoctorQueuePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [queueList, setQueueList] = useState<Queue[]>([]);
  const [filter, setFilter] = useState<string>('WAITING');

  useEffect(() => {
    loadQueue();
  }, [filter]);

  const loadQueue = async () => {
    try {
      setLoading(true);
      const response = await queueService.getAll({
        status: filter || undefined,
      });
      const data = response.data ?? [];
      setQueueList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load queue:', error);
      setQueueList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCallNext = async (entry: Queue) => {
    try {
      await queueService.update(Number(entry.id), { status: 'CALLED' });
      loadQueue();
    } catch (error) {
      console.error('Failed to call patient:', error);
    }
  };

  const handleMarkInService = async (entry: Queue) => {
    try {
      await queueService.update(Number(entry.id), { status: 'IN_SERVICE' });
      loadQueue();
    } catch (error) {
      console.error('Failed to mark in-service:', error);
    }
  };

  const handleComplete = async (entry: Queue) => {
    try {
      await queueService.update(Number(entry.id), { status: 'COMPLETED' });
      loadQueue();
    } catch (error) {
      console.error('Failed to complete:', error);
    }
  };

  const handleNoShow = async (entry: Queue) => {
    try {
      await queueService.update(Number(entry.id), { status: 'SKIPPED' });
      loadQueue();
    } catch (error) {
      console.error('Failed to mark no-show:', error);
    }
  };

  const statusConfig: Record<string, { bg: string; text: string; icon: typeof UserCheck }> = {
    WAITING: {
      bg: 'bg-accent/20',
      text: 'text-accent',
      icon: Clock,
    },
    CALLED: {
      bg: 'bg-primary/20',
      text: 'text-primary',
      icon: Phone,
    },
    IN_SERVICE: {
      bg: 'bg-teal/20',
      text: 'text-teal',
      icon: UserCheck,
    },
    COMPLETED: {
      bg: 'bg-secondary/20',
      text: 'text-secondary',
      icon: UserCheck,
    },
    NO_SHOW: {
      bg: 'bg-warmRed/20',
      text: 'text-warmRed',
      icon: AlertCircle,
    },
    SKIPPED: {
      bg: 'bg-warmRed/20',
      text: 'text-warmRed',
      icon: AlertCircle,
    },
  };

  const getStatusStyle = (status: QueueStatus) =>
    statusConfig[status] ?? statusConfig.WAITING;

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-neutral-bg dark:bg-gray-950 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Queue Management
          </h1>
          <p className="text-neutral dark:text-gray-400">
            Manage patient flow and prioritize care
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Waiting', count: queueList.filter((q) => q.status === 'WAITING').length, border: 'border-l-accent', bg: 'bg-accent/20', icon: 'text-accent' },
          { label: 'In Service', count: queueList.filter((q) => q.status === 'IN_SERVICE').length, border: 'border-l-teal', bg: 'bg-teal/20', icon: 'text-teal' },
          { label: 'Completed', count: queueList.filter((q) => q.status === 'COMPLETED').length, border: 'border-l-secondary', bg: 'bg-secondary/20', icon: 'text-secondary' },
          { label: 'Total', count: queueList.length, border: 'border-l-primary', bg: 'bg-primary/20', icon: 'text-primary' },
        ].map((stat) => (
          <Card key={stat.label} className={`border-l-4 ${stat.border}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <Users className={`w-6 h-6 ${stat.icon}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.count}
                </div>
                <div className="text-sm text-neutral font-semibold">
                  {stat.label}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['WAITING', 'CALLED', 'IN_SERVICE', 'COMPLETED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
              filter === status
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-gray-800 text-neutral hover:bg-neutral-bg dark:hover:bg-gray-700'
            }`}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Queue List */}
      <Card title="Patient Queue" className="border-l-4 border-l-teal">
        {queueList.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-neutral mx-auto mb-4" />
            <p className="text-neutral dark:text-gray-400 mb-4">
              No patients in {filter.toLowerCase().replace('_', ' ')} queue
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {queueList.map((entry, index) => {
              const style = getStatusStyle(entry.status as QueueStatus);
              const StatusIcon = style.icon;

              return (
                <div
                  key={entry.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all hover:border-primary/50 ${
                    index === 0 && filter === 'WAITING'
                      ? 'border-accent bg-accent/5'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="text-2xl font-bold text-primary min-w-[3rem] text-center">
                    #{entry.queueNumber}
                  </div>
                  <div className={`p-2 rounded-lg ${style.bg}`}>
                    <StatusIcon className={`w-6 h-6 ${style.text}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {entry.patientName}
                    </h4>
                    <p className="text-sm text-neutral">{entry.serviceType}</p>
                    <div className="flex gap-4 mt-1 text-xs">
                      <span className="text-neutral">
                        Wait: {entry.estimatedWaitTime ?? 'N/A'} min
                      </span>
                      {entry.isEmergency && (
                        <span className="text-warmRed font-bold">
                          EMERGENCY
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {entry.status === 'WAITING' && index === 0 && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          className="bg-primary hover:opacity-90"
                          onClick={() => handleCallNext(entry)}
                        >
                          Call Next
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-warmRed text-warmRed hover:bg-warmRed/10"
                          onClick={() => handleNoShow(entry)}
                        >
                          No-Show
                        </Button>
                      </>
                    )}
                    {entry.status === 'CALLED' && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          className="bg-teal hover:opacity-90"
                          onClick={() => handleMarkInService(entry)}
                        >
                          Mark In-Service
                        </Button>
                        {entry.appointmentId && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(`/doctor/appointments/${entry.appointmentId}`)
                            }
                          >
                            Start Consultation
                          </Button>
                        )}
                      </>
                    )}
                    {entry.status === 'IN_SERVICE' && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="bg-secondary hover:opacity-90"
                        onClick={() => handleComplete(entry)}
                      >
                        Complete
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/doctor/queue/${entry.id}`)}
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
    </div>
  );
};
