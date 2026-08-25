import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <form onSubmit={submit} className="bg-white shadow-sm border border-slate-200 rounded-xl p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold mb-1">Admin / Faculty sign in</h1>
        <p className="text-sm text-slate-500 mb-6">
          Accounts are created via the backend's <code>/api/auth/register</code> with role admin or faculty.
        </p>
        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">{error}</div>}
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email" required value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full mb-4 border border-slate-300 rounded-md px-3 py-2 text-sm"
        />
        <label className="block text-sm mb-1">Password</label>
        <input
          type="password" required value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full mb-6 border border-slate-300 rounded-md px-3 py-2 text-sm"
        />
        <button disabled={busy} className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-md py-2 text-sm font-medium disabled:opacity-60">
          {busy ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
