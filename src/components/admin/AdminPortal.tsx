import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserManagement } from './UserManagement';
import { CredentialQueue } from './CredentialQueue';
import { ContentManagement } from './ContentManagement';
import { AuditLogViewer } from './AuditLogViewer';
import {
  ShieldAlert,
  Users,
  FileCheck,
  BookOpen,
  History,
  Shield
} from 'lucide-react';
import { FootnoteDisclaimer } from '../common/FootnoteDisclaimer';

export const AdminPortal: React.FC = () => {
  const [adminTab, setAdminTab] = useState<'users' | 'credentials' | 'content' | 'audit'>('users');
  const { therapists } = useApp();

  const pendingCredentialsCount = therapists.filter(
    t => t.verificationStatus === 'pending_verification'
  ).length;

  return (
    <div id="admin-portal-container" className="space-y-6">
      {/* Admin Title Bar */}
      <section className="bg-white rounded-2xl border border-teal-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-800 text-white flex items-center justify-center font-bold text-lg font-serif">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 font-serif">
                System Administration & Clinical Governance
              </h2>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              StutterCare Health Platform • Auditing, Compliance & Content Gatekeeper
            </p>
          </div>
        </div>
      </section>

      {/* Admin Sub Navigation */}
      <nav
        id="admin-subnav"
        className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto"
      >
        <button
          id="tab-admin-users"
          onClick={() => setAdminTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
            adminTab === 'users'
              ? 'bg-teal-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User & Therapist Accounts</span>
        </button>

        <button
          id="tab-admin-credentials"
          onClick={() => setAdminTab('credentials')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
            adminTab === 'credentials'
              ? 'bg-teal-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Licensure Verification</span>
          {pendingCredentialsCount > 0 && (
            <span
              className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                adminTab === 'credentials'
                  ? 'bg-teal-700 text-white'
                  : 'bg-amber-100 text-amber-900'
              }`}
            >
              {pendingCredentialsCount}
            </span>
          )}
        </button>

        <button
          id="tab-admin-content"
          onClick={() => setAdminTab('content')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
            adminTab === 'content'
              ? 'bg-teal-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Content Tiers & Approval</span>
        </button>

        <button
          id="tab-admin-audit"
          onClick={() => setAdminTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
            adminTab === 'audit'
              ? 'bg-teal-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Audit Trail Logs</span>
        </button>
      </nav>

      {/* Main Admin Sub-View */}
      <main id="admin-main-content">
        {adminTab === 'users' && <UserManagement />}
        {adminTab === 'credentials' && <CredentialQueue />}
        {adminTab === 'content' && <ContentManagement />}
        {adminTab === 'audit' && <AuditLogViewer />}
      </main>

      <FootnoteDisclaimer />
    </div>
  );
};
