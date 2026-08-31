import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import StatusBadge from "../../components/StatusBadge";

export default function RequestList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [documentFilter, setDocumentFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const res = await api.get("/requests/my");
        setRequests(Array.isArray(res.data) ? res.data : res.data.requests || []);
      } catch (err) {
        console.error("Failed to load requests:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-slate-500">Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            My Requests
          </h1>
          <p className="text-slate-500 mt-1">
            Track your academic document requests
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
        <div className="bg-white border rounded-2xl p-8 text-center">
          <p className="text-slate-500">
            No requests match the selected filters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div
              key={request._id || request.requestId}
              className="bg-white border rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">

                <div>
                  <h2 className="font-semibold text-lg text-slate-800">
                    {request.documentType || "Document Request"}
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Request ID: {request.requestId || request._id}
                  </p>
                </div>

                <StatusBadge status={request.status} />

              </div>

              {request.createdAt && (
                <p className="text-xs text-slate-400 mt-4">
                  Submitted:{" "}
                  {new Date(request.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
