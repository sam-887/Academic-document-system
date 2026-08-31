import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const DOC_TYPES = [
  {
    key: 'BONAFIDE',
    label: 'Bona Fide Certificate',
    description: 'Proof of student status for official purposes.',
    icon: '🎓',
    fields: ['purpose', 'institution', 'additionalInfo'],
  },
  {
    key: 'TRANSCRIPT',
    label: 'Transcript',
    description: 'Academic record containing your semester results.',
    icon: '📊',
    fields: ['semester', 'purpose', 'destination'],
  },
  {
    key: 'RECOMMENDATION',
    label: 'Recommendation Letter',
    description: 'Request an official recommendation letter.',
    icon: '✉️',
    fields: [
      'cgpa',
      'skills',
      'projects',
      'achievements',
      'internships',
      'purpose',
      'organization',
    ],
  },
];

const FIELD_LABELS = {
  purpose: 'Purpose',
  institution: 'Institution',
  additionalInfo: 'Additional Information',
  semester: 'Semester',
  destination: 'Destination',
  cgpa: 'CGPA',
  skills: 'Skills',
  projects: 'Projects',
  achievements: 'Achievements',
  internships: 'Internships',
  organization: 'Organization',
};

export default function RequestForm() {
  const navigate = useNavigate();

  const [docType, setDocType] = useState('BONAFIDE');
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const activeType = DOC_TYPES.find((d) => d.key === docType);

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);

    try {
      const payload = new FormData();

      payload.append('documentType', docType);
      payload.append('formData', JSON.stringify(formData));

      files.forEach((file) => {
        payload.append('attachments', file);
      });

      const res = await api.post('/requests', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate(`/student/requests/${res.data.requestId}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to submit request. Please try again.'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate('/student/dashboard')}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            ← Back to Dashboard
          </button>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                DOCUMENT SERVICES
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                New Document Request
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Select the document you need, provide the required details,
                and submit your request to the administration.
              </p>
            </div>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
              !
            </div>

            <div>
              <p className="font-semibold">Request could not be submitted</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={submit}>

          {/* DOCUMENT TYPE */}
          <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Step 1
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Choose document type
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Select the certificate or document you want to request.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">

              {DOC_TYPES.map((type) => {
                const selected = docType === type.key;

                return (
                  <button
                    key={type.key}
                    type="button"
                    onClick={() => {
                      setDocType(type.key);
                      setFormData({});
                    }}
                    className={[
                      'group relative rounded-2xl border-2 p-5 text-left transition-all duration-200',
                      selected
                        ? 'border-blue-600 bg-blue-50 shadow-md'
                        : 'border-slate-200 bg-white hover:-translate-y-1 hover:border-blue-300 hover:shadow-md',
                    ].join(' ')}
                  >

                    {selected && (
                      <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                        ✓
                      </span>
                    )}

                    <div
                      className={[
                        'mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-2xl',
                        selected
                          ? 'bg-blue-600'
                          : 'bg-slate-100 group-hover:bg-blue-50',
                      ].join(' ')}
                    >
                      {type.icon}
                    </div>

                    <h3 className="font-bold text-slate-900">
                      {type.label}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {type.description}
                    </p>

                  </button>
                );
              })}

            </div>
          </section>

          {/* FORM */}
          <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Step 2
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Request details
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Provide accurate information so the administration can process
                your request.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              {activeType.fields.map((field) => {
                const longField = [
                  'additionalInfo',
                  'skills',
                  'projects',
                  'achievements',
                  'internships',
                  'purpose',
                ].includes(field);

                return (
                  <div
                    key={field}
                    className={longField ? 'sm:col-span-2' : ''}
                  >

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      {FIELD_LABELS[field] || field}
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    {longField ? (
                      <textarea
                        value={formData[field] || ''}
                        onChange={(e) =>
                          updateField(field, e.target.value)
                        }
                        rows={4}
                        required
                        placeholder={`Enter ${(
                          FIELD_LABELS[field] || field
                        ).toLowerCase()}...`}
                        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      />
                    ) : (
                      <input
                        value={formData[field] || ''}
                        onChange={(e) =>
                          updateField(field, e.target.value)
                        }
                        required
                        placeholder={`Enter ${(
                          FIELD_LABELS[field] || field
                        ).toLowerCase()}...`}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      />
                    )}

                  </div>
                );
              })}

            </div>
          </section>

          {/* ATTACHMENTS */}
          <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Step 3
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Supporting documents
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Upload documents that support your request.
              </p>
            </div>

            <label className="block cursor-pointer">

              <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-blue-400 hover:bg-blue-50">

                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                  📎
                </div>

                <p className="font-semibold text-slate-800">
                  Click to upload files
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  PDF, JPG or PNG • Maximum 3 files
                </p>

                {files.length > 0 && (
                  <div className="mx-auto mt-5 max-w-md text-left">

                    {files.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="mb-2 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="text-lg">📄</span>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-800">
                              {file.name}
                            </p>

                            <p className="text-xs text-slate-400">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                  </div>
                )}

              </div>

              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const selected = Array.from(e.target.files || []);

                  if (selected.length > 3) {
                    setError('You can upload a maximum of 3 files.');
                    setFiles(selected.slice(0, 3));
                  } else {
                    setError('');
                    setFiles(selected);
                  }
                }}
                className="hidden"
              />

            </label>
          </section>

          {/* SUBMIT */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="font-semibold text-slate-900">
                  Ready to submit?
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Your request will be sent to the administration for review.
                </p>
              </div>

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={() => navigate('/student/dashboard')}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busy ? 'Submitting...' : 'Submit Request →'}
                </button>

              </div>

            </div>

          </section>

        </form>

      </div>
    </div>
  );
}
