import { useState } from 'react';
import { 
  BellIcon, 
  LockIcon, 
  DatabaseIcon, 
  UserIcon, 
  UsersIcon,
  ShieldCheckIcon,
  MailIcon,
  AlertCircleIcon
} from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dataRetention, setDataRetention] = useState('90');
  const [autoBackup, setAutoBackup] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [alertThreshold, setAlertThreshold] = useState('90');

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save settings to the backend
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-neutral-500">Configure system settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar with setting categories */}
        <div className="md:col-span-1">
          <div className="card">
            <div className="p-4">
              <nav className="space-y-1">
                <a
                  href="#notifications"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-primary-50 text-primary-700"
                >
                  <BellIcon className="mr-3 h-5 w-5" />
                  Notifications
                </a>
                <a
                  href="#data-retention"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-neutral-700 hover:bg-neutral-50"
                >
                  <DatabaseIcon className="mr-3 h-5 w-5" />
                  Data Retention
                </a>
                <a
                  href="#security"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-neutral-700 hover:bg-neutral-50"
                >
                  <LockIcon className="mr-3 h-5 w-5" />
                  Security
                </a>
                <a
                  href="#user-management"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-neutral-700 hover:bg-neutral-50"
                >
                  <UsersIcon className="mr-3 h-5 w-5" />
                  User Management
                </a>
              </nav>
            </div>
          </div>
        </div>

        {/* Main settings panel */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Notifications */}
            <div id="notifications" className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium flex items-center">
                  <BellIcon className="mr-2 h-5 w-5 text-primary" />
                  Notification Preferences
                </h3>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium text-neutral-900">Enable Notifications</h4>
                      <p className="text-sm text-neutral-500">Receive system notifications</p>
                    </div>
                    <div className="ml-4">
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          checked={notificationsEnabled}
                          onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                        />
                        <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notificationsEnabled ? 'bg-primary' : 'bg-neutral-300'
                        }`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}></span>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium text-neutral-900">Email Notifications</h4>
                      <p className="text-sm text-neutral-500">Receive notifications via email</p>
                    </div>
                    <div className="ml-4">
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          checked={emailNotifications}
                          onChange={() => setEmailNotifications(!emailNotifications)}
                          disabled={!notificationsEnabled}
                        />
                        <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          emailNotifications && notificationsEnabled ? 'bg-primary' : 'bg-neutral-300'
                        }`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            emailNotifications && notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}></span>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium text-neutral-900">SMS Notifications</h4>
                      <p className="text-sm text-neutral-500">Receive notifications via text message</p>
                    </div>
                    <div className="ml-4">
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          checked={smsNotifications}
                          onChange={() => setSmsNotifications(!smsNotifications)}
                          disabled={!notificationsEnabled}
                        />
                        <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          smsNotifications && notificationsEnabled ? 'bg-primary' : 'bg-neutral-300'
                        }`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            smsNotifications && notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}></span>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="alert-threshold" className="block text-sm font-medium text-neutral-700">
                      Capacity Alert Threshold
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="number"
                        name="alertThreshold"
                        id="alert-threshold"
                        min="0"
                        max="100"
                        className="block w-full rounded-none rounded-l-md border-neutral-300 focus:border-primary focus:ring-primary sm:text-sm"
                        value={alertThreshold}
                        onChange={(e) => setAlertThreshold(e.target.value)}
                        disabled={!notificationsEnabled}
                      />
                      <span className="inline-flex items-center rounded-r-md border border-l-0 border-neutral-300 bg-neutral-50 px-3 text-neutral-500 sm:text-sm">
                        %
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-neutral-500">
                      Get alerted when parking occupancy exceeds this percentage
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Retention */}
            <div id="data-retention" className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium flex items-center">
                  <DatabaseIcon className="mr-2 h-5 w-5 text-primary" />
                  Data Retention
                </h3>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="data-retention" className="block text-sm font-medium text-neutral-700">
                      Parking History Retention Period
                    </label>
                    <select
                      id="data-retention"
                      className="mt-1 select"
                      value={dataRetention}
                      onChange={(e) => setDataRetention(e.target.value)}
                    >
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
                      <option value="90">90 days</option>
                      <option value="180">180 days</option>
                      <option value="365">1 year</option>
                    </select>
                    <p className="mt-1 text-sm text-neutral-500">
                      Historical parking data will be automatically deleted after this period
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4">
                    <div>
                      <h4 className="text-sm font-medium text-neutral-900">Automatic Backups</h4>
                      <p className="text-sm text-neutral-500">Backup system data on a regular schedule</p>
                    </div>
                    <div className="ml-4">
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          checked={autoBackup}
                          onChange={() => setAutoBackup(!autoBackup)}
                        />
                        <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          autoBackup ? 'bg-primary' : 'bg-neutral-300'
                        }`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            autoBackup ? 'translate-x-6' : 'translate-x-1'
                          }`}></span>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  {autoBackup && (
                    <div className="pt-2">
                      <label htmlFor="backup-frequency" className="block text-sm font-medium text-neutral-700">
                        Backup Frequency
                      </label>
                      <select
                        id="backup-frequency"
                        className="mt-1 select"
                      >
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                      </select>
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <Button variant="outline" size="sm" className="mr-2">
                      Export All Data
                    </Button>
                    <Button variant="outline" size="sm" className="bg-neutral-100">
                      Manual Backup Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div id="security" className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium flex items-center">
                  <ShieldCheckIcon className="mr-2 h-5 w-5 text-primary" />
                  Security Settings
                </h3>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-neutral-900">API Authentication</h4>
                    <p className="text-sm text-neutral-500 mb-2">Manage your API keys for external integrations</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-neutral-100 py-2 px-3 rounded-md font-mono text-sm truncate">
                        •••••••••••••••••••••••••••••••
                      </div>
                      <Button variant="outline" size="sm">
                        Regenerate
                      </Button>
                    </div>
                    <p className="mt-1 text-xs text-neutral-500">
                      Last generated: November 1, 2023
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="text-sm font-medium text-neutral-900">Session Settings</h4>
                    <div className="mt-2 space-y-2">
                      <div>
                        <label htmlFor="session-timeout" className="block text-sm font-medium text-neutral-700">
                          Session Timeout (minutes)
                        </label>
                        <input
                          type="number"
                          id="session-timeout"
                          min="5"
                          max="120"
                          className="mt-1 input"
                          defaultValue="30"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Management Placeholder (Future Phase) */}
            <div id="user-management" className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium flex items-center">
                  <UsersIcon className="mr-2 h-5 w-5 text-primary" />
                  User Management (Coming Soon)
                </h3>
              </div>
              <div className="card-body">
                <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircleIcon className="h-5 w-5 text-blue-600" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Coming in future update</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>User management features will be available in an upcoming release.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button variant="outline" className="mr-3">
                Reset to Defaults
              </Button>
              <Button variant="primary" type="submit">
                Save Settings
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}