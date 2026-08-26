import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PatientList } from './PatientList';
import { PatientDetail } from './PatientDetail';
import { ReviewQueue } from './ReviewQueue';
import { TherapistVerificationModal } from './TherapistVerificationModal';
import {
  Users,
  ListChecks,
  ShieldCheck,
  Stethoscope,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const TherapistPortal: React.FC = () => {
  const {
    currentTherapist,
    therapists,
    setActiveTherapistId,
    sessions
  } = useApp();

  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [subView, setSubView] = useState<'roster' | 'queue'>('roster');
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const unreviewedCount = sessions.filter(
    s => s.status === 'AI-guided — needs review' || s.isFlagged
  ).length;

  const isVerified = currentTherapist.verificationStatus === 'verified';

  return (
    <div id="therapist-portal-container" className="space-y-6">
      {/* Clinician Profile & Verification Banner */}
      <section className="bg-white rounded-2xl border border-teal-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-800 text-white flex items-center justify-center font-bold text-lg font-serif">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-serif">
                {currentTherapist.name}
              </h2>
              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                  isVerified
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {isVerified ? 'Verified SLP' : 'Pending Verification'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentTherapist.title} • {currentTherapist.licenseNumber} ({currentTherapist.licenseBody})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Switch clinician account */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>SLP:</span>
            <select
              value={currentTherapist.id}
              onChange={e => setActiveTherapistId(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-2.5 py-1.5 focus-visible:ring-2 focus-visible:ring-teal-700 font-medium"
            >
              {therapists.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.verificationStatus})
                </option>
              ))}
            </select>
          </div>

          <button
            id="view-credentials-btn"
            onClick={() => setIsVerificationModalOpen(true)}
            className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-medium transition"
          >
            Licensure Credentials
          </button>
        </div>
      </section>

      {/* Sub Navigation: Patient Roster vs Global Review Queue */}
      <nav
        id="therapist-subnav"
        className="flex items-center gap-2 border-b border-slate-200 pb-2"
      >
        <button
          id="tab-therapist-roster"
          onClick={() => {
            setSubView('roster');
            setSelectedPatientId(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
            subView === 'roster' && !selectedPatientId
              ? 'bg-teal-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Patient Caseload</span>
        </button>

        <button
          id="tab-therapist-queue"
          onClick={() => {
            setSubView('queue');
            setSelectedPatientId(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
            subView === 'queue'
              ? 'bg-teal-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ListChecks className="w-4 h-4" />
          <span>Global Review Queue</span>
          {unreviewedCount > 0 && (
            <span
              className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                subView === 'queue'
                  ? 'bg-teal-700 text-white'
                  : 'bg-amber-100 text-amber-900'
              }`}
            >
              {unreviewedCount}
            </span>
          )}
        </button>
      </nav>

      {/* Sub-Views Router */}
      <main id="therapist-main-content">
        {selectedPatientId ? (
          <PatientDetail
            patientId={selectedPatientId}
            onBack={() => setSelectedPatientId(null)}
          />
        ) : subView === 'roster' ? (
          <PatientList onSelectPatient={id => setSelectedPatientId(id)} />
        ) : (
          <ReviewQueue />
        )}
      </main>

      {/* Verification Modal */}
      <TherapistVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
      />
    </div>
  );
};
