import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Exercise } from '../../types';
import { BookOpen, ShieldCheck, ShieldAlert, Layers, Check, X, Info } from 'lucide-react';

export const ContentManagement: React.FC = () => {
  const {
    tier1Exercises,
    tier2Exercises,
    toggleTier2Approval
  } = useApp();

  const [activeTab, setActiveTab] = useState<'tier2' | 'tier1'>('tier2');

  return (
    <div id="admin-content-management" className="space-y-6">
      <div className="bg-white rounded-2xl border border-teal-100 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              Clinical Library Governance
            </span>
            <h3 className="text-xl font-bold text-slate-900 font-serif mt-1">
              Content Tier Sign-Off & Unsupervised Permissions
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Only Tier 2 general exercises can be designated as "Approved for unsupervised AI use". Tier 1 content remains strictly clinician-supervised.
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 border-b border-slate-100 pb-2">
          <button
            id="tab-admin-tier2"
            onClick={() => setActiveTab('tier2')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'tier2'
                ? 'bg-teal-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tier 2 General Safe Library ({tier2Exercises.length})
          </button>
          <button
            id="tab-admin-tier1"
            onClick={() => setActiveTab('tier1')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'tier1'
                ? 'bg-teal-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tier 1 Individualized Clinician Drills ({tier1Exercises.length})
          </button>
        </div>
      </div>

      {/* TIER 2 EXERCISES LIST */}
      {activeTab === 'tier2' && (
        <div className="space-y-4">
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 text-xs text-emerald-950">
            <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block mb-0.5">Tier 2 Safety Protocol:</strong>
              Exercises listed below are designed for independent, self-paced patient practice. Toggle the supervisory sign-off to grant or withdraw the "Approved for unsupervised AI use" badge.
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {tier2Exercises.map(ex => (
              <div
                key={ex.id}
                id={`tier2-admin-item-${ex.id}`}
                className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900 font-serif">
                        {ex.title}
                      </h4>
                      <span className="text-xs text-slate-500 font-mono">
                        (Category: {ex.category})
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {ex.description}
                    </p>
                  </div>

                  {/* Sign-off Toggle */}
                  <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
                    <span className="text-xs font-medium text-slate-700">
                      Approved for unsupervised AI use:
                    </span>
                    <button
                      id={`toggle-tier2-btn-${ex.id}`}
                      onClick={() => toggleTier2Approval(ex.id, !ex.approvedForUnsupervised, 'Neha Kapoor (Lead Admin)')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                        ex.approvedForUnsupervised
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {ex.approvedForUnsupervised ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      <span>{ex.approvedForUnsupervised ? 'Approved' : 'Disabled'}</span>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-700">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">
                    Standard Passage:
                  </span>
                  <p className="italic">"{ex.samplePrompt}"</p>
                </div>

                <div className="text-[11px] text-slate-500 flex justify-between">
                  <span>Sign-off Clinician: {ex.approvedBy || 'Pending SLP Signature'}</span>
                  <span>Approval Date: {ex.approvalDate || 'Unverified'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TIER 1 EXERCISES LIST */}
      {activeTab === 'tier1' && (
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-700">
            <Info className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block mb-0.5">Tier 1 Supervised Scope:</strong>
              Tier 1 exercises are patient-specific individualized drills generated directly by treating Speech-Language Pathologists. They cannot receive global unsupervised approval badges.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tier1Exercises.map(ex => (
              <div
                key={ex.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Tier 1 • Individualized
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ID: #{ex.id}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 font-serif">
                  {ex.title}
                </h4>
                <p className="text-xs text-slate-600">
                  {ex.description}
                </p>

                <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-700">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">
                    Passage:
                  </span>
                  <p className="italic">"{ex.samplePrompt}"</p>
                </div>

                <div className="text-[11px] text-slate-500 pt-1">
                  <span>Assigned by: {ex.assignedByTherapist || 'Clinician'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
