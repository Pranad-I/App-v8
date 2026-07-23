'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  Search, Bell, Menu, Save, Wifi, Lock, UserCircle,
} from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { AdminMenu } from '@/components/AdminMenu';
import { ThemeToggle } from '@/components/ThemeToggle';

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
    >
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-700 dark:text-slate-200">{label}</p>
        {hint && <p className="mt-0.5 text-[11px] text-slate-400">{hint}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-1 flex items-center gap-2">
        <Icon className="h-4 w-4 text-blue-600" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{title}</h3>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">{children}</div>
    </div>
  );
}

export function SettingsPage() {
  const [collapsed, setCollapsed] = useState(false);

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [criticalSms, setCriticalSms] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);

  const [autoQuarantine, setAutoQuarantine] = useState(true);
  const [riskThreshold, setRiskThreshold] = useState(70);
  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  const [guestNetwork, setGuestNetwork] = useState(true);
  const [scanInterval, setScanInterval] = useState('6');

  const [adminName, setAdminName] = useState('Admin');
  const [adminEmail, setAdminEmail] = useState('admin@example.com');

  function handleSave() {
    toast.success('Settings saved', {
      description: 'Your network defence preferences have been updated.',
    });
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 py-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <button onClick={() => setCollapsed((v) => !v)} aria-label="Toggle sidebar" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <Menu className="h-4 w-4 cursor-pointer" />
            </button>
            <h1 className="text-sm font-bold text-slate-700 dark:text-slate-200">Settings</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                placeholder="Search settings..."
                className="h-8 w-48 rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs text-slate-600 outline-none placeholder:text-slate-400 focus:border-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
            <ThemeToggle />
            <Bell className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <AdminMenu />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-5 py-4">
          <div className="mx-auto max-w-3xl space-y-4">
            <Section icon={Bell} title="Notifications">
              <Row label="Email alerts" hint="Get notified by email when new alerts are raised.">
                <Toggle checked={emailAlerts} onChange={setEmailAlerts} />
              </Row>
              <Row label="SMS for critical alerts" hint="Send a text message for Critical-severity alerts only.">
                <Toggle checked={criticalSms} onChange={setCriticalSms} />
              </Row>
              <Row label="Weekly summary report" hint="A digest of network activity delivered every Monday.">
                <Toggle checked={weeklyReport} onChange={setWeeklyReport} />
              </Row>
            </Section>

            <Section icon={Lock} title="Security">
              <Row label="Auto-quarantine suspicious devices" hint="Automatically quarantine devices above the risk threshold.">
                <Toggle checked={autoQuarantine} onChange={setAutoQuarantine} />
              </Row>
              <div className="py-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-700">Risk score threshold</p>
                  <span className="text-xs font-semibold text-blue-600">{riskThreshold}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={riskThreshold}
                  onChange={(e) => setRiskThreshold(Number(e.target.value))}
                  className="w-full accent-blue-600"
                  disabled={!autoQuarantine}
                />
                <p className="mt-1 text-[11px] text-slate-400">Devices scoring above this are quarantined automatically.</p>
              </div>
              <Row label="Two-factor authentication" hint="Require a verification code for admin sign-in.">
                <Toggle checked={twoFactor} onChange={setTwoFactor} />
              </Row>
              <Row label="Session timeout" hint="Automatically sign out after inactivity.">
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-600 outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="240">4 hours</option>
                </select>
              </Row>
            </Section>

            <Section icon={Wifi} title="Network">
              <Row label="Guest network enabled" hint="Allow visitors to connect on an isolated segment.">
                <Toggle checked={guestNetwork} onChange={setGuestNetwork} />
              </Row>
              <Row label="Vulnerability scan interval" hint="How often the system scans connected devices.">
                <select
                  value={scanInterval}
                  onChange={(e) => setScanInterval(e.target.value)}
                  className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-600 outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="1">Every hour</option>
                  <option value="6">Every 6 hours</option>
                  <option value="24">Once a day</option>
                  <option value="168">Once a week</option>
                </select>
              </Row>
            </Section>

            <Section icon={UserCircle} title="Account">
              <div className="grid grid-cols-1 gap-3 py-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-slate-400">Display name</label>
                  <input
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-slate-400">Email</label>
                  <input
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            </Section>

            <div className="flex justify-end gap-2 pb-4">
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
              >
                <Save className="h-3.5 w-3.5" /> Save changes
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
