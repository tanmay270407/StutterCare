import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, UserCheck, Shield, Check, X, Search, ToggleLeft, ToggleRight } from 'lucide-react';

interface MockUserRow {
  id: string;
  name: string;
  role: 'Patient' | 'SLP Therapist' | 'Clinical Admin';
  email: string;
  status: 'active' | 'deactivated';
  createdDate: string;
}

export const UserManagement: React.FC = () => {
  const { patients, therapists, addNotification } = useApp();

  const [users, setUsers] = useState<MockUserRow[]>([
    { id: 'u-1', name: 'Aarav Sharma', role: 'Patient', email: 'aarav.sharma@example.com', status: 'active', createdDate: '2026-08-10' },
    { id: 'u-2', name: 'Ishita Reddy', role: 'Patient', email: 'ishita.reddy@example.com', status: 'active', createdDate: '2026-08-14' },
    { id: 'u-3', name: 'Rohan Mehta', role: 'Patient', email: 'rohan.mehta@example.com', status: 'active', createdDate: '2026-08-18' },
    { id: 'u-4', name: 'Meera Rai', role: 'Patient', email: 'meera.rai@example.com', status: 'active', createdDate: '2026-08-20' },
    { id: 'u-5', name: 'Vihaan Patel', role: 'Patient', email: 'vihaan.patel@example.com', status: 'active', createdDate: '2026-08-21' },
    { id: 'u-6', name: 'Ananya Nair', role: 'Patient', email: 'ananya.nair@example.com', status: 'active', createdDate: '2026-08-22' },
    { id: 'u-7', name: 'Kabir Singh', role: 'Patient', email: 'kabir.singh@example.com', status: 'active', createdDate: '2026-08-23' },
    { id: 'u-8', name: 'Dr. Kavya Rao', role: 'SLP Therapist', email: 'krao.slp@stuttercare.org', status: 'active', createdDate: '2026-07-01' },
    { id: 'u-9', name: 'Arjun Verma', role: 'SLP Therapist', email: 'averma.slp@stuttercare.org', status: 'active', createdDate: '2026-07-15' },
    { id: 'u-10', name: 'Priya Menon', role: 'SLP Therapist', email: 'pmenon.slp@stuttercare.org', status: 'active', createdDate: '2026-08-01' },
    { id: 'u-11', name: 'Neha Kapoor (Lead Admin)', role: 'Clinical Admin', email: 'nkapoor.admin@stuttercare.org', status: 'active', createdDate: '2026-06-15' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const handleToggleUserStatus = (id: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === id) {
          const next = u.status === 'active' ? 'deactivated' : 'active';
          addNotification(`User ${u.name} is now ${next}.`, next === 'active' ? 'success' : 'amber');
          return { ...u, status: next };
        }
        return u;
      })
    );
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="admin-user-management" className="space-y-6">
      <div className="bg-white rounded-2xl border border-teal-100 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              Identity & Access Management
            </span>
            <h3 className="text-xl font-bold text-slate-900 font-serif mt-1">
              User & Therapist Accounts
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Manage patient accounts, SLP clinician privileges, and account activations.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by name, role, email..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus-visible:ring-2 focus-visible:ring-teal-700"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-6">User Name</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Joined</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Access Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-6 font-semibold text-slate-900">
                    {u.name}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                        u.role === 'Patient'
                          ? 'bg-teal-50 text-teal-800 border-teal-200'
                          : u.role === 'SLP Therapist'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-purple-50 text-purple-800 border-purple-200'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-600 font-mono text-xs">
                    {u.email}
                  </td>
                  <td className="py-4 px-4 text-slate-500 text-xs">
                    {u.createdDate}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
                        u.status === 'active'
                          ? 'text-emerald-800 bg-emerald-50'
                          : 'text-slate-600 bg-slate-100'
                      }`}
                    >
                      {u.status === 'active' ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      id={`toggle-user-btn-${u.id}`}
                      onClick={() => handleToggleUserStatus(u.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1.5 ${
                        u.status === 'active'
                          ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                          : 'bg-emerald-800 text-white hover:bg-emerald-900'
                      }`}
                    >
                      {u.status === 'active' ? 'Deactivate' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
