"use client";

import { FormEvent, useState } from "react";
import {
  LoaderCircle,
  LockKeyhole,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Login failed"
        );
      }

      localStorage.setItem(
        "admin_token",
        data.token
      );

      router.push("/admin");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">

        <div className="admin-login-logo">
          EA
        </div>

        <div className="admin-login-heading">
          <span className="section-label">
            ADMINISTRATION
          </span>

          <h1>Conference Admin</h1>

          <p>
            Sign in to manage registrations,
            exhibitors and payment verification.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <label>
            Username

            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              placeholder="Admin username"
              required
              autoComplete="username"
            />
          </label>

          <label>
            Password

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Admin password"
              required
              autoComplete="current-password"
            />
          </label>

          <button
            type="submit"
            className="button button-primary form-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <LoaderCircle className="spin" />
                Signing in...
              </>
            ) : (
              <>
                <LockKeyhole size={17} />
                Sign in
                <ArrowRight size={17} />
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}