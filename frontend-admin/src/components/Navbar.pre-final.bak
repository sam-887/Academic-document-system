import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Bell,
  MessageSquare,
  BarChart3,
  User,
  Settings,
  Moon,
  Sun,
  LogOut,
  ChevronDown
} from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const auth = useAuth();

  const user = auth?.user;
  const logout = auth?.logout;

  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("eec-admin-dark-mode") === "true"
  );

  useEffect(() => {
    document.body.classList.toggle("eec-dark-mode", darkMode);
    localStorage.setItem("eec-admin-dark-mode", String(darkMode));
  }, [darkMode]);

  const links = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: Bell
    },
    {
      name: "Messages",
      path: "/messages",
      icon: MessageSquare
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: BarChart3
    }
  ];

  const active = (path) =>
    location.pathname === path ||
    location.pathname.startsWith(path + "/");

  const accountName =
    user?.name ||
    user?.username ||
    user?.email?.split("@")[0] ||
    "Admin";

  const initial = accountName.charAt(0).toUpperCase();

  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  return (
    <nav className="eec-final-admin-navbar">
      <div className="eec-final-admin-nav-inner">

        <Link
          to="/dashboard"
          className="eec-final-admin-brand"
        >
          <span className="eec-final-admin-logo">
            EEC
          </span>

          <span className="eec-final-admin-brand-copy">
            <strong>EEC Admin Portal</strong>
            <small>Academic Document Management</small>
          </span>
        </Link>

        <div className="eec-final-admin-links">
          {links.map(({ name, path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`eec-final-admin-link ${
                active(path) ? "active" : ""
              }`}
            >
              <Icon size={17} strokeWidth={2} />
              <span>{name}</span>
            </Link>
          ))}
        </div>

        <div className="eec-final-admin-account">

          <button
            type="button"
            className={`eec-final-admin-profile ${
              profileOpen ? "open" : ""
            }`}
            onClick={() => setProfileOpen((v) => !v)}
          >
            <span className="eec-final-admin-avatar">
              {initial}
            </span>

            <span className="eec-final-admin-profile-text">
              <strong>{accountName}</strong>
              <small>Administrator</small>
            </span>

            <ChevronDown
              size={16}
              className={
                profileOpen
                  ? "eec-final-admin-chevron rotated"
                  : "eec-final-admin-chevron"
              }
            />
          </button>

          {profileOpen && (
            <div className="eec-final-admin-menu">

              <div className="eec-final-admin-menu-user">
                <span className="eec-final-admin-avatar large">
                  {initial}
                </span>

                <div>
                  <strong>{accountName}</strong>
                  <small>Administrator</small>
                </div>
              </div>

              <div className="eec-final-admin-menu-divider" />

              <div className="eec-final-admin-menu-heading">
                <Settings size={13} />
                SETTINGS
              </div>

              <div className="eec-final-admin-setting">

                <div className="eec-final-admin-setting-left">
                  <span className="eec-final-admin-setting-icon">
                    {darkMode ? (
                      <Moon size={16} />
                    ) : (
                      <Sun size={16} />
                    )}
                  </span>

                  <div>
                    <strong>Dark mode</strong>
                    <small>
                      {darkMode ? "Enabled" : "Disabled"}
                    </small>
                  </div>
                </div>

                <button
                  type="button"
                  className={`eec-final-admin-switch ${
                    darkMode ? "on" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDarkMode((v) => !v);
                  }}
                >
                  <span />
                </button>

              </div>

              <button
                type="button"
                className="eec-final-admin-logout"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Logout
              </button>

            </div>
          )}

        </div>

      </div>
    </nav>
  );
}
