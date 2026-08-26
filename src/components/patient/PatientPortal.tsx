import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PatientHome } from './PatientHome';
import { PracticeSession } from './PracticeSession';
import { AILibrary } from './AILibrary';
import { MyPlan } from './MyPlan';
import { PatientProgress } from './PatientProgress';
import { PatientAppointments } from './PatientAppointments';
import { PatientSettings } from './PatientSettings';
import { PatientOnboarding } from './PatientOnboarding';
import {
  Home,
  Mic,
  BookOpen,
  Target,
  TrendingUp,
  Calendar,
  Settings,
  Sparkles,
  UserCheck
} from 'lucide-react';

export const PatientPortal: React.FC = () => {
  const {
    patientActiveTab,
    setPatientActiveTab,
    currentPatient
  } = useApp();

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const isConnected = currentPatient.status === 'connected';

  return (
    <div id="patient-portal-container" className="space-y-6">
      {/* Patient Sub-Navigation Tabs */}
      <nav
        id="patient-subnav"
        aria-label="Patient portal sub-navigation"
        className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 border-b border-slate-200/80 scrollbar-none"
      >
        <button
          id="tab-patient-home"
          onClick={() => setPatientActiveTab('home')}
          aria-current={patientActiveTab === 'home' ? 'page' : undefined}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition focus-visible:ring-2 focus-visible:ring-teal-700 ${
            patientActiveTab === 'home'
              ? 'bg-teal-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-teal-900 hover:bg-slate-100'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          id="tab-patient-practice"
          onClick={() => setPatientActiveTab('practice')}
          aria-current={patientActiveTab === 'practice' ? 'page' : undefined}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition focus-visible:ring-2 focus-visible:ring-teal-700 ${
            patientActiveTab === 'practice'
              ? 'bg-teal-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-teal-900 hover:bg-slate-100'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>Practice Session</span>
        </button>

        <button
          id="tab-patient-library"
          onClick={() => setPatientActiveTab('library')}
          aria-current={patientActiveTab === 'library' ? 'page' : undefined}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition focus-visible:ring-2 focus-visible:ring-teal-700 ${
            patientActiveTab === 'library'
              ? 'bg-teal-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-teal-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>AI-Fallback Library</span>
        </button>

        {isConnected && (
          <button
            id="tab-patient-plan"
            onClick={() => setPatientActiveTab('plan')}
            aria-current={patientActiveTab === 'plan' ? 'page' : undefined}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition focus-visible:ring-2 focus-visible:ring-teal-700 ${
              patientActiveTab === 'plan'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>My Plan (Clinician)</span>
          </button>
        )}

        <button
          id="tab-patient-progress"
          onClick={() => setPatientActiveTab('progress')}
          aria-current={patientActiveTab === 'progress' ? 'page' : undefined}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition focus-visible:ring-2 focus-visible:ring-teal-700 ${
            patientActiveTab === 'progress'
              ? 'bg-teal-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-teal-900 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Progress & Ease</span>
        </button>

        <button
          id="tab-patient-appointments"
          onClick={() => setPatientActiveTab('appointments')}
          aria-current={patientActiveTab === 'appointments' ? 'page' : undefined}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition focus-visible:ring-2 focus-visible:ring-teal-700 ${
            patientActiveTab === 'appointments'
              ? 'bg-teal-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-teal-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Sessions</span>
        </button>

        <button
          id="tab-patient-settings"
          onClick={() => setPatientActiveTab('settings')}
          aria-current={patientActiveTab === 'settings' ? 'page' : undefined}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition focus-visible:ring-2 focus-visible:ring-teal-700 ml-auto ${
            patientActiveTab === 'settings'
              ? 'bg-teal-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-teal-900 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </nav>

      {/* Main View Router */}
      <main id="patient-main-content">
        {patientActiveTab === 'home' && <PatientHome />}
        {patientActiveTab === 'practice' && <PracticeSession />}
        {patientActiveTab === 'library' && <AILibrary />}
        {patientActiveTab === 'plan' && <MyPlan />}
        {patientActiveTab === 'progress' && <PatientProgress />}
        {patientActiveTab === 'appointments' && <PatientAppointments />}
        {patientActiveTab === 'settings' && (
          <PatientSettings onReopenOnboarding={() => setIsOnboardingOpen(true)} />
        )}
      </main>

      {/* Onboarding / Intake Modal */}
      <PatientOnboarding
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={() => setIsOnboardingOpen(false)}
      />
    </div>
  );
};
