import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Icon({ type, size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  if (type === "grid") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    );
  }

  if (type === "bell") {
    return (
      <svg {...common}>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </svg>
    );
  }

  if (type === "message") {
    return (
      <svg {...common}>
        <path d="M20 15a3 3 0 0 1-3 3H9l-5 3v-6a3 3 0 0 1-1-2V7a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3z" />
      </svg>
    );
  }

  if (type === "chart") {
    return (
      <svg {...common}>
        <path d="M4 19V5" />
        <path d="M4 19h17" />
        <path d="M7 15l4-5 3 3 5-7" />
      </svg>
    );
  }

  if (type === "user") {
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c.8-3.4 3.1-5 7-5s6.2 1.6 7 5" />
      </svg>
    );
  }

  if (type === "moon") {
    return (
      <svg {...common}>
        <path d="M20 15.5A8 8 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5z" />
      </svg>
    );
  }

  if (type === "sun") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    );
  }

  if (type === "logout") {
    return (
      <svg {...common}>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M21 19V5a2 2 0 0 0-2-2h-5" />
      </svg>
    );
  }

  if (type === "chevron") {
    return (
      <svg {...common}>
        <path d="m6 9 6 6 6-6" />
      </svg>
    );
  }

  return null;
}

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(
    document.body.classList.contains("eec-dark-mode")
  );

  const menuRef = useRef(null);

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: "grid" },
    { name: "Notifications", path: "/notifications", icon: "bell" },
    { name: "Messages", path: "/messages", icon: "message" },
    { name: "Analytics", path: "/analytics", icon: "chart" },
  ];

  useEffect(() => {
    const saved = localStorage.getItem("admin-dark-mode");

    if (saved === "true") {
      document.body.classList.add("eec-dark-mode");
      setDark(true);
    }

    if (saved === "false") {
      document.body.classList.remove("eec-dark-mode");
      setDark(false);
    }
  }, []);

  useEffect(() => {
    function close(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", close);

    return () => {
      document.removeEventListener("mousedown", close);
    };
  }, []);

  function toggleDarkMode() {
    const next = !dark;

    document.body.classList.toggle("eec-dark-mode", next);
    localStorage.setItem("admin-dark-mode", String(next));
    setDark(next);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  const initials = "A";

  return (
    <nav className="admin-super-navbar">
      <div className="admin-super-navbar-inner">

        {/* BRAND */}
        <Link to="/dashboard" className="admin-super-brand">
          <div className="admin-brand-mark">
            <Icon type="grid" size={19} />
          </div>

          <div className="admin-brand-copy">
            <strong>EEC</strong>
            <span>Academic Document Management</span>
          </div>
        </Link>

        {/* NAVIGATION */}
        <div className="admin-super-nav-links">
          {links.map((link) => {
            const active =
              location.pathname === link.path ||
              (link.path === "/dashboard" &&
                location.pathname === "/");

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`admin-super-nav-link ${
                  active ? "active" : ""
                }`}
              >
                <span className="admin-nav-icon">
                  <Icon type={link.icon} size={17} />
                </span>

                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* PROFILE */}
        <div className="admin-super-profile-wrap" ref={menuRef}>
          <button
            type="button"
            className={`admin-super-profile ${
              open ? "open" : ""
            }`}
            onClick={() => setOpen(!open)}
          >
            <span className="admin-avatar">{initials}</span>

            <span className="admin-profile-text">
              <strong>Admin</strong>
              <small>Administrator</small>
            </span>

            <span className={`admin-profile-chevron ${
              open ? "rotate" : ""
            }`}>
              <Icon type="chevron" size={15} />
            </span>
          </button>

          {open && (
            <div className="admin-super-profile-menu">

              <div className="admin-profile-header">
                <div className="admin-profile-large-avatar">
                  A
                </div>

                <div>
                  <strong>Administrator</strong>
                  <small>Admin account</small>
                </div>
              </div>

              <div className="admin-profile-divider" />

              <div className="admin-settings-label">
                APPEARANCE
              </div>

              <button
                type="button"
                className="admin-setting-row"
                onClick={toggleDarkMode}
              >
                <span className="admin-setting-icon">
                  <Icon
                    type={dark ? "sun" : "moon"}
                    size={17}
                  />
                </span>

                <span className="admin-setting-copy">
                  <strong>{dark ? "Light mode" : "Dark mode"}</strong>
                  <small>
                    {dark
                      ? "Switch to light appearance"
                      : "Switch to dark appearance"}
                  </small>
                </span>

                <span
                  className={`admin-mode-switch ${
                    dark ? "on" : ""
                  }`}
                >
                  <span />
                </span>
              </button>

              <div className="admin-profile-divider" />

              <button
                type="button"
                className="admin-logout-row"
                onClick={logout}
              >
                <span className="admin-setting-icon logout-icon">
                  <Icon type="logout" size={17} />
                </span>

                <span className="admin-setting-copy">
                  <strong>Logout</strong>
                  <small>Sign out of admin portal</small>
                </span>
              </button>

            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
