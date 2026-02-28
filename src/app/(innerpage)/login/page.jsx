"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (error) setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // Store user info in localStorage for client-side access
      if (data.user) {
        localStorage.setItem("userToken", "authenticated"); // Flag that user is logged in
        localStorage.setItem(
          "userId",
          data.user.id?.toString() || String(data.user._id) || "",
        );
        localStorage.setItem("userRole", data.user.role || "user");
        localStorage.setItem("userEmail", data.user.email || "");
        localStorage.setItem(
          "userName",
          `${data.user.firstName || ""} ${data.user.lastName || ""}`.trim(),
        );

        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event("localStorageUpdated"));
      }

      // Redirect based on role
      const role = data?.user?.role;
      if (role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3 py-4">
      <div className="w-100" style={{ maxWidth: 480 }}>
        <div className="card shadow-lg border-0">
          <div className="card-body p-4 p-md-5">
            <div className="text-center mb-4">
              <Link
                href="/"
                className="d-inline-flex align-items-center justify-content-center mb-2"
              >
                <Image
                  src="/assets/img/logo.png"
                  alt="Logo"
                  width={120}
                  height={36}
                />
              </Link>
              <h1 className="h4 fw-bold text-dark mb-0">Welcome back</h1>
              <div className="text-muted small mt-1">
                Log in to your account
              </div>
            </div>

            {error && (
              <div className="alert alert-danger py-2" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  className="form-control"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  className="form-control"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="remember"
                  />
                  <label className="form-check-label" htmlFor="remember">
                    Remember me
                  </label>
                </div>
                <Link href="#" className="small text-primary">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Logging in…" : "Login"}
              </button>
            </form>

            <p className="text-center text-muted mt-3 mb-0">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary fw-medium">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
