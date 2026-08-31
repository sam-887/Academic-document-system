import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Icons = {
  dashboard: <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,

  request: <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>,

  requests: <svg viewBox="0 0 24 24"><path d="M7 3h10v18H7z"/><path d="M9 7h6M9 11h6M9 15h4"/></svg>,

  notifications: <svg viewBox="0 0 24 24"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg>,

  messages: <svg viewBox="0 0 24 24"><path d="M4 5h16v11H8l-4 4z"/></svg>,

  locker: <svg viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M8 8V6a4 4 0 0 1 8 0v2M12 12v4"/></svg>,

  moon: <svg viewBox="0 0 24 24"><path d="M21 15.5A9 9 0 0 1 8.5 3 9 9 0 1 0 21 15.5z"/></svg>,

  sun: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>,

  logout: <svg viewBox="0 0 24 24"><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M21 3v18"/></svg>,

  chevron: <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
};

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("eec-student-dark-mode") === "true"
  );

  useEffect(() => {
    document.body.classList.toggle("eec-dark-mode", darkMode);
    localStorage.setItem("eec-student-dark-mode", darkMode);
  }, [darkMode]);

  if (loading || !user) return null;

  const links = [
    { name: "Dashboard", path: "/student/dashboard", icon: Icons.dashboard },
    { name: "New Request", path: "/student/request", icon: Icons.request },
    { name: "My Requests", path: "/student/requests", icon: Icons.requests },
    { name: "Notifications", path: "/student/notifications", icon: Icons.notifications },
    { name: "Messages", path: "/student/messages", icon: Icons.messages },
    { name: "Digital Locker", path: "/student/locker", icon: Icons.locker }
  ];

  const active = (path) =>
    location.pathname === path ||
    location.pathname.startsWith(path + "/");

  const name =
    user.name ||
    user.username ||
    user.email?.split("@")[0] ||
    "Student";

  const initial = name.charAt(0).toUpperCase();

  return (
    <nav className="student-pro-navbar">
      <div className="student-pro-nav-inner">

        <Link
          to="/student/dashboard"
          className="student-pro-brand"
        >
          <span className="student-pro-brand-mark">EEC</span>
          <span>EEC Student Document Portal</span>
        </Link>

        <div className="student-pro-links">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`student-pro-link ${active(link.path) ? "active" : ""}`}
            >
              <span className="student-pro-link-icon">
                {link.icon}
              </span>
              <span>{link.name}</span>
            </Link>
          ))}
        </div>

        <div className="student-pro-account">

          <button
            className={`student-pro-profile ${open ? "open" : ""}`}
            onClick={() => setOpen(!open)}
          >
            <span className="student-pro-avatar">{initial}</span>

            <span className="student-pro-profile-info">
              <strong>{name}</strong>
              <small>Student</small>
            </span>

            <span className={`student-pro-chevron ${open ? "rotate" : ""}`}>
              {Icons.chevron}
            </span>
          </button>

          {open && (
            <div className="student-pro-settings">

              <div className="student-pro-settings-head">
                <span className="student-pro-avatar large">
                  {initial}
                </span>

                <div>
                  <strong>{name}</strong>
                  <small>Student Account</small>
                </div>
              </div>

              <div className="student-pro-divider" />

              <div className="student-pro-settings-title">
                SETTINGS
              </div>

              <div className="student-pro-setting-row">
                <div className="student-pro-setting-label">
                  <span className="setting-icon">
                    {darkMode ? Icons.moon : Icons.sun}
                  </span>

                  <div>
                    <strong>Dark mode</strong>
                    <small>{darkMode ? "Enabled" : "Disabled"}</small>
                  </div>
                </div>

                <button
                  className={`student-pro-switch ${darkMode ? "on" : ""}`}
                  onClick={() => setDarkMode(!darkMode)}
                  aria-label="Toggle dark mode"
                >
                  <span />
                </button>
              </div>

              <button
                className="student-pro-logout"
                onClick={logout}
              >
                <span>{Icons.logout}</span>
                <span>Logout</span>
              </button>

            </div>
          )}

        </div>
      </div>
    </nav>
  );
}
