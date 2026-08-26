import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Filter, Search, Clock, FileText, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

export const AuditLogViewer: React.FC = () => {
  const { auditLogs } = useApp();

  const [severityFilter, setSeverityFilter] = useState<'all' | 'info' | 'warning' | 'critical'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    const matchesSearch =
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  return (
    <div id="admin-audit-log-viewer" className="space-y-6">
      <div className="bg-white rounded-2xl border border-teal-100 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              System Telemetry & Compliance
            </span>
            <h3 className="text-xl font-bold text-slate-900 font-serif mt-1">
              Immutable Clinical Audit Log
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Comprehensive trace of consent updates, metric corrections, mode transitions, and credential audits.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Total Entries: <strong>{auditLogs.length}</strong>
          </div>
        </div>

        {/* Search & Severity Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search audit trail by actor, action, or details..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus-visible:ring-2 focus-visible:ring-teal-700"
            />
          </div>

          <div>
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus-visible:ring-2 focus-visible:ring-teal-700 font-medium"
            >
              <option value="all">All Severity Levels</option>
              <option value="info">Info / Normal Operations</option>
              <option value="warning">Warning / Clinical Overwrite</option>
              <option value="critical">Critical / Deletions & Revocations</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-6">Timestamp</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-6">Details & Audit Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-xs">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-6 whitespace-nowrap text-slate-500 font-sans">
                    {log.timestamp}
                  </td>

                  <td className="py-3.5 px-4 font-sans">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                        log.severity === 'critical'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : log.severity === 'warning'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-teal-50 text-teal-800 border-teal-200'
                      }`}
                    >
                      {log.severity === 'critical' && <AlertTriangle className="w-3 h-3 text-rose-700" />}
                      {log.severity === 'warning' && <AlertCircle className="w-3 h-3 text-amber-700" />}
                      {log.severity === 'info' && <CheckCircle2 className="w-3 h-3 text-teal-700" />}
                      <span className="capitalize">{log.severity}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-900 font-sans">
                    {log.actor}
                  </td>

                  <td className="py-3.5 px-4 font-sans font-medium text-slate-800">
                    {log.action}
                  </td>

                  <td className="py-3.5 px-6 text-slate-600 font-sans text-xs">
                    {log.details}
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
