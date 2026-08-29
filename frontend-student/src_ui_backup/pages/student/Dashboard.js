import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import StatusBadge from "../../components/StatusBadge";

export default function Dashboard() {
  const [summary, setSummary] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  const [recent, setRecent] = useState([]);

  useEffect(() => {
    api.get("/requests/dashboard")
      .then((res) => {
        setSummary(res.data || {});
        setRecent(res.data?.recent || []);
      })
      .catch((err) => {
        console.error("Failed to load dashboard:", err);
      });
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold text-slate-800 mb-2">
        Student Dashboard
      </h1>

      <p className="text-slate-500 mb-8">
        Welcome back. Track your academic document requests here.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

        <div className="bg-slate-100 rounded-2xl p-5">
          <p className="text-3xl font-bold text-slate-800">
            {summary.total || 0}
          </p>
          <p className="text-sm text-slate-600 mt-1">
            Total
          </p>
        </div>

        <div className="bg-amber-100 rounded-2xl p-5">
          <p className="text-3xl font-bold text-amber-700">
            {summary.pending || 0}
          </p>
          <p className="text-sm text-amber-700 mt-1">
            Pending
          </p>
        </div>

        <div className="bg-emerald-100 rounded-2xl p-5">
          <p className="text-3xl font-bold text-emerald-700">
            {summary.approved || 0}
          </p>
          <p className="text-sm text-emerald-700 mt-1">
            Approved / Completed
          </p>
        </div>

        <div className="bg-red-100 rounded-2xl p-5">
          <p className="text-3xl font-bold text-red-700">
            {summary.rejected || 0}
          </p>
          <p className="text-sm text-red-700 mt-1">
            Rejected
          </p>
        </div>

      </div>

      <div className="bg-white border rounded-2xl p-6">

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-slate-800">
            Recent Requests
          </h2>

          <a
            href="/student/requests"
            className="text-sm text-blue-600 hover:underline"
          >
            View All
          </a>
        </div>

        {recent.length === 0 ? (
          <p className="text-slate-500">
            No recent requests.
          </p>
        ) : (
          <div className="space-y-3">
            {recent.map((request) => (
              <div
                key={request._id || request.requestId}
                className="flex items-center justify-between border-b last:border-b-0 pb-3 last:pb-0"
              >
                <div>
                  <p className="font-medium text-slate-800">
                    {request.documentType || "Document Request"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {request.requestId || request._id}
                  </p>
                </div>

                <StatusBadge status={request.status} />
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
