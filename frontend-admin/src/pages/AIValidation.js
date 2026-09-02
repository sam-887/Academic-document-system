import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function AIValidation() {
  const [data, setData] = useState(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  const load = async (range = days) => {
    try {
      setLoading(true);
      const res = await api.get(`/analytics/dashboard?days=${range}`);
      setData(res.data);
    } catch (err) {
      console.error("Analytics loading failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [days]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <p className="text-slate-500">Loading analytics...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <p className="text-red-500">Failed to load analytics.</p>
      </div>
    );
  }

  const maxType = Math.max(
    ...(data.byType || []).map(x => x.count),
    1
  );

  const maxStatus = Math.max(
    ...(data.timeline || []).map(x => x.total),
    1
  );

  return (
    <div className="max-w-7xl mx-auto p-6">

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            AI Validation & Analytics
          </h1>
          <p className="text-slate-500 mt-1">
            Complete document request analysis and processing insights.
          </p>
        </div>

        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="border rounded-xl px-4 py-2 bg-white shadow-sm"
        >
          <option value={7}>Past 7 Days</option>
          <option value={30}>Past 30 Days</option>
          <option value={60}>Past 60 Days</option>
          <option value={90}>Past 90 Days</option>
        </select>
      </div>

      {/* SUMMARY */}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">

        <div className="bg-white border rounded-2xl p-5">
          <p className="text-sm text-slate-500">Total Requests</p>
          <p className="text-3xl font-bold mt-2">{data.total}</p>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
          <p className="text-sm text-amber-700">Pending</p>
          <p className="text-3xl font-bold text-amber-700 mt-2">
            {data.pending}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <p className="text-sm text-blue-700">Under Review</p>
          <p className="text-3xl font-bold text-blue-700 mt-2">
            {data.underReview}
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
          <p className="text-sm text-emerald-700">Approved</p>
          <p className="text-3xl font-bold text-emerald-700 mt-2">
            {data.approved}
          </p>
        </div>

        <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
          <p className="text-sm text-red-700">Rejected</p>
          <p className="text-3xl font-bold text-red-700 mt-2">
            {data.rejected}
          </p>
        </div>

      </div>

      {/* DOCUMENT TYPES */}

      <div className="bg-white border rounded-2xl p-6 mb-8">

        <h2 className="text-xl font-semibold text-slate-800 mb-6">
          Documents Issued by Type
        </h2>

        <div className="space-y-5">

          {(data.byType || []).map(item => {

            const width = `${(item.count / maxType) * 100}%`;

            return (
              <div key={item._id}>

                <div className="flex justify-between mb-2">
                  <span className="font-medium text-slate-700">
                    {item._id || "Unknown"}
                  </span>

                  <span className="font-semibold text-slate-800">
                    {item.count}
                  </span>
                </div>

                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width }}
                  />
                </div>

              </div>
            );
          })}

        </div>
      </div>

      {/* STATUS DISTRIBUTION */}

      <div className="grid lg:grid-cols-2 gap-6 mb-8">

        <div className="bg-white border rounded-2xl p-6">

          <h2 className="text-xl font-semibold mb-6">
            Request Status
          </h2>

          <div className="space-y-4">

            {[
              ["Pending", data.pending, "bg-amber-500"],
              ["Under Review", data.underReview, "bg-blue-500"],
              ["Approved", data.approved, "bg-emerald-500"],
              ["Rejected", data.rejected, "bg-red-500"]
            ].map(([name, value, color]) => {

              const total = Math.max(data.total, 1);
              const width = `${(value / total) * 100}%`;

              return (
                <div key={name}>

                  <div className="flex justify-between text-sm mb-1">
                    <span>{name}</span>
                    <span className="font-semibold">{value}</span>
                  </div>

                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color} rounded-full`}
                      style={{ width }}
                    />
                  </div>

                </div>
              );
            })}

          </div>
        </div>

        {/* REJECTION REASONS */}

        <div className="bg-white border rounded-2xl p-6">

          <h2 className="text-xl font-semibold mb-6">
            Common Rejection Reasons
          </h2>

          {data.rejectionReasons?.length ? (

            <div className="flex flex-wrap gap-3">

              {data.rejectionReasons.map((item, index) => (

                <div
                  key={index}
                  className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl"
                >
                  <span className="text-sm text-red-700">
                    {item.reason}
                  </span>

                  <span className="ml-2 font-bold text-red-800">
                    {item.count}
                  </span>
                </div>

              ))}

            </div>

          ) : (
            <p className="text-slate-500">
              No rejection data available.
            </p>
          )}

        </div>

      </div>

      {/* TIMELINE */}

      <div className="bg-white border rounded-2xl p-6">

        <h2 className="text-xl font-semibold mb-6">
          Request Timeline � Past {days} Days
        </h2>

        <div className="flex items-end gap-2 h-64 overflow-x-auto">

          {(data.timeline || []).map((item, index) => {

            const height =
              `${Math.max((item.total / maxStatus) * 100, 4)}%`;

            return (
              <div
                key={index}
                className="min-w-[32px] flex flex-col items-center justify-end h-full"
              >

                <span className="text-xs text-slate-500 mb-1">
                  {item.total}
                </span>

                <div
                  className="w-6 bg-indigo-500 rounded-t-lg"
                  style={{ height }}
                  title={`${item.date}: ${item.total} requests`}
                />

                <span className="text-[10px] text-slate-400 mt-2 rotate-45">
                  {item.date}
                </span>

              </div>
            );

          })}

        </div>

      </div>

    </div>
  );
}
