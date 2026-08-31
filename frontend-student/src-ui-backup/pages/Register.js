import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    registerNumber: '', department: '', year: '', semester: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register({ ...form, role: 'student' });
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10">
      <form onSubmit={submit} className="bg-white shadow-sm border border-slate-200 rounded-xl p-8 w-full max-w-md">
        <h1 className="text-xl font-bold mb-1">Create student account</h1>
        <p className="text-sm text-slate-500 mb-6">Register for the document portal</p>
        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">{error}</div>}

        <label className="block text-sm mb-1">Full name</label>
        <input required value={form.name} onChange={set('name')} className="w-full mb-3 border border-slate-300 rounded-md px-3 py-2 text-sm" />

        <label className="block text-sm mb-1">Email</label>
        <input type="email" required value={form.email} onChange={set('email')} className="w-full mb-3 border border-slate-300 rounded-md px-3 py-2 text-sm" />

        <label className="block text-sm mb-1">Password</label>
        <input type="password" required value={form.password} onChange={set('password')} className="w-full mb-3 border border-slate-300 rounded-md px-3 py-2 text-sm" />

        <label className="block text-sm mb-1">Register number</label>
        <input required value={form.registerNumber} onChange={set('registerNumber')} className="w-full mb-3 border border-slate-300 rounded-md px-3 py-2 text-sm" />

        <label className="block text-sm mb-1">Department</label>
        <input required value={form.department} onChange={set('department')} className="w-full mb-3 border border-slate-300 rounded-md px-3 py-2 text-sm" />

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm mb-1">Year</label>
            <input value={form.year} onChange={set('year')} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">Semester</label>
            <input value={form.semester} onChange={set('semester')} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
          </div>
        </div>

        <button disabled={busy} className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-md py-2 text-sm font-medium disabled:opacity-60 mt-2">
          {busy ? 'Creating...' : 'Create account'}
        </button>
        <p className="text-sm text-slate-500 mt-4">
          Have an account? <Link to="/login" className="text-brand-600">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
