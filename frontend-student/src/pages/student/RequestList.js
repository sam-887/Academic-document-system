import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';

export default function RequestList() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    api.get('/requests').then((res) => setRequests(res.data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Requests</h1>
      <div className="bg-white border border-slate-200 rounded-xl divide-y">
        {requests.length === 0 && <p className="p-4 text-sm text-slate-500">No requests yet.</p>}
        {requests.map((r) => (
          <Link key={r._id} to={`/student/requests/${r.requestId}`} className="flex items-center justify-between p-4 hover:bg-slate-50">
            <div>
              <p className="font-medium text-sm">{r.requestId}</p>
              <p className="text-xs text-slate-500">{r.documentType} · {new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
            <StatusBadge status={r.status} />
          </Link>
        ))}
      </div>
    </div>
  );
}
