import React, { useState } from 'react';

export default function AIValidation() {
  const [requestId, setRequestId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = async () => {
    if (!requestId.trim()) {
      setError('Enter a Request ID');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/ai/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          requestId: requestId.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'AI validation failed');
      }

      setResult(data.validation);
    } catch (err) {
      setError(err.message || 'Unable to connect to AI validation service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h1 className="text-2xl font-bold text-slate-800">
            ?? AI Document Validation
          </h1>

          <p className="text-slate-500 mt-1 mb-6">
            Compare submitted request details with the student's official record.
          </p>

          <div className="flex gap-3">
            <input
              type="text"
              value={requestId}
              onChange={(e) => setRequestId(e.target.value)}
              placeholder="Enter Request ID"
              className="flex-1 border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />

            <button
              onClick={validate}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 disabled:opacity-50"
            >
              {loading ? 'Validating...' : 'Validate with AI'}
            </button>
          </div>

          {error && (
            <div className="mt-5 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-sm text-slate-500">Confidence</p>
                  <p className="text-2xl font-bold text-green-700">
                    {result.confidence ?? 'N/A'}%
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-sm text-slate-500">Matches</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {result.matches?.length || 0}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-slate-500">Mismatches</p>
                  <p className="text-2xl font-bold text-red-700">
                    {result.mismatches?.length || 0}
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-semibold text-slate-800 mb-2">
                  Matching Fields
                </h2>

                {result.matches?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {result.matches.map((field, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm"
                      >
                        ? {field}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">No matching fields reported.</p>
                )}
              </div>

              <div>
                <h2 className="font-semibold text-slate-800 mb-2">
                  Mismatches
                </h2>

                {result.mismatches?.length ? (
                  <div className="space-y-3">
                    {result.mismatches.map((item, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-red-50 border border-red-200"
                      >
                        <p className="font-semibold text-red-800">
                          {item.field}
                        </p>

                        <p className="text-sm mt-1">
                          <strong>Submitted:</strong>{' '}
                          {String(item.submitted ?? 'N/A')}
                        </p>

                        <p className="text-sm">
                          <strong>On Record:</strong>{' '}
                          {String(item.onRecord ?? 'N/A')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-green-600">
                    No mismatches reported.
                  </p>
                )}
              </div>

              {result.notes && (
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <h2 className="font-semibold text-slate-800 mb-1">
                    AI Notes
                  </h2>
                  <p className="text-slate-600">{result.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
