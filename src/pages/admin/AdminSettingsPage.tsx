import React, { useState } from 'react';
import { Card } from '@components/common/Card/Card';
import { Button } from '@components/common/Button/Button';
import {
  Bell,
  Mail,
  Database,
  Shield,
  Clock,
  Save,
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    appointmentReminderHours: 24,
    maxQueueSize: 50,
    defaultAppointmentDuration: 30,
    allowOnlineBooking: true,
    requireEmailVerification: true,
    sessionTimeoutMinutes: 30,
  });

  const handleChange = (key: string, value: string | number | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    // TODO: Connect to settings API
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-neutral-bg dark:bg-gray-950 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            System Settings
          </h1>
          <p className="text-neutral dark:text-gray-400">
            Configure system parameters and preferences
          </p>
        </div>
        <Button
          variant="primary"
          className="bg-navy hover:opacity-90"
          onClick={handleSave}
          loading={saving}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Settings */}
        <Card title="Appointment Settings" className="border-l-4 border-l-navy">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Reminder (hours before)
              </label>
              <input
                type="number"
                min={1}
                max={72}
                value={settings.appointmentReminderHours}
                onChange={(e) =>
                  handleChange('appointmentReminderHours', Number(e.target.value))
                }
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-navy"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Default Duration (minutes)
              </label>
              <input
                type="number"
                min={15}
                max={120}
                step={15}
                value={settings.defaultAppointmentDuration}
                onChange={(e) =>
                  handleChange('defaultAppointmentDuration', Number(e.target.value))
                }
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-navy"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowOnlineBooking}
                  onChange={(e) => handleChange('allowOnlineBooking', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-navy focus:ring-navy"
                />
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Allow online booking
                </span>
              </label>
            </div>
          </div>
        </Card>

        {/* Queue Settings */}
        <Card title="Queue Settings" className="border-l-4 border-l-navy">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Max Queue Size
              </label>
              <input
                type="number"
                min={10}
                max={200}
                value={settings.maxQueueSize}
                onChange={(e) => handleChange('maxQueueSize', Number(e.target.value))}
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-navy"
              />
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card title="Security" className="border-l-4 border-l-warmRed">
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.requireEmailVerification}
                  onChange={(e) =>
                    handleChange('requireEmailVerification', e.target.checked)
                  }
                  className="w-4 h-4 rounded border-gray-300 text-navy focus:ring-navy"
                />
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Require email verification
                </span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                min={5}
                max={120}
                value={settings.sessionTimeoutMinutes}
                onChange={(e) =>
                  handleChange('sessionTimeoutMinutes', Number(e.target.value))
                }
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-navy"
              />
            </div>
          </div>
        </Card>

        {/* System Info */}
        <Card title="System Information" className="border-l-4 border-l-secondary">
          <div className="space-y-4">
            {[
              { icon: Database, label: 'Database', value: 'Connected' },
              { icon: Mail, label: 'Email Service', value: 'Active' },
              { icon: Bell, label: 'Notifications', value: 'Enabled' },
              { icon: Shield, label: 'Security', value: 'Standard' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center p-4 bg-neutral-bg dark:bg-gray-800 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <item.icon className="w-5 h-5 text-secondary" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {item.label}
                  </span>
                </div>
                <span className="text-secondary font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
