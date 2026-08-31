import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">
          EEC Student Document Portal
        </Link>

        {user && (
          <div className="flex items-center gap-5 text-sm">
            <Link to="/student/dashboard">Dashboard</Link>
            <Link to="/student/notifications">Notifications</Link>
            <Link to="/student/messages">Messages</Link>
            <Link to="/student/locker">Digital Locker</Link>
            <Link to="/student/requests/new">New Request</Link>

            <span>{user.name}</span>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/";
              }}
              className="text-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
