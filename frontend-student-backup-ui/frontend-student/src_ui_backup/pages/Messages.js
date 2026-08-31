import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Messages() {
  const [faculty, setFaculty] = useState([]);
  const [requests, setRequests] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [requestId, setRequestId] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState([]);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get("/messages/faculty"),
      api.get("/requests")
    ])
      .then(([facultyRes, requestsRes]) => {
        setFaculty(facultyRes.data || []);
        setRequests(requestsRes.data || []);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load faculty or requests.");
      });
  }, []);

  const send = async (e) => {
    e.preventDefault();

    if (!receiverId || !requestId || !message.trim()) {
      setError("Please select faculty, a document request, and enter a message.");
      return;
    }

    setError("");
    setSending(true);

    try {
      const res = await api.post(
        `/messages/request/${requestId}`,
        {
          receiverId,
          message: message.trim()
        }
      );

      setSent((prev) => [...prev, res.data]);
      setMessage("");

      alert("Message sent to admin/faculty successfully.");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Failed to send message."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">
        Faculty Communication
      </h1>

      <p className="text-slate-500 mb-8">
        Send a message directly to admin/faculty regarding your document request.
      </p>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-lg p-3">
          {error}
        </div>
      )}

      <form
        onSubmit={send}
        className="bg-white border rounded-2xl p-6"
      >
        <label className="block text-sm font-medium mb-2">
          Admin / Faculty
        </label>

        <select
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4"
          required
        >
          <option value="">Select admin/faculty</option>

          {faculty.map((person) => (
            <option key={person._id} value={person._id}>
              {person.name} — {person.role}
            </option>
          ))}
        </select>

        <label className="block text-sm font-medium mb-2">
          Document Request
        </label>

        <select
          value={requestId}
          onChange={(e) => setRequestId(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4"
          required
        >
          <option value="">Select document request</option>

          {requests.map((request) => (
            <option key={request._id} value={request._id}>
              {request.documentType || request.type || "Document Request"}
              {" — "}
              {request.status || "Pending"}
            </option>
          ))}
        </select>

        <label className="block text-sm font-medium mb-2">
          Message
        </label>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message to admin/faculty..."
          rows={5}
          className="w-full border rounded-lg px-3 py-2"
          required
        />

        <button
          type="submit"
          disabled={sending}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg disabled:opacity-50"
        >
          {sending ? "Sending..." : "Send Message"}
        </button>
      </form>

      {sent.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold mb-3">
            Sent Messages
          </h2>

          <div className="space-y-3">
            {sent.map((item, index) => (
              <div
                key={item._id || index}
                className="bg-blue-50 border border-blue-100 rounded-xl p-4"
              >
                <p>{item.message}</p>
                <span className="text-xs text-slate-400">
                  Sent
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
