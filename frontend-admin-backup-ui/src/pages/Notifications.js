import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [clearing, setClearing] = useState(false);

  const loadNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setItems(res.data);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const clearAll = async () => {
    if (!items.length) return;

    const confirmed = window.confirm(
      "Are you sure you want to clear all notifications?"
    );

    if (!confirmed) return;

    try {
      setClearing(true);

      await api.delete("/notifications/clear-all");

      setItems([]);
    } catch (err) {
      console.error("Failed to clear notifications:", err);
      alert(
        err.response?.data?.message ||
        "Failed to clear notifications"
      );
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">

      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-3xl font-bold">
            Notifications
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            {items.length} notification{items.length !== 1 ? "s" : ""}
          </p>
        </div>

        <button
          onClick={clearAll}
          disabled={!items.length || clearing}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            !items.length || clearing
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          {clearing ? "Clearing..." : "Clear All"}
        </button>

      </div>

      <div className="space-y-3">

        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white border rounded-xl p-4"
          >
            <div className="flex items-start justify-between gap-4">

              <div>
                <h2 className="font-semibold text-slate-800">
                  {item.title}
                </h2>

                <p className="text-sm text-slate-600 mt-1">
                  {item.message}
                </p>
              </div>

              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  item.read
                    ? "bg-slate-100 text-slate-500"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {item.read ? "Read" : "New"}
              </span>

            </div>

            {item.createdAt && (
              <p className="text-xs text-slate-400 mt-3">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            )}

          </div>
        ))}

        {!items.length && (
          <div className="bg-white border rounded-xl p-10 text-center">
            <div className="text-4xl mb-3">??</div>

            <p className="font-medium text-slate-700">
              No notifications
            </p>

            <p className="text-sm text-slate-500 mt-1">
              You're all caught up.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
