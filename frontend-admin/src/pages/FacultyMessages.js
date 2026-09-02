import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function FacultyMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMessages = async () => {
    try {
      const res = await api.get("/messages/received");
      setMessages(res.data || []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Failed to load student messages."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">
        Student Communication
      </h1>

      <p className="text-slate-500 mb-8">
        Messages sent by students regarding their document requests.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-slate-500">
          Loading messages...
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white border rounded-2xl p-8 text-center">
          <p className="text-slate-500">
            No student messages yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className="bg-white border rounded-2xl p-5 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="font-semibold">
                    {msg.senderId?.name || "Student"}
                  </h2>

                  <p className="text-sm text-slate-500">
                    {msg.senderId?.email || ""}
                  </p>
                </div>

                <span className="text-xs text-slate-400">
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleString()
                    : ""}
                </span>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                {msg.message}
              </div>

              {msg.requestId && (
                <p className="text-xs text-slate-400 mt-3">
                  Document Request:{" "}
                  {msg.requestId._id || msg.requestId}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
