import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, FileCheck, Check, X, Building2, User, FileText, AlertCircle } from 'lucide-react';

export const CredentialQueue: React.FC = () => {
  const { therapists, verifyTherapistCredential } = useApp();

  return (
    <div id="admin-credential-queue" className="space-y-6">
      <div className="bg-white rounded-2xl border border-teal-100 p-6 sm:p-8 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
            Clinical Licensure Governance
          </span>
          <span className="text-xs text-slate-500">
            ASHA / HCPC / RCSLT Auditing
          </span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 font-serif">
          Therapist Credential Verification Queue
        </h3>
        <p className="text-xs sm:text-sm text-slate-600">
          Review state speech pathology board registrations and identity credentials before granting clinician tier permissions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {therapists.map(th => (
          <div
            key={th.id}
            id={`credential-item-${th.id}`}
            className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 font-serif">
                    {th.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {th.title} • Specialization: {th.specialization}
                  </p>
                </div>
              </div>

              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full border self-start sm:self-auto ${
                  th.verificationStatus === 'verified'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : th.verificationStatus === 'pending_verification'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                {th.verificationStatus === 'verified'
                  ? 'Verified SLP'
                  : th.verificationStatus === 'pending_verification'
                  ? 'Pending Review'
                  : 'Rejected'}
              </span>
            </div>

            {/* Credential Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-slate-500 block mb-0.5">Registration Number:</span>
                <span className="font-mono font-bold text-slate-900">{th.licenseNumber}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-slate-500 block mb-0.5">Licensing Authority:</span>
                <span className="font-semibold text-slate-900">{th.licenseBody}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-slate-500 block mb-0.5">Submitted Documentation:</span>
                <span className="text-teal-800 font-medium flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  license_proof_2026.pdf
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-500 max-w-md">
                {th.bio}
              </p>

              <div className="flex items-center gap-2">
                <button
                  id={`reject-therapist-${th.id}`}
                  onClick={() => verifyTherapistCredential(th.id, 'rejected')}
                  className="px-3.5 py-1.5 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-semibold transition"
                >
                  Reject
                </button>
                <button
                  id={`approve-therapist-${th.id}`}
                  onClick={() => verifyTherapistCredential(th.id, 'verified')}
                  className="px-4 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve Licensure</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
