import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';

const STEPS = ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'GENERATING', 'COMPLETED'];

export default function RequestDetail() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);

  const [doc, setDoc] = useState(null);

  useEffect(() => {
    api.get(`/requests/${id}`).then((res) => setRequest(res.data));
  }, [id]);

  useEffect(() => {
    if (request?.status === 'COMPLETED') {
      api.get(`/requests/${id}/document`).then((res) => setDoc(res.data)).catch(() => {});
    }
  }, [id, request?.status]);

  if (!request) return <div className="p-8 text-slate-500">Loading...</div>;

  const isRejected = request.status === 'REJECTED';
  const currentIdx = STEPS.indexOf(request.status);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">{request.requestId}</h1>
        <StatusBadge status={request.status} />
      </div>
      <p className="text-slate-500 mb-6">{request.documentType}</p>

      {!isRejected && (
        <div className="flex items-center mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`w-3 h-3 rounded-full ${i <= currentIdx ? 'bg-brand-600' : 'bg-slate-200'}`} />
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${i < currentIdx ? 'bg-brand-600' : 'bg-slate-200'}`} />}
            </React.Fragment>
          ))}
        </div>
      )}

      {isRejected && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="font-medium text-red-700 text-sm">Rejected</p>
          <p className="text-sm text-red-600">{request.remarks}</p>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-4">
        <h2 className="font-semibold mb-3 text-sm">Form Details</h2>
        <dl className="text-sm space-y-1">
          {Object.entries(request.formData || {}).map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <dt className="text-slate-500 capitalize">{k}</dt>
              <dd>{String(v)}</dd>
            </div>
          ))}
        </dl>
      </div>

      {request.status === 'COMPLETED' && doc && (
        <a
          href={`${process.env.REACT_APP_API_URL?.replace('/api', '')}${doc.filePath}`}
          target="_blank" rel="noreferrer"
          className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4 py-2 rounded-md"
        >
          Download {doc.documentId}.pdf
        </a>
      )}
    </div>
  );
}
