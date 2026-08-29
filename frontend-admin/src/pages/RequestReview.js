import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';

export default function RequestReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState('');
  const [doc, setDoc] = useState(null);

  const load = async () => {
    const res = await api.get(`/admin/requests/${id}`);
    setRequest(res.data);
    setDraft(res.data.aiRecommendationDraft || '');
    if (res.data.status === 'COMPLETED') {
      try {
        const docRes = await api.get(`/requests/${id}/document`);
        setDoc(docRes.data);
      } catch { /* not generated yet */ }
    }
  };

  useEffect(() => { load(); }, [id]);

  if (!request) return <div className="p-8 text-slate-500">Loading...</div>;

  const doAction = async (fn) => {
    setBusy(true);
    setError('');
    try {
      await fn();
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    } finally {
      setBusy(false);
    }
  };

  const markUnderReview = () => doAction(() => api.patch(`/admin/requests/${id}/review`));
  const approve = () => doAction(() => api.patch(`/admin/requests/${id}/approve`));
  const reject = () => {
    if (!reason.trim()) { setError('Rejection reason is required'); return; }
    doAction(() => api.patch(`/admin/requests/${id}/reject`, { reason }));
  };
  const runValidation = () => doAction(() => api.post('/ai/validate', { requestId: id }));
  const generateDraft = () => doAction(async () => {
    const res = await api.post('/ai/recommendation/generate', { requestId: id });
    setDraft(res.data.draft);
  });
  const saveDraft = () => doAction(() => api.patch('/ai/recommendation/draft', { requestId: id, draft }));

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button onClick={() => navigate(-1)} className="text-sm text-slate-500 mb-4">← Back</button>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">{request.requestId}</h1>
        <StatusBadge status={request.status} />
      </div>
      <p className="text-slate-500 mb-6">{request.documentType} · {request.student?.user?.name} ({request.student?.registerNumber})</p>

      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">{error}</div>}

      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5">
        <h2 className="font-semibold mb-3 text-sm">Student & Request Details</h2>
        <dl className="text-sm space-y-1 mb-4">
          <div className="flex justify-between"><dt className="text-slate-500">Department</dt><dd>{request.student?.department}</dd></div>
          {Object.entries(request.formData || {}).map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <dt className="text-slate-500 capitalize">{k}</dt><dd>{String(v)}</dd>
            </div>
          ))}
        </dl>
        {request.attachments?.length > 0 && (
          <div className="mb-2">
            <p className="text-xs text-slate-500 mb-1">Attachments</p>
            <div className="flex gap-2 flex-wrap">
              {request.attachments.map((a) => (
                <a key={a.filename} href={`${process.env.REACT_APP_API_URL?.replace('/api', '')}${a.path}`} target="_blank" rel="noreferrer"
                   className="text-xs bg-slate-100 px-2 py-1 rounded">
                  {a.originalName}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm">AI Document Validation</h2>
          <button disabled={busy} onClick={runValidation} className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-md disabled:opacity-60">
            Run AI Validation
          </button>
        </div>
        {request.aiValidation ? (
          <div className="text-sm space-y-1">
            <p><span className="text-slate-500">Confidence:</span> {request.aiValidation.confidence ?? 'N/A'}%</p>
            <p><span className="text-slate-500">Matches:</span> {(request.aiValidation.matches || []).join(', ') || 'none'}</p>
            {(request.aiValidation.mismatches || []).length > 0 && (
              <div>
                <p className="text-amber-700 font-medium">⚠ Mismatches</p>
                <ul className="list-disc pl-5">
                  {request.aiValidation.mismatches.map((m, i) => (
                    <li key={i}>{m.field}: submitted "{m.submitted}" vs record "{m.onRecord}"</li>
                  ))}
                </ul>
              </div>
            )}
            {request.aiValidation.notes && <p className="text-slate-500 text-xs">{request.aiValidation.notes}</p>}
            <p className="text-xs text-slate-400 mt-2">AI is assistive only — final approval decision is yours.</p>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Not yet run.</p>
        )}
      </div>

      {request.documentType === 'RECOMMENDATION' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-sm">AI Recommendation Letter Draft</h2>
            <button disabled={busy} onClick={generateDraft} className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-md disabled:opacity-60">
              Generate Draft
            </button>
          </div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={10}
            className="w-full border border-slate-300 rounded-md p-3 text-sm"
            placeholder="Generated draft will appear here — edit as needed before approving."
          />
          <button disabled={busy} onClick={saveDraft} className="mt-2 text-xs bg-slate-800 text-white px-3 py-1.5 rounded-md disabled:opacity-60">
            Save Draft
          </button>
        </div>
      )}

      {request.status === 'COMPLETED' && doc && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-5">
          <p className="text-sm font-medium text-emerald-800 mb-2">Document generated — sent back to the student portal.</p>
          <a
            href={`${process.env.REACT_APP_API_URL?.replace('/api', '')}${doc.filePath}`}
            target="_blank" rel="noreferrer"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4 py-2 rounded-md"
          >
            View {doc.documentId}.pdf
          </a>
        </div>
      )}

      {request.status !== 'REJECTED' && request.status !== 'COMPLETED' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="font-semibold mb-3 text-sm">Decision</h2>
          <div className="flex gap-2 mb-4">
            {request.status === 'PENDING' && (
              <button disabled={busy} onClick={markUnderReview} className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-60">
                Mark Under Review
              </button>
            )}
            <button disabled={busy} onClick={approve} className="text-sm bg-emerald-600 text-white px-4 py-2 rounded-md disabled:opacity-60">
              Approve &amp; Generate PDF
            </button>
          </div>
          <textarea
            value={reason} onChange={(e) => setReason(e.target.value)}
            placeholder="Rejection reason (required to reject)"
            rows={2}
            className="w-full border border-slate-300 rounded-md p-2 text-sm mb-2"
          />
          <button disabled={busy} onClick={reject} className="text-sm bg-red-600 text-white px-4 py-2 rounded-md disabled:opacity-60">
            Reject Request
          </button>
        </div>
      )}
    </div>
  );
}

