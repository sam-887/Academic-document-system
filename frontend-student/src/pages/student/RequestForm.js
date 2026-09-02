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
    icon: '📄',
    fields: ['semester', 'purpose', 'destination'],
  },
  {
    key: 'RECOMMENDATION',
    label: 'Recommendation Letter',
    description: 'Request an official recommendation letter.',
    icon: '📝',
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
  const [idCard, setIdCard] = useState(null);
  const [lockerDocs, setLockerDocs] = useState([]);
  const [lockerOpen, setLockerOpen] = useState(false);
  const [lockerDocuments, setLockerDocuments] = useState([]);
  const [lockerLoading, setLockerLoading] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const activeType = DOC_TYPES.find((d) => d.key === docType);

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const openDigitalLocker = async () => {
    setLockerOpen(true);
    setLockerLoading(true);
    setError('');

    try {
      const res = await api.get('/locker');
      setLockerDocuments(res.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to load Digital Locker.'
      );
    } finally {
      setLockerLoading(false);
    }
  };

  const toggleLockerDocument = (document) => {
    setLockerDocs((prev) => {
      const exists = prev.some((item) => item._id === document._id);

      if (exists) {
        return prev.filter((item) => item._id !== document._id);
      }

      return [...prev, document];
    });
  };
  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);

    try {
      const payload = new FormData();

      payload.append('documentType', docType);
      payload.append('formData', JSON.stringify(formData));

      // Bonafide ID card
      if (docType === 'BONAFIDE' && idCard) {
        payload.append('attachments', idCard);
      }

      // Other supporting documents
      files.forEach((file) => {
        payload.append('attachments', file);
      });

      // Documents selected from Digital Locker
      if (docType === 'BONAFIDE' && lockerDocs.length > 0) {
        payload.append(
          'lockerDocumentIds',
          JSON.stringify(lockerDocs.map((doc) => doc._id))
        );
      }

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
             Back to Dashboard
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
                      'request-doc-option group relative rounded-2xl border-2 p-5 text-left transition-all duration-200',
                      selected
                        ? 'is-selected border-blue-600 bg-blue-50 shadow-md'
                        : 'border-slate-200 bg-white hover:-translate-y-1 hover:border-blue-300 hover:shadow-md',
                    ].join(' ')}
                  >

                    {selected && (
                      <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                        
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

                    <h3 className={`font-bold ${selected ? "text-slate-900" : "text-slate-900"}`}>
                      {type.label}
                    </h3>

                    <p className={`mt-2 text-xs leading-5 ${selected ? "text-slate-600" : "text-slate-500"}`}>
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

            {docType === 'BONAFIDE' ? (
              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Year <span className="text-red-500">*</span>
                  </label>

                  <select
                    value={formData.year || ''}
                    onChange={(e) => updateField('year', e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">Select year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Semester <span className="text-red-500">*</span>
                  </label>

                  <select
                    value={formData.semester || ''}
                    onChange={(e) => updateField('semester', e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">Select semester</option>
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                    <option value="3rd Semester">3rd Semester</option>
                    <option value="4th Semester">4th Semester</option>
                    <option value="5th Semester">5th Semester</option>
                    <option value="6th Semester">6th Semester</option>
                    <option value="7th Semester">7th Semester</option>
                    <option value="8th Semester">8th Semester</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Department <span className="text-red-500">*</span>
                  </label>

                  <input
                    value={formData.department || ''}
                    onChange={(e) => updateField('department', e.target.value)}
                    required
                    placeholder="Artificial Intelligence and Data Science"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Bonafide Type <span className="text-red-500">*</span>
                  </label>

                  <select
                    value={formData.bonafideType || ''}
                    onChange={(e) => updateField('bonafideType', e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">Select bonafide type</option>
                    <option value="Bonafide Only">Bonafide Only</option>
                    <option value="Bonafide with Fee Structure">
                      Bonafide with Fee Structure
                    </option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Purpose <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    value={formData.purpose || ''}
                    onChange={(e) => updateField('purpose', e.target.value)}
                    required
                    rows={3}
                    placeholder="Example: Scholarship application"
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Additional Information
                  </label>

                  <textarea
                    value={formData.additionalInfo || ''}
                    onChange={(e) => updateField('additionalInfo', e.target.value)}
                    rows={4}
                    placeholder="Enter any additional information..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

              </div>
            ) : (
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
            )}
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
                Select documents from your device or Digital Locker.
              </p>
            </div>

            {docType === 'BONAFIDE' && (
              <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">

                <p className="mb-4 text-sm font-bold text-slate-800">
                  Where do you want to select your files from?
                </p>

                <div className="grid gap-3 sm:grid-cols-2">

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-400 hover:shadow-sm">
                    <span className="text-2xl">💻</span>

                    <div>
                      <p className="font-semibold text-slate-800">
                        Choose from Device
                      </p>
                      <p className="text-xs text-slate-500">
                        Select files using system File Explorer
                      </p>
                    </div>

                    <input
                      type="radio"
                      name="fileSource"
                      value="device"
                      defaultChecked
                      className="ml-auto"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={openDigitalLocker}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-blue-400 hover:shadow-sm"
                  >
                    <span className="text-2xl">💻</span>

                    <div>
                      <p className="font-semibold text-slate-800">
                        Digital Locker
                      </p>
                      <p className="text-xs text-slate-500">
                        Select documents already stored in your locker
                      </p>
                    </div>
                  </button>

                </div>
              </div>
            )}

            {docType === 'BONAFIDE' && (
              <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  ID Card <span className="text-red-500">*</span>
                </label>

                <p className="mb-3 text-xs text-slate-500">
                  Upload your college ID card as PDF, JPG or JPEG.
                </p>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg"
                  required
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setIdCard(file);
                  }}
                  className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                />

                {idCard && (
                  <p className="mt-2 text-xs font-medium text-emerald-600">
                     {idCard.name}
                  </p>
                )}

              </div>
            )}

            <div>

              <label className="block cursor-pointer">

                <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-blue-400 hover:bg-blue-50">

                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                    
                  </div>

                  <p className="font-semibold text-slate-800">
                    Click to upload supporting documents
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    PDF, JPG, JPEG or PNG  Up to 9 additional files
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

                    if (selected.length > 9) {
                      setError('You can upload a maximum of 9 supporting files.');
                      setFiles(selected.slice(0, 9));
                    } else {
                      setError('');
                      setFiles(selected);
                    }
                  }}
                  className="hidden"
                />

              </label>

            </div>

            {lockerDocs.length > 0 && (
              <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-5">

                <p className="mb-3 text-sm font-bold text-slate-800">
                  Digital Locker files selected
                </p>

                {lockerDocs.map((doc) => (
                  <div
                    key={doc._id}
                    className="mb-2 flex items-center gap-3 rounded-xl bg-white px-4 py-3"
                  >
                    <span>📄</span>
                    <span className="text-sm font-medium text-slate-700">
                      {doc.title}
                    </span>
                  </div>
                ))}

              </div>
            )}

          </section>

          {/* DIGITAL LOCKER MODAL */}
          {lockerOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

              <div className="max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">

                <div className="flex items-center justify-between border-b border-slate-200 p-5">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Select from Digital Locker
                    </h3>
                    <p className="text-xs text-slate-500">
                      Choose documents to attach to this request.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setLockerOpen(false)}
                    className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100"
                  >
                    
                  </button>
                </div>

                <div className="max-h-[55vh] overflow-y-auto p-5">

                  {lockerLoading ? (
                    <p className="py-10 text-center text-sm text-slate-500">
                      Loading Digital Locker...
                    </p>
                  ) : lockerDocuments.length === 0 ? (
                    <div className="py-10 text-center">
                      <p className="text-3xl"></p>
                      <p className="mt-3 font-semibold text-slate-800">
                        No personal documents found
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Upload documents to your Digital Locker first.
                      </p>
                    </div>
                  ) : (
                    lockerDocuments.map((doc) => {
                      const selected = lockerDocs.some(
                        (item) => item._id === doc._id
                      );

                      return (
                        <button
                          key={doc._id}
                          type="button"
                          onClick={() => toggleLockerDocument(doc)}
                          className={[
                            'mb-3 flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition',
                            selected
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-slate-200 hover:border-blue-300'
                          ].join(' ')}
                        >
                          <span className="text-2xl">💻</span>

                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-slate-800">
                              {doc.title}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {doc.type || 'Other'}
                            </p>
                          </div>

                          {selected && (
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                              
                            </span>
                          )}
                        </button>
                      );
                    })
                  )}

                </div>

                <div className="flex justify-end gap-3 border-t border-slate-200 p-5">

                  <button
                    type="button"
                    onClick={() => setLockerOpen(false)}
                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Done
                  </button>

                </div>

              </div>

            </div>
          )}
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
                  {busy ? 'Submitting...' : 'Submit Request '}
                </button>

              </div>

            </div>

          </section>

        </form>

      </div>
    </div>
  );
}


