import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Icon({ name, size = 18 }) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true
  };

  const icons = {
    grid: <>
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </>,

    bell: <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/>
      <path d="M10 21h4"/>
    </>,

    message: <>
      <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.6 8.6 0 0 1-3.3-.65L4 20l1.2-3.8A7.1 7.1 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z"/>
      <path d="M8 11.5h.01M12 11.5h.01M16 11.5h.01"/>
    </>,

    chart: <>
      <path d="M4 19V5"/>
      <path d="M4 19h16"/>
      <path d="m7 15 3-4 3 2 5-6"/>
    </>,

    moon: <path d="M20.5 15.2A8.5 8.5 0 0 1 8.8 3.5 8.5 8.5 0 1 0 20.5 15.2Z"/>,

    sun: <>
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </>,

    logout: <>
      <path d="M10 17l5-5-5-5"/>
      <path d="M15 12H3"/>
      <path d="M21 19V5a2 2 0 0 0-2-2h-5"/>
    </>,

    chevron: <path d="m7 10 5 5 5-5"/>,

    settings: <>
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.8 1.8 0 0 0 .36 2l.05.05-1.41 1.41-.05-.05a1.8 1.8 0 0 0-2-.36 1.8 1.8 0 0 0-1.1 1.65V20h-2v-.3a1.8 1.8 0 0 0-1.1-1.65 1.8 1.8 0 0 0-2 .36l-.05.05-1.41-1.41.05-.05a1.8 1.8 0 0 0 .36-2A1.8 1.8 0 0 0 7.9 14H7.6v-2h.3a1.8 1.8 0 0 0 1.65-1.1 1.8 1.8 0 0 0-.36-2l-.05-.05 1.41-1.41.05.05a1.8 1.8 0 0 0 2 .36A1.8 1.8 0 0 0 13.7 6.2V6h2v.3a1.8 1.8 0 0 0 1.1 1.65 1.8 1.8 0 0 0 2-.36l.05-.05 1.41 1.41-.05.05a1.8 1.8 0 0 0-.36 2A1.8 1.8 0 0 0 17.1 12h.3v2h-.3a1.8 1.8 0 0 0-1.7 1Z"/>
    </>
  };

  return <svg {...p}>{icons[name]}</svg>;
}

export default function Navbar() {
  const location = useLocation();

  const [open, setOpen] = useState(false);

  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("eec-admin-theme");
    return saved !== "light";
  });

  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    document.body.classList.add("eec-admin-app");
    document.documentElement.classList.add("eec-admin-app");

    document.body.classList.toggle("eec-dark-mode", dark);
    document.documentElement.classList.toggle("eec-dark-mode", dark);

    localStorage.setItem("eec-admin-theme", dark ? "dark" : "light");

    return () => {
      document.body.classList.remove("eec-admin-app");
      document.documentElement.classList.remove("eec-admin-app");
    };
  }, [dark]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user") || "{}");

      setUserName(
        stored.name ||
        stored.username ||
        stored.fullName ||
        stored.email?.split("@")[0] ||
        "Admin"
      );
    } catch {
      setUserName("Admin");
    }
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const links = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "grid"
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: "bell"
    },
    {
      name: "Messages",
      path: "/messages",
      icon: "message"
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: "chart"
    }
  ];

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("eec-admin-theme");
    window.location.href = "/login";
  };

  const initial = userName.charAt(0).toUpperCase();

  return (
    <nav className="admin-pro-navbar">
      <div className="admin-pro-inner">

        <Link to="/dashboard" className="admin-pro-brand">
          <span className="admin-pro-logo">
            <Icon name="grid" size={18}/>
          </span>

          <span className="admin-pro-brand-copy">
            <strong>EEC Admin Portal</strong>
            <small>Academic Document Management</small>
          </span>
        </Link>

        <div className="admin-pro-nav-links">
          {links.map(link => {
            const active =
              location.pathname === link.path ||
              location.pathname.startsWith(link.path + "/");

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`admin-pro-nav-link ${active ? "active" : ""}`}
              >
                <Icon name={link.icon} size={17}/>
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="admin-pro-profile-wrap">

          <button
            className={`admin-pro-profile ${open ? "open" : ""}`}
            onClick={() => setOpen(v => !v)}
            aria-expanded={open}
          >
            <span className="admin-pro-avatar">
              {initial}
            </span>

            <span className="admin-pro-profile-copy">
              <strong>{userName}</strong>
              <small>Administrator</small>
            </span>

            <Icon name="chevron" size={16}/>
          </button>

          {open && (
            <div className="admin-pro-dropdown">

              <div className="admin-pro-dropdown-head">
                <span className="admin-pro-avatar large">
                  {initial}
                </span>

                <div>
                  <strong>{userName}</strong>
                  <small>Administrator</small>
                </div>
              </div>

              <div className="admin-pro-settings-title">
                SETTINGS
              </div>

              <button
                className="admin-pro-setting-row"
                onClick={() => setDark(v => !v)}
              >
                <span className="admin-pro-setting-icon">
                  <Icon name={dark ? "moon" : "sun"} size={17}/>
                </span>

                <span className="admin-pro-setting-copy">
                  <strong>
                    {dark ? "Dark mode" : "Light mode"}
                  </strong>

                  <small>
                    {dark ? "Enabled" : "Enabled"}
                  </small>
                </span>

                <span className={`admin-pro-switch ${dark ? "on" : ""}`}>
                  <span/>
                </span>
              </button>

              <div className="admin-pro-divider"/>

              <button
                className="admin-pro-logout"
                onClick={logout}
              >
                <Icon name="logout" size={17}/>
                <span>Logout</span>
              </button>

            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
