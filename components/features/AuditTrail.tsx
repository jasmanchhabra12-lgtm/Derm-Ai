'use client';

import { ShieldCheck, Database, Lock, Activity, Link as LinkIcon } from 'lucide-react';

const mockAuditLogs = [
  { id: 'tx-8f9a2b', timestamp: '2023-10-24 14:32:01 UTC', action: 'Lesion Analysis (Initial)', patient: 'Anonymized-A9B2', hash: '0x3f8e...9a2b' },
  { id: 'tx-7c3d1e', timestamp: '2023-10-24 14:35:12 UTC', action: 'Referral Initiated', patient: 'Anonymized-A9B2', hash: '0x1a2b...3c4d' },
  { id: 'tx-6b2c0f', timestamp: '2023-10-22 09:15:44 UTC', action: 'Longitudinal Update', patient: 'Anonymized-C4F1', hash: '0x9e8d...7c6b' },
  { id: 'tx-5a1b9e', timestamp: '2023-10-18 11:05:22 UTC', action: 'Lesion Analysis (Follow-up)', patient: 'Anonymized-X9P0', hash: '0x5f4e...3d2c' },
  { id: 'tx-4z0y8d', timestamp: '2023-10-15 16:40:05 UTC', action: 'Lesion Analysis (Initial)', patient: 'Anonymized-M2N5', hash: '0x2c3b...4a5f' },
];

export default function AuditTrail() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <ShieldCheck className="w-7 h-7 text-emerald-600" />
          Blockchain Audit Trail
        </h1>
        <p className="text-slate-500 mt-1 max-w-2xl">
          Immutable, cryptographically secure logs of all AI analyses and clinical actions. Patient data is anonymized to ensure HIPAA compliance while maintaining a verifiable history.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Records</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">1,248</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Network Status</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">Secure & Synced</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Latest Block</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">#8,942,105</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Recent Transactions</h2>
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Network
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Tx ID</th>
                <th className="px-6 py-4 font-medium">Timestamp (UTC)</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Anonymized Patient</th>
                <th className="px-6 py-4 font-medium">Cryptographic Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockAuditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-blue-600 hover:underline cursor-pointer flex items-center gap-1.5">
                    <LinkIcon className="w-3 h-3" />
                    {log.id}
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{log.timestamp}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{log.action}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{log.patient}</td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-slate-400 bg-slate-50/50 rounded px-2 py-1 border border-slate-100">
                      {log.hash}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 text-center">
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            View All Transactions
          </button>
        </div>
      </div>
    </div>
  );
}
