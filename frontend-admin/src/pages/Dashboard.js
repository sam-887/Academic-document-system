import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import StatusBadge from "../components/StatusBadge";

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  const [documentFilter, setDocumentFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const load = async () => {
      try {
        const [requestsRes, summaryRes] = await Promise.all([api.get("/admin/requests"), api.get("/admin/summary")]);
        const data = Array.isArray(requestsRes.data)
          ? requestsRes.data
          : requestsRes.data.requests || [];

        setRequests(data);

        setSummary({
          total: summaryRes.data.total || 0,
          pending: summaryRes.data.pending || 0,
          approved: summaryRes.data.approved || 0,
          rejected: summaryRes.data.rejected || 0
        });
      } catch (err) {
        console.error("Failed to load requests:", err);
      }
    };

    load();
  }, []);

  const filteredRequests = requests.filter((request) => {
    const documentType = String(request.documentType || "").toUpperCase();
    const status = String(request.status || "").toUpperCase();

    const documentMatch =
      documentFilter === "ALL" ||
      documentType.includes(documentFilter);

    const statusMatch =
      statusFilter === "ALL" ||
      status === statusFilter;

    return documentMatch && statusMatch;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-3xl font-bold text-slate-800 mb-2">
        Admin Dashboard
      </h1>

      <p className="text-slate-500 mb-8">
        Manage and monitor student document requests.
      </p>

      {/* ORIGINAL SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

        <div className="bg-slate-100 rounded-2xl p-5">
          <p className="text-3xl font-bold text-slate-800">
            {summary.total}
          </p>
          <p className="text-sm text-slate-600 mt-1">
            Total
          </p>
        </div>

        <div className="bg-amber-100 rounded-2xl p-5">
          <p className="text-3xl font-bold text-amber-700">
            {summary.pending}
          </p>
          <p className="text-sm text-amber-700 mt-1">
            Pending
          </p>
        </div>

        <div className="bg-emerald-100 rounded-2xl p-5">
          <p className="text-3xl font-bold text-emerald-700">
            {summary.approved}
          </p>
          <p className="text-sm text-emerald-700 mt-1">
            Approved / Completed
          </p>
        </div>

        <div className="bg-red-100 rounded-2xl p-5">
          <p className="text-3xl font-bold text-red-700">
            {summary.rejected}
          </p>
          <p className="text-sm text-red-700 mt-1">
            Rejected
          </p>
        </div>

      </div>

      {/* REQUESTS + SMALL FILTERS */}
      <div className="bg-white border rounded-2xl p-6">

        <div className="flex items-center justify-between mb-5">

          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Document Requests
            </h2>
            <p className="text-sm text-slate-500">
              Filter student requests
            </p>
          </div>

          <div className="flex items-center gap-2">

            <select
              value={documentFilter}
              onChange={(e) => setDocumentFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white shadow-sm"
            >
              <option value="ALL">All Documents</option>
              <option value="TRANSCRIPT">Transcript</option>
              <option value="BONAFIDE">Bonafide</option>
              <option value="RECOMMENDATION">Recommendation Letter</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white shadow-sm"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="COMPLETED">Completed</option>
            </select>

          </div>

        </div>

        {filteredRequests.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-slate-500">
              No requests match the selected filters.
            </p>
          </div>
        ) : (
          <div className="space-y-3">

            {filteredRequests.map((request) => (

              <Link
                key={request._id || request.requestId}
                to={`/requests/${request.requestId}`}
                className="border rounded-xl p-4 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer"
              >

                <div>
                  <p className="font-semibold text-slate-800">
                    {request.documentType || "Document Request"}
                  </p>

                  <p className="text-sm text-slate-500">
                    Request ID: {request.requestId || request._id}
                  </p>

                  {request.student && (
                    <p className="text-sm text-slate-500">
                      Student:{" "}
                      {request.student.name ||
                        request.student.user?.name ||
                        "Student"}
                    </p>
                  )}
                </div>

                <StatusBadge status={request.status} />

              </Link>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}



