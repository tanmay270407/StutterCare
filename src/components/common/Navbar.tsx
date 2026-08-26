import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  HeartHandshake,
  User,
  Stethoscope,
  ShieldAlert,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentRole,
    switchRole,
    currentPatient,
    patients,
    setActivePatientId,
    setPatientConnectionStatus,
    resetAllData
  } = useApp();

  return (
    <header
      id="main-app-header"
      className="bg-white/95 backdrop-blur-md border-b border-teal-100/80 sticky top-0 z-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-700 flex items-center justify-center text-teal-50 shadow-sm">
              <HeartHandshake className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-teal-950 font-serif">
                  StutterCare
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  Prototype
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Calm, non-judgmental stammering support platform
              </p>
            </div>
          </div>

          {/* Portal Switcher */}
          <div className="flex items-center gap-2 sm:gap-4">
            <nav
              id="portal-switcher-nav"
              aria-label="Portal Selection"
              className="flex bg-slate-100 p-1 rounded-xl border border-slate-200"
            >
              <button
                id="portal-btn-patient"
                onClick={() => switchRole('patient')}
                aria-pressed={currentRole === 'patient'}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-teal-700 ${
                  currentRole === 'patient'
                    ? 'bg-white text-teal-900 shadow-sm'
                    : 'text-slate-600 hover:text-teal-900 hover:bg-slate-200/60'
                }`}
              >
                <User className="w-4 h-4 text-teal-700" />
                <span>Patient</span>
              </button>

              <button
                id="portal-btn-therapist"
                onClick={() => switchRole('therapist')}
                aria-pressed={currentRole === 'therapist'}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-teal-700 ${
                  currentRole === 'therapist'
                    ? 'bg-white text-teal-900 shadow-sm'
                    : 'text-slate-600 hover:text-teal-900 hover:bg-slate-200/60'
                }`}
              >
                <Stethoscope className="w-4 h-4 text-teal-700" />
                <span className="hidden md:inline">SLP / Therapist</span>
                <span className="md:hidden">Therapist</span>
              </button>

              <button
                id="portal-btn-admin"
                onClick={() => switchRole('admin')}
                aria-pressed={currentRole === 'admin'}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-teal-700 ${
                  currentRole === 'admin'
                    ? 'bg-white text-teal-900 shadow-sm'
                    : 'text-slate-600 hover:text-teal-900 hover:bg-slate-200/60'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-teal-700" />
                <span>Admin</span>
              </button>
            </nav>

            {/* Reset state helper */}
            <button
              id="reset-demo-state-btn"
              onClick={resetAllData}
              title="Reset state to initial mock data"
              className="p-2 text-slate-500 hover:text-teal-800 hover:bg-teal-50 rounded-lg border border-slate-200 transition focus-visible:ring-2 focus-visible:ring-teal-700"
              aria-label="Reset prototype state"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Context Bar for Quick Simulation Testing */}
        {currentRole === 'patient' && (
          <div
            id="patient-simulation-bar"
            className="py-2 px-3 mb-2 bg-teal-50/70 border border-teal-100 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-teal-950">Active Patient:</span>
              <select
                id="select-active-patient"
                value={currentPatient.id}
                onChange={e => setActivePatientId(e.target.value)}
                className="bg-white border border-teal-200 text-teal-900 text-xs rounded-lg px-2.5 py-1 focus-visible:ring-2 focus-visible:ring-teal-700 cursor-pointer font-medium"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.age}y) — {p.status === 'connected' ? 'Connected' : p.status === 'ai_fallback' ? 'AI Mode' : 'Waitlisted'}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Mode Switcher to demonstrate cross-cutting visible banner/toast requirements */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium hidden sm:inline">Simulate State:</span>
              <button
                id="quick-set-connected"
                onClick={() => setPatientConnectionStatus(currentPatient.id, 'connected')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition ${
                  currentPatient.status === 'connected'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Connected
              </button>
              <button
                id="quick-set-ai"
                onClick={() => setPatientConnectionStatus(currentPatient.id, 'ai_fallback')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition ${
                  currentPatient.status === 'ai_fallback'
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'bg-white text-amber-800 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI Fallback
              </button>
              <button
                id="quick-set-waitlist"
                onClick={() => setPatientConnectionStatus(currentPatient.id, 'waitlisted')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition ${
                  currentPatient.status === 'waitlisted'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                Waitlisted
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
