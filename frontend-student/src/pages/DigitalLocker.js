import React, { useEffect, useState } from "react";
import {
  FileText,
  CheckCircle2,
  ExternalLink,
  Upload,
  FileUp
} from "lucide-react";
import api from "../api/axios";

const SERVER =
  process.env.REACT_APP_API_URL?.replace("/api", "") ||
  "http://localhost:5000";

export default function DigitalLocker() {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("other");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const loadDocuments = async () => {
    try {
      const res = await api.get("/locker");
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    try {
      setUploading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title || file.name);
      formData.append("type", type);

      await api.post("/locker/upload", formData);

      setFile(null);
      setTitle("");
      setType("other");

      const input = document.getElementById("locker-file");
      if (input) input.value = "";

      setMessage("Document uploaded successfully.");
      await loadDocuments();
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || "Failed to upload document."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Digital Locker
        </h1>

        <p className="text-slate-500 mt-2">
          Store your personal academic documents securely.
        </p>
      </div>

      <div className="bg-white border rounded-2xl p-6 mb-8 shadow-sm">

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-blue-50 rounded-xl">
            <Upload size={22} className="text-blue-600" />
          </div>

          <h2 className="text-xl font-semibold text-slate-800">
            Upload Personal Document
          </h2>
        </div>

        <form onSubmit={handleUpload}>

          <div className="grid md:grid-cols-2 gap-4 mb-4">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Document Name
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Example: 12th Marksheet"
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Document Type
              </label>

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 bg-white"
              >
                <option value="other">Other</option>
                <option value="certificate">Certificate</option>
                <option value="marksheet">Marksheet</option>
                <option value="bonafide">Bonafide</option>
                <option value="transcript">Transcript</option>
                <option value="recommendation">Recommendation</option>
              </select>
            </div>

          </div>

          <div className="border-2 border-dashed rounded-xl p-8 text-center mb-4">

            <FileUp
              size={36}
              className="mx-auto mb-3 text-slate-400"
            />

            <p className="text-sm font-medium text-slate-700 mb-2">
              Select a document to upload
            </p>

            <input
              id="locker-file"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full"
            />

            <p className="text-xs text-slate-500 mt-3">
              PDF, JPG or PNG - Maximum 10 MB
            </p>

          </div>

          <button
            type="submit"
            disabled={uploading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium disabled:opacity-50"
          >
            <Upload size={18} />

            {uploading ? "Uploading..." : "Upload Document"}
          </button>

          {message && (
            <p className="mt-3 text-sm text-slate-600">
              {message}
            </p>
          )}

        </form>
      </div>

      <div>

        <h2 className="text-xl font-semibold text-slate-800 mb-5">
          My Documents
        </h2>

        {documents.length === 0 ? (

          <div className="border rounded-2xl p-10 text-center text-slate-500 bg-white">

            <FileText
              size={40}
              className="mx-auto mb-3 text-slate-400"
            />

            No personal documents uploaded yet.

          </div>

        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

            {documents.map((doc) => (

              <div
                key={doc._id}
                className="bg-white border rounded-2xl p-5 shadow-sm"
              >

                <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-xl mb-4">
                  <FileText
                    size={26}
                    className="text-blue-600"
                  />
                </div>

                <h3 className="font-semibold text-slate-800">
                  {doc.title}
                </h3>

                <p className="text-sm text-slate-500 capitalize mt-1">
                  {doc.type}
                </p>

                <div className="flex items-center gap-2 mt-4">

                  <CheckCircle2
                    size={15}
                    className="text-green-600"
                  />

                  <span className="text-xs text-green-700">
                    Personal Document
                  </span>

                </div>

                <a
                  href={`${SERVER}${doc.fileUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 mt-5 text-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2"
                >
                  View Document
                  <ExternalLink size={17} />
                </a>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}
