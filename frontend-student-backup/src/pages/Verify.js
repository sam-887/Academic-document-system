import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

export default function Verify() {
  const { token } = useParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/verify/${token}`)
      .then((res) => setResult(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Verification failed'));
  }, [token]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-white border border-slate-200 rounded-xl p-8 w-full max-w-sm text-center">
        {error && (
          <>
            <div className="text-4xl mb-3">✕</div>
            <p className="font-semibold text-red-600">Not Verified</p>
            <p className="text-sm text-slate-500 mt-1">{error}</p>
          </>
        )}
        {result && (
          <>
            <div className="text-4xl mb-3 text-emerald-600">✓</div>
            <p className="font-semibold text-emerald-700">VERIFIED DOCUMENT</p>
            <dl className="text-sm mt-4 space-y-1 text-left">
              <div className="flex justify-between"><dt className="text-slate-500">Document ID</dt><dd>{result.documentId}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Type</dt><dd>{result.documentType}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Issued</dt><dd>{new Date(result.issueDate).toLocaleDateString()}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Status</dt><dd className="font-medium text-emerald-700">{result.status}</dd></div>
            </dl>
          </>
        )}
        {!result && !error && <p className="text-slate-500 text-sm">Checking...</p>}
      </div>
    </div>
  );
}
