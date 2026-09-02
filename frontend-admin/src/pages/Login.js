import React, { useState } from "react";
import"../styles/login.css";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 19 6v5c0 4.8-2.9 8.3-7 10-4.1-1.7-7-5.2-7-10V6l7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }

    try {
      setBusy(true);
      setError("");

      const res = await api.post("/auth/login", {
        email: email.trim(),
        password
      });

      const user = res.data.user || res.data;

      if (login) {
        await login(email.trim(), password);
      }

      const role = user.role || res.data.role;

      if (role !== "admin" && role !== "faculty") {
        setError(
          "This portal is only for administrators and faculty."
        );
        return;
      }

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to sign in. Check your credentials."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="eec-login">

      <div className="eec-login-glow eec-login-glow-one" />
      <div className="eec-login-glow eec-login-glow-two" />

      <div className="eec-login-shell">

        {/* LEFT BRAND PANEL */}

        <section className="eec-login-brand">

          <div className="eec-login-brand-top">

            <div className="eec-login-logo">
              <span>EEC</span>
            </div>

            <div>
              <div className="eec-login-brand-name">
                EEC
              </div>

              <div className="eec-login-brand-mini">
                ADMINISTRATION
              </div>
            </div>

          </div>

          <div className="eec-login-hero">

            <div className="eec-login-eyebrow">
              ACADEMIC WORKSPACE
            </div>

            <h1>
              Academic documents,
              <br />
              <span>managed smarter.</span>
            </h1>

            <p>
              A secure workspace for managing student
              document requests, validation workflows
              and academic operations.
            </p>

          </div>

          <div className="eec-login-features">

            <div className="eec-login-feature">
              <div className="eec-login-feature-icon">
                <ShieldIcon />
              </div>

              <div>
                <strong>Secure document management</strong>
                <span>Centralized academic workflows</span>
              </div>
            </div>

            <div className="eec-login-feature">
              <div className="eec-login-feature-icon">
                <span className="eec-login-feature-dot" />
              </div>

              <div>
                <strong>AI-assisted validation</strong>
                <span>Faster document verification</span>
              </div>
            </div>

            <div className="eec-login-feature">
              <div className="eec-login-feature-icon">
                <span className="eec-login-chart">
                  ↗
                </span>
              </div>

              <div>
                <strong>Analytics & monitoring</strong>
                <span>Real-time request visibility</span>
              </div>
            </div>

          </div>

          <div className="eec-login-brand-footer">
            <span className="eec-login-status-dot" />
            EEC Academic Document Management System
          </div>

        </section>


        {/* LOGIN PANEL */}

        <section className="eec-login-panel">

          <div className="eec-login-card">

            <div className="eec-login-card-head">

              <div className="eec-login-card-icon">
                <LockIcon />
              </div>

              <div className="eec-login-card-label">
                ADMIN ACCESS
              </div>

            </div>

            <div className="eec-login-heading">

              <h2>
                Welcome back
              </h2>

              <p>
                Sign in to continue to your
                administration workspace.
              </p>

            </div>

            {error && (
              <div className="eec-login-error">
                <span>!</span>
                <div>{error}</div>
              </div>
            )}

            <form
              className="eec-login-form"
              onSubmit={submit}
            >

              <div className="eec-login-field">

                <label htmlFor="admin-email">
                  Email address
                </label>

                <div className="eec-login-input-wrap">

                  <MailIcon />

                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="admin@eec.edu.in"
                    autoComplete="email"
                    disabled={busy}
                  />

                </div>

              </div>


              <div className="eec-login-field">

                <div className="eec-login-label-row">

                  <label htmlFor="admin-password">
                    Password
                  </label>

                  <span>
                    Secure access
                  </span>

                </div>

                <div className="eec-login-input-wrap">

                  <LockIcon />

                  <input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={busy}
                  />

                </div>

              </div>


              <button
                className={`eec-login-submit ${
                  busy ? "loading" : ""
                }`}
                type="submit"
                disabled={busy}
              >

                <span>
                  {busy
                    ? "Signing in..."
                    : "Sign in to workspace"}
                </span>

                {!busy && <ArrowIcon />}

              </button>

            </form>


            <div className="eec-login-security">

              <div className="eec-login-security-icon">
                <ShieldIcon />
              </div>

              <div>
                <strong>Protected workspace</strong>

                <span>
                  Authorized EEC administrators and faculty only
                </span>
              </div>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}

