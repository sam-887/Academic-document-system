import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
      <Link to="/" className="font-bold text-brand-700 text-lg">
        EEC Admin Portal
      </Link>

      <div className="flex items-center gap-4 text-sm">
        {user && (
          <>
            <Link to="/dashboard" className="hover:text-brand-600">
              Dashboard
            </Link>

            <Link to="/notifications" className="hover:text-brand-600">
              Notifications
            </Link>

            <Link to="/messages" className="hover:text-brand-600">
              Messages
            </Link>

            <Link to="/ai-validation" className="hover:text-brand-600">
              AI Validation
            </Link>
          </>
        )}

        {user ? (
          <>
            <span className="text-slate-500">
              {user.name} ({user.role})
            </span>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-700"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="px-3 py-1.5 rounded-md bg-brand-600 text-white hover:bg-brand-700"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}


