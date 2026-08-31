import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function DigitalLocker() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    api.get("/locker")
      .then((res) => setDocuments(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Digital Locker</h1>
        <p className="text-slate-500 mt-2">
          Your verified academic documents in one secure place.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {documents.map((doc) => (
          <div
            key={doc._id}
            className="bg-white border rounded-2xl p-5 shadow-sm"
          >
            <div className="text-3xl mb-4">??</div>

            <h2 className="font-semibold">{doc.title}</h2>

            <p className="text-sm text-slate-500 capitalize mt-1">
              {doc.type}
            </p>

            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                ? Verified
              </span>
            </div>

            <a
              href={doc.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="block mt-5 text-center bg-blue-600 text-white rounded-lg py-2"
            >
              View Document
            </a>
          </div>
        ))}
      </div>

      {!documents.length && (
        <div className="border rounded-xl p-8 text-center text-slate-500">
          Your digital locker is currently empty.
        </div>
      )}
    </div>
  );
}

