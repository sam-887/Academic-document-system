import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading || !user) {
    return null;
  }

  const isActive = (path) =>
    location.pathname === path ||
    location.pathname.startsWith(path + '/');

  const linkClass = (path) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive(path)
        ? 'bg-blue-50 text-blue-700'
        : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
    }`;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">

          <Link
            to="/student/dashboard"
            className="font-bold text-xl text-slate-800 whitespace-nowrap"
          >
            EEC Student Document Portal
          </Link>

          <div className="flex items-center gap-1 flex-wrap justify-end">

            <Link
              to="/student/dashboard"
              className={linkClass('/student/dashboard')}
            >
              Dashboard
            </Link>

            <Link
              to="/student/request"
              className={linkClass('/student/request')}
            >
              New Request
            </Link>

            <Link
              to="/student/requests"
              className={linkClass('/student/requests')}
            >
              My Requests
            </Link>

            <Link
              to="/student/notifications"
              className={linkClass('/student/notifications')}
            >
              Notifications
            </Link>

            <Link
              to="/student/messages"
              className={linkClass('/student/messages')}
            >
              Messages
            </Link>

            <Link
              to="/student/locker"
              className={linkClass('/student/locker')}
            >
              Digital Locker
            </Link>

            <div className="ml-3 pl-3 border-l border-slate-200 flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700">
                {user.name || user.email}
              </span>

              <button
                onClick={logout}
                className="px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
              >
                Logout
              </button>
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
}
