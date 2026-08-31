import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/requests")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.requests || res.data.data || [];
        setRequests(data);
      })
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  const total = requests.length;
  const pending = requests.filter(r =>
    ["PENDING", "SUBMITTED"].includes(String(r.status).toUpperCase())
  ).length;

  const review = requests.filter(r =>
    ["UNDER_REVIEW", "IN_REVIEW", "REVIEW"].includes(String(r.status).toUpperCase())
  ).length;

  const approved = requests.filter(r =>
    ["APPROVED", "COMPLETED"].includes(String(r.status).toUpperCase())
  ).length;

  const rejected = requests.filter(r =>
    String(r.status).toUpperCase() === "REJECTED"
  ).length;

  const approvalRate = total
    ? Math.round((approved / total) * 100)
    : 0;

  const stats = [
    {
      label: "Total Requests",
      value: total,
      icon: "◫",
      tone: "blue",
      trend: "All submitted requests"
    },
    {
      label: "Pending",
      value: pending,
      icon: "◷",
      tone: "amber",
      trend: "Awaiting review"
    },
    {
      label: "Under Review",
      value: review,
      icon: "⌕",
      tone: "violet",
      trend: "Currently processing"
    },
    {
      label: "Approved",
      value: approved,
      icon: "✓",
      tone: "green",
      trend: "Approved / completed"
    },
    {
      label: "Rejected",
      value: rejected,
      icon: "×",
      tone: "red",
      trend: "Needs attention"
    }
  ];

  const statusClass = (status) => {
    const s = String(status || "").toUpperCase();

    if (["APPROVED", "COMPLETED"].includes(s))
      return "status approved";

    if (s === "REJECTED")
      return "status rejected";

    if (["UNDER_REVIEW", "IN_REVIEW", "REVIEW"].includes(s))
      return "status review";

    return "status pending";
  };

  return (
    <div className="modern-admin-dashboard">

      <div className="dashboard-orb orb-one" />
      <div className="dashboard-orb orb-two" />

      <section className="dashboard-hero">

        <div>
          <div className="hero-eyebrow">
            <span className="live-dot" />
            ADMIN CONTROL CENTER
          </div>

          <h1>
            Academic Document
            <span> Intelligence</span>
          </h1>

          <p>
            Monitor requests, approvals and document workflows
            from one centralized workspace.
          </p>
        </div>

        <div className="hero-actions">
          <Link to="/notifications" className="hero-action">
            <span>♧</span>
            Notifications
          </Link>

          <Link to="/analytics" className="hero-action primary">
            <span>↗</span>
            View Analytics
          </Link>
        </div>

      </section>

      <section className="stats-grid">

        {stats.map((stat) => (
          <div className={`stat-card ${stat.tone}`} key={stat.label}>

            <div className="stat-top">
              <div className="stat-icon">
                {stat.icon}
              </div>

              <span className="stat-arrow">↗</span>
            </div>

            <div className="stat-value">
              {loading ? "—" : stat.value}
            </div>

            <div className="stat-label">
              {stat.label}
            </div>

            <div className="stat-description">
              {stat.trend}
            </div>

          </div>
        ))}

        <div className="stat-card cyan">

          <div className="stat-top">
            <div className="stat-icon">%</div>
            <span className="stat-arrow">↗</span>
          </div>

          <div className="stat-value">
            {loading ? "—" : `${approvalRate}%`}
          </div>

          <div className="stat-label">
            Approval Rate
          </div>

          <div className="stat-description">
            Successful request completion
          </div>

        </div>

      </section>

      <section className="dashboard-main-grid">

        <div className="dashboard-panel requests-panel">

          <div className="panel-heading">

            <div>
              <div className="panel-kicker">
                WORKFLOW
              </div>

              <h2>
                Recent Requests
              </h2>

              <p>
                Latest document activity across the system
              </p>
            </div>

            <Link
              to="/requests"
              className="panel-link"
            >
              View all →
            </Link>

          </div>

          <div className="request-list">

            {loading && (
              <div className="empty-dashboard">
                Loading requests...
              </div>
            )}

            {!loading && requests.length === 0 && (
              <div className="empty-dashboard">
                <div className="empty-icon">◫</div>
                <strong>No requests yet</strong>
                <span>New document requests will appear here.</span>
              </div>
            )}

            {!loading &&
              requests.slice(0, 6).map((request, index) => (

                <Link
                  key={request._id || request.requestId || index}
                  to={`/requests/${request.requestId}`}
                  className="modern-request"
                >

                  <div className="request-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="request-icon">
                    ◫
                  </div>

                  <div className="request-information">

                    <strong>
                      {request.documentType ||
                       request.documentName ||
                       "Document Request"}
                    </strong>

                    <span>
                      {request.requestId || request._id}
                    </span>

                    <small>
                      {request.student?.name ||
                       request.student?.email ||
                       "Student request"}
                    </small>

                  </div>

                  <div className={statusClass(request.status)}>
                    {String(request.status || "PENDING")
                      .replaceAll("_", " ")}
                  </div>

                  <div className="request-chevron">
                    →
                  </div>

                </Link>

              ))}

          </div>

        </div>

        <div className="side-dashboard">

          <div className="dashboard-panel insight-panel">

            <div className="ai-badge">
              ✦ AI INSIGHT
            </div>

            <div className="ai-icon">
              ✦
            </div>

            <h2>
              Smart Document
              <br />
              Intelligence
            </h2>

            <p>
              Use AI validation to identify incomplete,
              invalid or inconsistent documents before approval.
            </p>

            <Link
              to="/ai-validation"
              className="ai-button"
            >
              Open AI Validation
              <span>→</span>
            </Link>

          </div>

          <div className="dashboard-panel status-panel">

            <div className="panel-heading compact">

              <div>
                <div className="panel-kicker">
                  SYSTEM
                </div>

                <h2>
                  Request Status
                </h2>
              </div>

              <span className="system-online">
                ● Live
              </span>

            </div>

            <div className="status-bars">

              <div className="status-row">
                <div>
                  <span>Pending</span>
                  <b>{pending}</b>
                </div>

                <div className="bar">
                  <i
                    style={{
                      width: `${total ? (pending / total) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>

              <div className="status-row">
                <div>
                  <span>Under Review</span>
                  <b>{review}</b>
                </div>

                <div className="bar">
                  <i
                    style={{
                      width: `${total ? (review / total) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>

              <div className="status-row">
                <div>
                  <span>Approved</span>
                  <b>{approved}</b>
                </div>

                <div className="bar">
                  <i
                    style={{
                      width: `${total ? (approved / total) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>

              <div className="status-row">
                <div>
                  <span>Rejected</span>
                  <b>{rejected}</b>
                </div>

                <div className="bar">
                  <i
                    style={{
                      width: `${total ? (rejected / total) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>

      <section className="quick-actions">

        <Link to="/requests">
          <span>◫</span>
          <div>
            <strong>Manage Requests</strong>
            <small>Review and process documents</small>
          </div>
          <b>→</b>
        </Link>

        <Link to="/notifications">
          <span>♧</span>
          <div>
            <strong>Notifications</strong>
            <small>System alerts and updates</small>
          </div>
          <b>→</b>
        </Link>

        <Link to="/messages">
          <span>◌</span>
          <div>
            <strong>Messages</strong>
            <small>Communicate with faculty</small>
          </div>
          <b>→</b>
        </Link>

        <Link to="/analytics">
          <span>◈</span>
          <div>
            <strong>Analytics</strong>
            <small>Performance and insights</small>
          </div>
          <b>→</b>
        </Link>

      </section>

    </div>
  );
}
