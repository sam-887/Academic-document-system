import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get('/requests/dashboard/summary').then((res) => setSummary(res.data));
  }, []);

  if (!summary) return <div className="p-8 text-slate-500">Loading...</div>;

  const cards = [
    { label: 'Total', value: summary.total, color: 'bg-slate-100 text-slate-800' },
    { label: 'Pending', value: summary.pending, color: 'bg-amber-100 text-amber-800' },
    { label: 'Approved / Completed', value: summary.approved, color: 'bg-emerald-100 text-emerald-800' },
    { label: 'Rejected', value: summary.rejected, color: 'bg-red-100 text-red-800' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <Link to="/student/request" className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-md">
          + New Request
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className={`rounded-xl p-4 ${c.color}`}>
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="text-sm">{c.label}</p>
          </div>
        ))}
      </div>

      <h2 className="font-semibold mb-3">Recent Requests</h2>
      <div className="bg-white border border-slate-200 rounded-xl divide-y">
        {summary.recent.length === 0 && <p className="p-4 text-sm text-slate-500">No requests yet.</p>}
        {summary.recent.map((r) => (
          <Link key={r._id} to={`/student/requests/${r.requestId}`} className="flex items-center justify-between p-4 hover:bg-slate-50">
            <div>
              <p className="font-medium text-sm">{r.requestId}</p>
              <p className="text-xs text-slate-500">{r.documentType}</p>
            </div>
            <StatusBadge status={r.status} />
          </Link>
        ))}
      </div>
      <div className="mt-4">
        <Link to="/student/requests" className="text-sm text-brand-600">View all requests →</Link>
      </div>
    </div>
  );
}
