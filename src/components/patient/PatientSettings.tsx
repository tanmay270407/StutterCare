import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Trash2,
  Lock,
  Globe,
  UserCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { FootnoteDisclaimer } from '../common/FootnoteDisclaimer';

interface PatientSettingsProps {
  onReopenOnboarding: () => void;
}

export const PatientSettings: React.FC<PatientSettingsProps> = ({ onReopenOnboarding }) => {
  const {
    currentPatient,
    updatePatientConsent,
    updatePatientProfile,
    deletePatientData,
    addNotification
  } = useApp();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [selectedLang, setSelectedLang] = useState(currentPatient.preferredLanguage || 'English');

  const handleLanguageChange = (lang: string) => {
    setSelectedLang(lang);
    updatePatientProfile(currentPatient.id, { preferredLanguage: lang });
    addNotification(`Language updated to ${lang}.`, 'info');
  };

  const handleToggleConsent = (checked: boolean) => {
    updatePatientConsent(currentPatient.id, checked);
  };

  const handleConfirmDeleteData = () => {
    if (deleteConfirmationText.trim().toLowerCase() === 'delete') {
      deletePatientData(currentPatient.id);
      setIsDeleteModalOpen(false);
      setDeleteConfirmationText('');
    } else {
      addNotification('Please type "delete" to confirm data deletion.', 'amber');
    }
  };

  return (
    <div id="patient-settings-view" className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-teal-100 p-6 sm:p-8 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
            Privacy & Preferences
          </span>
          <span className="text-xs text-slate-500">
            Patient Control Center
          </span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-serif">
          Settings & Data Governance
        </h2>
        <p className="text-sm text-slate-600">
          Control your audio processing consent, language preferences, and exercise intake profile.
        </p>
      </div>

      {/* 1. Consent & Audio Recording Permissions */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">
                Audio Processing & Storage Consent
              </h3>
              <p className="text-xs text-slate-500">
                Grant or revoke permission to record and analyze practice audio
              </p>
            </div>
          </div>

          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
              currentPatient.hasConsent
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            {currentPatient.hasConsent ? 'Consent Active' : 'Consent Revoked'}
          </span>
        </div>

        <div className="space-y-4">
          <label className="flex items-start gap-3.5 p-4 rounded-xl border border-slate-200 bg-slate-50/60 cursor-pointer hover:bg-slate-50">
            <input
              id="settings-consent-toggle"
              type="checkbox"
              checked={currentPatient.hasConsent}
              onChange={e => handleToggleConsent(e.target.checked)}
              className="mt-1 w-5 h-5 text-teal-700 rounded border-slate-300 focus:ring-teal-700 cursor-pointer"
            />
            <div className="space-y-1">
              <span className="text-sm font-semibold text-slate-900 block">
                Allow StutterCare to record and process practice audio
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Recordings are used strictly to provide automated non-diagnostic rhythm estimates and shared only with your matched clinician for clinical verification.
              </p>
            </div>
          </label>

          {currentPatient.isMinor && (
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1 text-xs text-amber-950">
              <div className="flex items-center gap-2 font-semibold">
                <UserCheck className="w-4 h-4 text-amber-800" />
                <span>Parent/Guardian Verification Recorded</span>
              </div>
              <p>
                Guardian: <strong>{currentPatient.guardianName || 'Suresh Reddy'}</strong> ({currentPatient.guardianEmail || 'sreddy.parent@example.com'})
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 2. Language Preferences & Intake Questionnaire */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">
                Language & Intake Profile
              </h3>
              <p className="text-xs text-slate-500">
                Adjust communication preferences and revisit therapy goals
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="settings-language-select" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Preferred Practice Language
            </label>
            <select
              id="settings-language-select"
              value={selectedLang}
              onChange={e => handleLanguageChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus-visible:ring-2 focus-visible:ring-teal-700 font-medium"
            >
              <option value="English">English</option>
              <option value="Spanish">Español (Spanish)</option>
              <option value="French">Français (French)</option>
              <option value="German">Deutsch (German)</option>
              <option value="Mandarin">中文 (Mandarin)</option>
              <option value="Hindi">हिन्दी (Hindi)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Intake Questionnaire
            </label>
            <button
              id="reopen-onboarding-btn"
              onClick={onReopenOnboarding}
              className="w-full px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-medium rounded-xl transition flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4 text-teal-700" />
              <span>Review / Edit Intake Answers</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Delete Recordings & Speech Data (with 2-step confirmation) */}
      <section className="bg-white rounded-2xl border border-rose-200/80 p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-rose-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-800">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">
                Delete Speech Recordings & Session Data
              </h3>
              <p className="text-xs text-slate-500">
                Permanently purge all audio recordings and automated estimations
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Under our privacy commitments, you hold complete ownership of your voice. Requesting deletion immediately purges all practice session recordings and speech telemetry from our servers.
        </p>

        <button
          id="open-delete-data-modal-btn"
          onClick={() => setIsDeleteModalOpen(true)}
          className="px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs sm:text-sm font-medium transition flex items-center gap-2 shadow-xs"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete All Recordings & Speech Data</span>
        </button>
      </section>

      {/* Two-Step Deletion Modal */}
      {isDeleteModalOpen && (
        <div
          id="delete-data-confirmation-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-rose-200 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-900">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold font-serif">
                  Permanent Data Deletion
                </h3>
                <p className="text-xs text-rose-800">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              This will permanently delete all practice session recordings, AI rhythm metrics, and self-ratings for <strong>{currentPatient.name}</strong>.
            </p>

            <div>
              <label htmlFor="confirm-delete-input" className="block text-xs font-semibold text-slate-700 mb-1">
                Type <strong>delete</strong> below to confirm:
              </label>
              <input
                id="confirm-delete-input"
                type="text"
                value={deleteConfirmationText}
                onChange={e => setDeleteConfirmationText(e.target.value)}
                placeholder="delete"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-rose-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-purge-btn"
                disabled={deleteConfirmationText.trim().toLowerCase() !== 'delete'}
                onClick={handleConfirmDeleteData}
                className={`px-5 py-2 text-xs font-semibold text-white rounded-xl transition shadow-xs ${
                  deleteConfirmationText.trim().toLowerCase() === 'delete'
                    ? 'bg-rose-700 hover:bg-rose-800'
                    : 'bg-slate-300 cursor-not-allowed text-slate-500'
                }`}
              >
                Permanently Delete Data
              </button>
            </div>
          </div>
        </div>
      )}

      <FootnoteDisclaimer />
    </div>
  );
};
