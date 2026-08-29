import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const DOC_TYPES = [
  { key: 'BONAFIDE', label: 'Bona Fide Certificate', fields: ['purpose', 'institution', 'additionalInfo'] },
  { key: 'TRANSCRIPT', label: 'Transcript', fields: ['semester', 'purpose', 'destination'] },
  {
    key: 'RECOMMENDATION',
    label: 'Recommendation Letter',
    fields: ['cgpa', 'skills', 'projects', 'achievements', 'internships', 'purpose', 'organization'],
  },
];

export default function RequestForm() {
  const navigate = useNavigate();
  const [docType, setDocType] = useState('BONAFIDE');
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const activeType = DOC_TYPES.find((d) => d.key === docType);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const payload = new FormData();
      payload.append('documentType', docType);
      payload.append('formData', JSON.stringify(formData));
      files.forEach((f) => payload.append('attachments', f));

      const res = await api.post('/requests', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/student/requests/${res.data.requestId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Apply for a Document</h1>
      <form onSubmit={submit} className="bg-white border border-slate-200 rounded-xl p-6">
        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">{error}</div>}

        <label className="block text-sm mb-1">Document type</label>
        <select
          value={docType}
          onChange={(e) => { setDocType(e.target.value); setFormData({}); }}
          className="w-full mb-5 border border-slate-300 rounded-md px-3 py-2 text-sm"
        >
          {DOC_TYPES.map((d) => <option key={d.key} value={d.key}>{d.label}</option>)}
        </select>

        {activeType.fields.map((f) => (
          <div key={f} className="mb-4">
            <label className="block text-sm mb-1 capitalize">{f.replace(/([A-Z])/g, ' $1')}</label>
            <input
              value={formData[f] || ''}
              onChange={(e) => setFormData({ ...formData, [f]: e.target.value })}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
        ))}

        <label className="block text-sm mb-1">Supporting document (PDF/JPG/PNG, up to 3)</label>
        <input
          type="file" multiple accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setFiles(Array.from(e.target.files))}
          className="w-full mb-6 text-sm"
        />

        <button disabled={busy} className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-md py-2 text-sm font-medium disabled:opacity-60">
          {busy ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
}
