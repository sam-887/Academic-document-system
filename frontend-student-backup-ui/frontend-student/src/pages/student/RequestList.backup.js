import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import StatusBadge from "../../components/StatusBadge";

export default function RequestList() {
  const [requests, setRequests] = useState([]);
  const [documentFilter, setDocumentFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/requests")
      .then((res) => setRequests(res.data))
      .catch(console.error);
  }, []);

  const filtered = requests.filter((r) => {
    const type = String(r.documentType || "").toLowerCase();
    const id = String(r.requestId || "").toLowerCase();
    const matchesDocument =
      documentFilter === "ALL" ||
      type === documentFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "ALL" || r.status === statusFilter;

    const matchesSearch =
      !search ||
      type.includes(search.toLowerCase()) ||
      id.includes(search.toLowerCase());

    return matchesDocument && matchesStatus && matchesSearch;
  });

  return (
    <div className="ui-page">
      <div className="ui-page-header">
        <div>
          <h1 className="ui-title">My Requests</h1>
          <p className="ui-subtitle">
            Track and manage your academic document requests.
          </p>
        </div>

        <Link to="/student/request" className="ui-primary-btn">
          + New Request
        </Link>
      </div>

      <div className="ui-filter-bar">
        <input
          className="ui-search"
          placeholder="Search requests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="ui-filter"
          value={documentFilter}
          onChange={(e) => setDocumentFilter(e.target.value)}
        >
          <option value="ALL">All Documents</option>
          <option value="Transcript">Transcript</option>
          <option value="Bonafide">Bonafide</option>
          <option value="Recommendation Letter">Recommendation Letter</option>
        </select>

        <select
          className="ui-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      <div className="ui-list-card">
        {filtered.length === 0 ? (
          <div className="ui-empty">
            <div className="ui-empty-icon">📄</div>
            <h3>No requests found</h3>
            <p>Try changing your filters or create a new request.</p>
            <Link to="/student/request" className="ui-primary-btn">
              Create New Request
            </Link>
          </div>
        ) : (
          filtered.map((r) => (
            <Link
              key={r._id}
              to={`/student/requests/${r.requestId}`}
              className="ui-request-row"
            >
              <div className="ui-doc-icon">📄</div>

              <div className="ui-request-main">
                <div className="ui-request-name">
                  {r.documentType || "Academic Document"}
                </div>
                <div className="ui-request-id">
                  {r.requestId}
                </div>
              </div>

              <div className="ui-request-date">
                {r.createdAt
                  ? new Date(r.createdAt).toLocaleDateString()
                  : "—"}
              </div>

              <StatusBadge status={r.status} />

              <span className="ui-arrow">›</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
