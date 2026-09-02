import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import StatusBadge from "../../components/StatusBadge";

export default function RequestList() {
  const [requests, setRequests] = useState([]);
  const [documentFilter, setDocumentFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const res = await api.get("/requests");
        setRequests(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Failed to load requests:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  const filtered = requests.filter((r) => {
    const type = String(r.documentType || "").toUpperCase();
    const id = String(r.requestId || "").toLowerCase();
    const searchValue = search.toLowerCase().trim();

    const matchesDocument =
      documentFilter === "ALL" || type === documentFilter;

    const matchesStatus =
      statusFilter === "ALL" ||
      String(r.status || "").toUpperCase() === statusFilter;

    const matchesSearch =
      !searchValue ||
      type.toLowerCase().includes(searchValue) ||
      id.includes(searchValue);

    return matchesDocument && matchesStatus && matchesSearch;
  });

  const documentName = (type) => {
    switch (String(type || "").toUpperCase()) {
      case "BONAFIDE":
        return "Bona Fide Certificate";
      case "TRANSCRIPT":
        return "Transcript";
      case "RECOMMENDATION":
        return "Recommendation Letter";
      default:
        return "Academic Document";
    }
  };

  const documentIcon = (type) => {
    switch (String(type || "").toUpperCase()) {
      case "BONAFIDE":
        return "📜";
      case "TRANSCRIPT":
        return "🎓";
      case "RECOMMENDATION":
        return "✉️";
      default:
        return "📄";
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              My Requests
            </h1>
            <p className="mt-2 text-slate-500">
              Track and manage your academic document requests.
            </p>
          </div>

          <Link
            to="/student/request"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <span className="text-lg">+</span>
            New Request
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search by request ID or document..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 pl-11 pr-4 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <select
              value={documentFilter}
              onChange={(e) => setDocumentFilter(e.target.value)}
              className="h-11 px-4 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Documents</option>
              <option value="BONAFIDE">Bona Fide Certificate</option>
              <option value="TRANSCRIPT">Transcript</option>
              <option value="RECOMMENDATION">Recommendation Letter</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 px-4 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="GENERATING">Generating</option>
              <option value="APPROVED">Approved</option>
              <option value="COMPLETED">Completed</option>
              <option value="REJECTED">Rejected</option>
            </select>

          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {filtered.length}
            </span>{" "}
            {filtered.length === 1 ? "request" : "requests"}
          </p>

          {(search || documentFilter !== "ALL" || statusFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearch("");
                setDocumentFilter("ALL");
                setStatusFilter("ALL");
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          <div className="hidden md:grid grid-cols-[1fr_150px_150px_40px] gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <div>Document</div>
            <div>Submitted</div>
            <div>Status</div>
            <div></div>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4" />
              <p className="text-sm text-slate-500">
                Loading your requests...
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 px-6 text-center">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl">
                📄
              </div>

              <h3 className="text-lg font-semibold text-slate-800">
                No requests found
              </h3>

              <p className="text-sm text-slate-500 mt-2 mb-6">
                Try changing your filters or create a new request.
              </p>

              <Link
                to="/student/request"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl transition"
              >
                + Create New Request
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <Link
                  key={r._id || r.requestId}
                  to={`/student/requests/${r.requestId}`}
                  className="group block px-4 sm:px-6 py-5 hover:bg-slate-50 transition"
                >
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_40px] gap-4 md:items-center">

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-xl">
                        {documentIcon(r.documentType)}
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-800 truncate">
                          {documentName(r.documentType)}
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                          Request ID:{" "}
                          <span className="font-medium text-slate-600">
                            {r.requestId}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 mb-1 md:hidden">
                        Submitted
                      </p>
                      <p className="text-sm font-medium text-slate-700">
                        {formatDate(r.createdAt)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 mb-1 md:hidden">
                        Status
                      </p>
                      <StatusBadge status={r.status} />
                    </div>

                    <div className="hidden md:flex justify-end">
                      <span className="w-9 h-9 rounded-full flex items-center justify-center text-xl text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition">
                        →
                      </span>
                    </div>

                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
