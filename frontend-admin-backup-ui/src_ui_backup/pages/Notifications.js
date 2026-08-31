import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Notifications() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/notifications")
      .then((res) => setItems(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item._id} className="bg-white border rounded-xl p-4">
            <h2 className="font-semibold">{item.title}</h2>
            <p className="text-sm text-slate-600">{item.message}</p>
          </div>
        ))}

        {!items.length && (
          <p className="text-slate-500">No notifications yet.</p>
        )}
      </div>
    </div>
  );
}

