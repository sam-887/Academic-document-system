import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Analytics() {
  const [data, setData] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    byType: []
  });

  useEffect(() => {
    api.get("/analytics/dashboard")
      .then((res) => setData(res.data))
      .catch(console.error);
  }, []);

  const cards = [
    ["Total Requests", data.total],
    ["Pending", data.pending],
    ["Approved", data.approved],
    ["Rejected", data.rejected]
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">?? Analytics</h1>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {cards.map(([title, value]) => (
          <div key={title} className="bg-white border rounded-2xl p-5">
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-2xl p-6">
        <h2 className="font-semibold text-lg mb-5">
          Requests by Document Type
        </h2>

        <div className="space-y-4">
          {data.byType.map((item) => {
            const max = Math.max(...data.byType.map((x) => x.count), 1);
            const width = `${(item.count / max) * 100}%`;

            return (
              <div key={item._id}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item._id || "Unknown"}</span>
                  <span>{item.count}</span>
                </div>

                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
