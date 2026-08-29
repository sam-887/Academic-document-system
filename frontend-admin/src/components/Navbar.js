import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Notifications", path: "/notifications" },
    { name: "Messages", path: "/messages" },
    { name: "Analytics", path: "/analytics" }
  ];

  return (
    <nav className="bg-white border-b px-8 py-4 flex items-center justify-between">
      <div className="text-xl font-bold text-red-800">
        EEC Admin Portal
      </div>

      <div className="flex items-center gap-6">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={
              location.pathname === link.path
                ? "text-blue-700 font-semibold"
                : "text-slate-700 hover:text-blue-700"
            }
          >
            {link.name}
          </Link>
        ))}

        <span className="text-slate-500">
          Admin (admin)
        </span>

        <button
          className="bg-slate-900 text-white px-4 py-2 rounded-lg"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

