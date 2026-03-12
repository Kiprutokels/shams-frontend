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
            className="border-primary-dark text-primary-dark hover:bg-primary-dark hover:text-white transition-colors"
          onClick={handleSave}
          loading={saving}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Settings */}
{/* Appointment Settings - Navy Theme */}
<Card title="Appointment Settings" className="border-l-4 border-l-[#0D47A1]">
  <div className="space-y-6">
    {/* Reminder Input */}
    <div>
      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
        <Clock className="w-4 h-4 inline mr-1 text-[#0D47A1]" />
        Reminder (hours before)
      </label>
      <input
        type="number"
        min={1}
        max={72}
        value={settings.appointmentReminderHours}
        onChange={(e) => handleChange('appointmentReminderHours', Number(e.target.value))}
        className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 
                   hover:border-[#0D47A1]/50 hover:bg-blue-50/30 dark:hover:bg-blue-900/10
                   focus:outline-none focus:border-[#0D47A1] focus:ring-4 focus:ring-[#0D47A1]/10 font-bold"
      />
    </div>

    {/* Duration Input */}
    <div>
      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
        Default Duration (minutes)
      </label>
      <input
        type="number"
        min={15}
        max={120}
        step={15}
        value={settings.defaultAppointmentDuration}
        onChange={(e) => handleChange('defaultAppointmentDuration', Number(e.target.value))}
        className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 
                   hover:border-[#0D47A1]/50 hover:bg-blue-50/30 dark:hover:bg-blue-900/10
                   focus:outline-none focus:border-[#0D47A1] focus:ring-4 focus:ring-[#0D47A1]/10 font-bold"
      />
    </div>

    {/* Checkbox Section */}
    <div>
      <label className="flex items-center gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={settings.allowOnlineBooking}
          onChange={(e) => handleChange('allowOnlineBooking', e.target.checked)}
          className="w-5 h-5 rounded border-2 border-gray-300 text-[#0D47A1] focus:ring-[#0D47A1] transition-colors cursor-pointer"
        />
        <span className="font-bold text-gray-700 dark:text-gray-300 group-hover:text-[#0D47A1] transition-colors">
          Allow online booking
        </span>
      </label>
    </div>
  </div>
</Card>

        {/* Queue Settings */}
<Card title="Queue Settings" className="border-l-4 border-l-[#0D47A1]">
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
        Max Queue Size
      </label>
      <input
        type="number"
        min={10}
        max={200}
        value={settings.maxQueueSize}
        onChange={(e) => handleChange('maxQueueSize', Number(e.target.value))}
        className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 
                   hover:border-[#0D47A1]/40 hover:bg-blue-50/20 dark:hover:bg-blue-900/5
                   focus:outline-none focus:border-[#0D47A1] focus:ring-4 focus:ring-[#0D47A1]/10 font-bold"
      />
      <p className="mt-2 text-xs text-neutral italic">
        Set the maximum capacity for the daily patient queue.
      </p>
    </div>
  </div>
</Card>

{/* Security Settings - Warm Red Theme */}
<Card title="Security" className="border-l-4 border-l-[#EF5350]">
  <div className="space-y-6">
    <div>
      <label className="flex items-center gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={settings.requireEmailVerification}
          onChange={(e) =>
            handleChange('requireEmailVerification', e.target.checked)
          }
          className="w-5 h-5 rounded border-2 border-gray-300 text-[#EF5350] focus:ring-[#EF5350] transition-colors cursor-pointer"
        />
        <span className="font-bold text-gray-700 dark:text-gray-300 group-hover:text-[#EF5350] transition-colors">
          Require email verification
        </span>
      </label>
    </div>

    <div>
      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
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
        className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 
                   hover:border-[#EF5350]/40 hover:bg-red-50/30 dark:hover:bg-red-900/5
                   focus:outline-none focus:border-[#EF5350] focus:ring-4 focus:ring-[#EF5350]/10 font-bold"
      />
    </div>
  </div>
</Card>
{/* System Information */}
<Card title="System Information" className="border-l-4 border-l-[#43A047]">
  <div className="space-y-3">
    {[
      { icon: Database, label: 'Database', value: 'Connected' },
      { icon: Mail, label: 'Email Service', value: 'Active' },
      { icon: Bell, label: 'Notifications', value: 'Enabled' },
      { icon: Shield, label: 'Security', value: 'Standard' },
    ].map((item) => (
      <div
        key={item.label}
        className="flex justify-between items-center p-3 bg-neutral-bg dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl transition-all hover:border-l-4 hover:border-l-[#43A047]"
      >
        <div className="flex items-center gap-3">
          {/* Icon with a subtle green background tint */}
          <div className="p-2 bg-[#43A047]/10 rounded-lg">
            <item.icon className="w-4 h-4 text-[#43A047]" />
          </div>
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
            {item.label}
          </span>
        </div>
        
        {/* Value styled as a high-contrast label */}
        <span className="px-3 py-1 bg-[#43A047]/10 text-[#2E7D32] dark:text-[#81C784] rounded-full text-[10px] font-black uppercase tracking-wider">
          {item.value}
        </span>
      </div>
    ))}
  </div>
</Card>
      </div>
    </div>
  );
};
