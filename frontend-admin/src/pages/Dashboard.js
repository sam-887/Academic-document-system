import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    api.get('/admin/summary').then((res) => setSummary(res.data));
    api.get('/admin/requests').then((res) => setRequests(res.data.slice(0, 15)));
  }, []);

  if (!summary) return <div className="p-8 text-slate-500">Loading...</div>;

  const cards = [
    { label: 'Pending', value: summary.pending, color: 'bg-amber-100 text-amber-800' },
    { label: 'Approved', value: summary.approved, color: 'bg-emerald-100 text-emerald-800' },
    { label: 'Rejected', value: summary.rejected, color: 'bg-red-100 text-red-800' },
    { label: 'Total', value: summary.total, color: 'bg-slate-100 text-slate-800' },
  ];

  const maxCount = Math.max(1, ...summary.byType.map((t) => t.count));

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
      <p className="text-sm text-slate-500 mb-6">Requests submitted from the student portal appear here in real time.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className={`rounded-xl p-4 ${c.color}`}>
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="text-sm">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-8">
        <h2 className="font-semibold mb-4 text-sm">Requests by Document Type</h2>
        <div className="space-y-2">
          {summary.byType.map((t) => (
            <div key={t._id} className="flex items-center gap-3">
              <span className="w-32 text-xs text-slate-500">{t._id}</span>
              <div className="flex-1 bg-slate-100 rounded h-3">
                <div className="bg-brand-600 h-3 rounded" style={{ width: `${(t.count / maxCount) * 100}%` }} />
              </div>
              <span className="text-xs w-6 text-right">{t.count}</span>
            </div>
          ))}
        </div>
      </div>

      <h2 className="font-semibold mb-3">All Requests</h2>
      <div className="bg-white border border-slate-200 rounded-xl divide-y">
        {requests.length === 0 && <p className="p-4 text-sm text-slate-500">No requests yet.</p>}
        {requests.map((r) => (
          <Link key={r._id} to={`/requests/${r.requestId}`} className="flex items-center justify-between p-4 hover:bg-slate-50">
            <div>
              <p className="font-medium text-sm">{r.requestId} · {r.student?.user?.name}</p>
              <p className="text-xs text-slate-500">{r.documentType}</p>
            </div>
            <StatusBadge status={r.status} />
          </Link>
        ))}
      </div>
    </div>
  );
}
