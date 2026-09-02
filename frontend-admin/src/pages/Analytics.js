import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock3,
  Search,
  Activity,
  TrendingUp,
  RefreshCw
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import api from "../api/axios";


export default function Analytics() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    underReview: 0,
    pending: 0,
    generating: 0,
    byType: [],
    approvedByType: [],
    rejectedReasons: [],
    timeline: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(
        `/analytics/dashboard?days=${days}`
      );

      setData({
        total: res.data?.total || 0,
        approved: res.data?.approved || 0,
        rejected: res.data?.rejected || 0,
        underReview: res.data?.underReview || 0,
        pending: res.data?.pending || 0,
        generating: res.data?.generating || 0,
        byType: res.data?.byType || [],
        approvedByType: res.data?.approvedByType || [],
        rejectedReasons: res.data?.rejectedReasons || [],
        timeline: res.data?.timeline || []
      });
    } catch (err) {
      console.error("Analytics error:", err);
      setError(
        err.response?.data?.message ||
        "Failed to load analytics."
      );
    } finally {
      setLoading(false);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadAnalytics();
  }, [days]);

  const approvalRate =
    data.total > 0
      ? Math.round((data.approved / data.total) * 100)
      : 0;

  const rejectionRate =
    data.total > 0
      ? Math.round((data.rejected / data.total) * 100)
      : 0;

  const cards = [
    {
      title: "Total Requests",
      value: data.total,
      icon: FileText,
      className: "analytics-orange"
    },
    {
      title: "Approved",
      value: data.approved,
      icon: CheckCircle2,
      className: "analytics-green"
    },
    {
      title: "Rejected",
      value: data.rejected,
      icon: XCircle,
      className: "analytics-red"
    },
    {
      title: "Pending",
      value: data.pending,
      icon: Clock3,
      className: "analytics-blue"
    }
  ];

  const chartData = data.timeline.map((item) => ({
    date: item._id,
    requests: item.total
  }));

  const typeData = data.byType.map((item) => ({
    name: item._id || "Unknown",
    count: item.count || 0
  }));

  return (
    <main className="premium-analytics">

      {/* HEADER */}
      <motion.header
        className="analytics-header"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <div className="analytics-label">
            ADMINISTRATION / ANALYTICS
          </div>

          <h1>Analytics Overview</h1>

          <p>
            Monitor document requests, approvals and academic
            workflow activity.
          </p>
        </div>

        <div className="analytics-actions">

          <div className="period-selector">
            {[30, 60, 90, 180, 365].map((value) => (
              <button
                key={value}
                className={days === value ? "selected" : ""}
                onClick={() => setDays(value)}
              >
                {value}D
              </button>
            ))}
          </div>

          <button
            className="analytics-refresh"
            onClick={loadAnalytics}
          >
            <RefreshCw size={16} />
            Refresh
          </button>

        </div>
      </motion.header>

      {/* ERROR */}
      {error && (
        <motion.div
          className="analytics-error"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <XCircle size={20} />
          <span>{error}</span>
          <button onClick={loadAnalytics}>
            Retry
          </button>
        </motion.div>
      )}

      {/* STATS */}
      <section className="analytics-stats">

        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={card.title}
              className={`analytics-stat ${card.className}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.08,
                duration: 0.45
              }}
              whileHover={{
                y: -6,
                scale: 1.015
              }}
            >
              <div className="analytics-stat-top">
                <div className="analytics-stat-icon">
                  <Icon size={21} />
                </div>

                <Activity size={17} />
              </div>

              <div className="analytics-stat-value">
                {loading ? "Ã¢â‚¬â€" : card.value}
              </div>

              <div className="analytics-stat-title">
                {card.title}
              </div>
            </motion.div>
          );
        })}

      </section>

      {/* SECONDARY STATS */}
      <section className="analytics-secondary">

        <motion.div
          className="analytics-mini-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mini-icon green">
            <TrendingUp size={18} />
          </div>

          <div>
            <span>Approval Rate</span>
            <strong>{approvalRate}%</strong>
          </div>

          <div className="mini-progress">
            <span
              style={{ width: `${approvalRate}%` }}
            />
          </div>
        </motion.div>

        <motion.div
          className="analytics-mini-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <div className="mini-icon red">
            <XCircle size={18} />
          </div>

          <div>
            <span>Rejection Rate</span>
            <strong>{rejectionRate}%</strong>
          </div>

          <div className="mini-progress red-progress">
            <span
              style={{ width: `${rejectionRate}%` }}
            />
          </div>
        </motion.div>

        <motion.div
          className="analytics-mini-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
        >
          <div className="mini-icon orange">
            <Search size={18} />
          </div>

          <div>
            <span>Under Review</span>
            <strong>{data.underReview}</strong>
          </div>
        </motion.div>

      </section>

      {/* CHARTS */}
      <section className="analytics-chart-grid">

        <motion.div
          className="analytics-panel analytics-large"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="panel-title">
            <div>
              <h2>Request Activity</h2>
              <p>
                Request volume during the selected period
              </p>
            </div>

            <span className="live-dot">
              LIVE
            </span>
          </div>

          <div className="chart-container">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="requestGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#f97316"
                        stopOpacity={0.35}
                      />

                      <stop
                        offset="100%"
                        stopColor="#f97316"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke="rgba(255,255,255,.05)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="date"
                    stroke="#64748b"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    stroke="#64748b"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#111827",
                      border: "0",
                      borderRadius: "12px",
                      color: "#fff"
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="requests"
                    stroke="#f97316"
                    strokeWidth={2.5}
                    fill="url(#requestGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="analytics-no-data">
                No request activity available
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="analytics-panel"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08 }}
        >
          <div className="panel-title">
            <div>
              <h2>Documents</h2>
              <p>Requests by document type</p>
            </div>
          </div>

          <div className="chart-container">
            {typeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData}>
                  <CartesianGrid
                    stroke="rgba(255,255,255,.05)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    stroke="#64748b"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#111827",
                      border: "0",
                      borderRadius: "12px",
                      color: "#fff"
                    }}
                  />

                  <Bar
                    dataKey="count"
                    fill="#f97316"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="analytics-no-data">
                No document data available
              </div>
            )}
          </div>
        </motion.div>

      </section>

      {/* STATUS */}
      <motion.section
        className="analytics-panel status-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="panel-title">
          <div className="analytics-pixel-track">
          <div className="analytics-pixel-runner">
            <span className="pixel-head"></span>
            <span className="pixel-body"></span>
            <span className="pixel-arm"></span>
            <span className="pixel-leg pixel-leg-one"></span>
            <span className="pixel-leg pixel-leg-two"></span>
          </div>
        </div>
      </div>    
      </motion.section>

    </main>
  );
}




