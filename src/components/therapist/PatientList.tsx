import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PatientProfile, PatientConnectionStatus } from '../../types';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  Clock,
  Flag,
  ArrowRight,
  UserCheck,
  ShieldAlert
} from 'lucide-react';

interface PatientListProps {
  onSelectPatient: (patientId: string) => void;
}

export const PatientList: React.FC<PatientListProps> = ({ onSelectPatient }) => {
  const { patients, sessions } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | PatientConnectionStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate flagged sessions per patient
  const getFlaggedCount = (patientId: string) => {
    return sessions.filter(s => s.patientId === patientId && s.isFlagged).length;
  };

  const getUnreviewedCount = (patientId: string) => {
    return sessions.filter(s => s.patientId === patientId && s.status === 'AI-guided — needs review').length;
  };

  const filteredPatients = patients.filter(p => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.therapyGoals.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div id="therapist-patient-list" className="space-y-6">
      {/* Header with Search and Filter */}
      <div className="bg-white rounded-2xl border border-teal-100 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              Clinician Caseload
            </span>
            <h2 className="text-2xl font-bold text-slate-900 font-serif mt-1">
              Patient Roster & Caseload
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Manage connected patients, triage waitlisted intakes, and review AI-guided practice submissions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              Total Active: <strong>{patients.length}</strong>
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by patient name or therapy goal..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus-visible:ring-2 focus-visible:ring-teal-700"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus-visible:ring-2 focus-visible:ring-teal-700 font-medium"
            >
              <option value="all">All Connection States</option>
              <option value="connected">Connected (Assigned SLP)</option>
              <option value="ai_fallback">AI-Guided Sandbox Mode</option>
              <option value="waitlisted">Waitlisted Intakes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Patient Name</th>
                <th className="py-3.5 px-4">Connection State</th>
                <th className="py-3.5 px-4">Weekly Goal</th>
                <th className="py-3.5 px-4">Last Activity</th>
                <th className="py-3.5 px-4">Flagged / Unreviewed</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPatients.map(patient => {
                const flagged = getFlaggedCount(patient.id);
                const unreviewed = getUnreviewedCount(patient.id);

                return (
                  <tr
                    key={patient.id}
                    className="hover:bg-teal-50/40 transition cursor-pointer"
                    onClick={() => onSelectPatient(patient.id)}
                  >
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <span>{patient.name}</span>
                        {patient.isMinor && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                            Minor ({patient.age}y)
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {patient.therapyGoals[0] || 'No primary goal defined'}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      {patient.status === 'connected' && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          Connected
                        </span>
                      )}
                      {patient.status === 'ai_fallback' && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                          AI-Fallback
                        </span>
                      )}
                      {patient.status === 'waitlisted' && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-300">
                          <Clock className="w-3.5 h-3.5 text-slate-600" />
                          Waitlisted
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-xs font-medium text-slate-900">
                        {patient.weeklyGoalCompleted} / {patient.weeklyGoalTarget}
                      </span>
                      <span className="text-slate-500 text-[11px] block">sessions</span>
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-600">
                      {patient.lastSessionDate || 'No recorded sessions'}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {flagged > 0 && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                            <Flag className="w-3 h-3 text-amber-800" />
                            {flagged} Flagged
                          </span>
                        )}
                        {unreviewed > 0 && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-900 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                            {unreviewed} to review
                          </span>
                        )}
                        {flagged === 0 && unreviewed === 0 && (
                          <span className="text-xs text-slate-600">Up to date</span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPatient(patient.id);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-medium transition"
                      >
                        <span>Open Chart</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
