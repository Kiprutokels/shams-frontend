import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@store/hooks';
import { Card } from '@components/common/Card/Card';
import { Button } from '@components/common/Button/Button';
import { Loader } from '@components/common/Loader/Loader';
import { queueService } from '@services/api/queue.service';
import { Ticket, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface QueuePosition {
  position: number;
  estimatedWaitTime: number;
  queueDate?: string;
  department?: string;
  status?: string;
}

export const QueueStatusPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [queueData, setQueueData] = useState<QueuePosition | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQueueStatus();
  }, []);

  const loadQueueStatus = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await queueService.getMyPosition().catch(() => null);
      if (response?.data) {
        setQueueData({
          position: response.data.position,
          estimatedWaitTime: response.data.estimatedWaitTime ?? 0,
          queueDate: (response.data as { queueDate?: string }).queueDate,
          department: (response.data as { department?: string }).department,
          status: (response.data as { status?: string }).status,
        });
      } else {
        setQueueData(null);
      }
    } catch (err) {
      setQueueData(null);
      setError('Unable to load queue status');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-neutral-bg dark:bg-gray-950 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Queue Status
          </h1>
          <p className="text-neutral dark:text-gray-400">
            Check your position and estimated wait time
          </p>
        </div>

        {error && (
          <Card className="mb-6 border-l-4 border-l-warmRed">
            <div className="flex items-center gap-3 text-warmRed">
              <AlertCircle className="w-6 h-6" />
              {error}
            </div>
          </Card>
        )}

        {queueData ? (
          <>
            <Card className="mb-6 border-l-4 border-l-primary animate-fade-in">
              <div className="flex items-center gap-6">
                <div className="p-6 bg-primary/20 rounded-2xl">
                  <Ticket className="w-16 h-16 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    You're in the queue!
                  </h2>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral font-semibold">Position:</span>
                      <span className="text-3xl font-bold text-primary">
                        #{queueData.position}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-accent" />
                      <span className="text-neutral font-semibold">
                        Estimated wait:
                      </span>
                      <span className="text-xl font-bold text-accent">
                        {queueData.estimatedWaitTime} minutes
                      </span>
                    </div>
                    {queueData.department && (
                      <p className="text-sm text-neutral">
                        Department: {queueData.department}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="mb-6 border-l-4 border-l-secondary">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-secondary" />
                What to expect
              </h3>
              <ul className="space-y-2 text-neutral">
                <li>• Stay in the waiting area until your number is called</li>
                <li>• You will be notified when it's your turn</li>
                <li>• Estimated wait times may vary</li>
              </ul>
            </Card>
          </>
        ) : (
          <Card className="mb-6 border-l-4 border-l-neutral">
            <div className="text-center py-12">
              <div className="p-6 bg-neutral/10 rounded-full w-fit mx-auto mb-4">
                <Ticket className="w-16 h-16 text-neutral" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Not in queue
              </h3>
              <p className="text-neutral mb-6">
                You don't have an active queue position. Check in at the clinic to join the queue.
              </p>
            </div>
          </Card>
        )}

        <Button
          variant="outline"
          className="w-full border-primary text-primary"
          onClick={loadQueueStatus}
        >
          Refresh Status
        </Button>
      </div>
    </div>
  );
};
