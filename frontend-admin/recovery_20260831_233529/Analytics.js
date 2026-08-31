import React, { useEffect, useState } from "react";
import { FileText, CheckCircle2, XCircle, UserSearch, Clock3, Settings2, GraduationCap } from "lucide-react";
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

      const res = await api.get(`/analytics/dashboard?days=${days}`);
      setData(res.data);
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

  useEffect(() => {
    loadAnalytics();
  }, [days]);

  const maxType = Math.max(
    ...data.byType.map((x) => x.count),
    1
  );

  const maxReason = Math.max(
    ...data.rejectedReasons.map((x) => x.count),
    1
  );

  const maxTimeline = Math.max(
    ...data.timeline.map((x) => x.total),
    1
  );

  const approvalRate =
    data.total > 0
      ? Math.round((data.approved / data.total) * 100)
      : 0;

  const rejectionRate =
    data.total > 0
      ? Math.round((data.rejected / data.total) * 100)
      : 0;

  const statusCards = [
    {
      title: "Total Requests",
      value: data.total,
      icon: FileText,
      bg: "bg-slate-100",
      text: "text-slate-800"
    },
    {
      title: "Approved / Issued",
      value: data.approved,
      icon: CheckCircle2,
      bg: "bg-emerald-100",
      text: "text-emerald-700"
    },
    {
      title: "Rejected",
      value: data.rejected,
      icon: XCircle,
      bg: "bg-red-100",
      text: "text-red-700"
    },
    {
      title: "Under Review",
      value: data.underReview,
      icon: UserSearch,
      bg: "bg-amber-100",
      text: "text-amber-700"
    },
    {
      title: "Pending",
      value: data.pending,
      icon: Clock3,
      bg: "bg-blue-100",
      text: "text-blue-700"
    },
    {
      title: "Generating",
      value: data.generating,
      icon: Settings2,
      bg: "bg-purple-100",
      text: "text-purple-700"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Analytics
          </h1>

          <p className="text-slate-500 mt-1">
            Complete academic document request analysis
          </p>
        </div>

        <div className="flex items-center gap-2">
          {[30, 60, 90, 180, 365].map((value) => (
            <button
              key={value}
              onClick={() => setDays(value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                days === value
                  ? "bg-slate-900 text-white"
                  : "bg-white border text-slate-600 hover:bg-slate-50"
              }`}
            >
              {value} Days
            </button>
          ))}
        </div>

      </div>

      {loading && (
        <div className="bg-white border rounded-2xl p-8 text-center text-slate-500">
          Loading analytics...
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
          <p className="font-semibold text-red-700">
            {error}
          </p>
          <button
            onClick={loadAnalytics}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">

            {statusCards.map((card) => (
              <div
                key={card.title}
                className={`${card.bg} rounded-2xl p-5`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-2xl">
                    <card.icon size={30} strokeWidth={2.2} />
                  </span>

                  <span className={`text-3xl font-bold ${card.text}`}>
                    {card.value}
                  </span>
                </div>

                <p className={`text-sm mt-4 font-medium ${card.text}`}>
                  {card.title}
                </p>
              </div>
            ))}

          </div>


          <div className="grid md:grid-cols-2 gap-6 mb-6">

            <div className="bg-white border rounded-2xl p-6">

              <div className="flex justify-between mb-5">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">
                    Approval Rate
                  </h2>

                  <p className="text-sm text-slate-500">
                    Documents approved / issued
                  </p>
                </div>

                <span className="text-2xl font-bold text-emerald-600">
                  {approvalRate}%
                </span>
              </div>

              <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${approvalRate}%` }}
                />
              </div>

            </div>


            <div className="bg-white border rounded-2xl p-6">

              <div className="flex justify-between mb-5">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">
                    Rejection Rate
                  </h2>

                  <p className="text-sm text-slate-500">
                    Requests rejected
                  </p>
                </div>

                <span className="text-2xl font-bold text-red-600">
                  {rejectionRate}%
                </span>
              </div>

              <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${rejectionRate}%` }}
                />
              </div>

            </div>

          </div>


          <div className="grid lg:grid-cols-2 gap-6 mb-6">

            <div className="bg-white border rounded-2xl p-6">

              <h2 className="text-lg font-semibold text-slate-800">
                Documents Requested
              </h2>

              <p className="text-sm text-slate-500 mb-6">
                Distribution by document type
              </p>

              <div className="space-y-5">

                {data.byType.map((item) => (
                  <div key={item._id}>

                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-slate-700">
                        {item._id || "Unknown"}
                      </span>

                      <span className="font-bold text-slate-800">
                        {item.count}
                      </span>
                    </div>

                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all"
                        style={{
                          width: `${(item.count / maxType) * 100}%`
                        }}
                      />
                    </div>

                  </div>
                ))}

                {!data.byType.length && (
                  <p className="text-slate-400">
                    No request data.
                  </p>
                )}

              </div>

            </div>


            <div className="bg-white border rounded-2xl p-6">

              <h2 className="text-lg font-semibold text-slate-800">
                Documents Issued
              </h2>

              <p className="text-sm text-slate-500 mb-6">
                Approved / completed documents
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                {["BONAFIDE", "TRANSCRIPT", "RECOMMENDATION"].map((type) => {

                  const found = data.approvedByType.find(
                    (x) => x._id === type
                  );

                  const count = found?.count || 0;

                  return (
                    <div
                      key={type}
                      className="border rounded-2xl p-5 text-center bg-slate-50"
                    >
                      <div className="text-3xl font-bold text-emerald-600">
                        {count}
                      </div>

                      <div className="text-xs font-semibold text-slate-500 mt-2">
                        {type}
                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

          </div>


          <div className="bg-white border rounded-2xl p-6 mb-6">

            <div className="flex justify-between items-center mb-6">

              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Request Timeline
                </h2>

                <p className="text-sm text-slate-500">
                  Daily request activity for the selected period
                </p>
              </div>

              <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium">
                Last {days} days
              </span>

            </div>

            <div className="flex items-end gap-2 h-64 overflow-x-auto">

              {data.timeline.map((item) => (
                <div
                  key={item._id}
                  className="min-w-[38px] flex flex-col items-center justify-end h-full"
                >

                  <span className="text-[10px] text-slate-500 mb-1">
                    {item.total}
                  </span>

                  <div
                    className="w-7 bg-blue-500 rounded-t-lg"
                    style={{
                      height: `${Math.max(
                        (item.total / maxTimeline) * 180,
                        6
                      )}px`
                    }}
                    title={`${item._id}: ${item.total} requests`}
                  />

                  <span className="text-[9px] text-slate-400 mt-2 rotate-[-45deg] origin-top">
                    {item._id.slice(5)}
                  </span>

                </div>
              ))}

            </div>

          </div>


          <div className="bg-white border rounded-2xl p-6">

            <h2 className="text-lg font-semibold text-slate-800">
              Rejection Analysis
            </h2>

            <p className="text-sm text-slate-500 mb-6">
              Most common rejection reasons
            </p>

            <div className="space-y-5">

              {data.rejectedReasons.map((item, index) => (
                <div key={item._id}>

                  <div className="flex gap-3 items-center mb-2">

                    <span className="w-7 h-7 flex items-center justify-center rounded-full bg-red-100 text-red-700 text-xs font-bold">
                      {index + 1}
                    </span>

                    <span className="flex-1 text-sm font-medium text-slate-700">
                      {item._id}
                    </span>

                    <span className="text-sm font-bold text-red-600">
                      {item.count}
                    </span>

                  </div>

                  <div className="ml-10 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{
                        width: `${(item.count / maxReason) * 100}%`
                      }}
                    />
                  </div>

                </div>
              ))}

              {!data.rejectedReasons.length && (
                <div className="text-center py-8 text-slate-400">
                  No rejection reasons in this period.
                </div>
              )}

            </div>

          </div>

        </>
      )}

    </div>
  );
}





