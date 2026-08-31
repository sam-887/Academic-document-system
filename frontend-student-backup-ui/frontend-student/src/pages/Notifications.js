import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Notifications() {
  const [items, setItems] = useState([]);

  const load = async () => {
    const res = await api.get("/notifications");
    setItems(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    load();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item._id}
            className={`p-4 rounded-xl border ${
              item.read ? "bg-white" : "bg-blue-50 border-blue-200"
            }`}
          >
            <div className="flex justify-between gap-4">
              <div>
                <h2 className="font-semibold">{item.title}</h2>
                <p className="text-sm text-slate-600 mt-1">{item.message}</p>
                <p className="text-xs text-slate-400 mt-2">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>

              {!item.read && (
                <button
                  onClick={() => markRead(item._id)}
                  className="text-sm text-blue-600"
                >
                  Mark read
                </button>
              )}
            </div>
          </div>
        ))}

        {!items.length && (
          <div className="text-slate-500">No notifications yet.</div>
        )}
      </div>
    </div>
  );
}

