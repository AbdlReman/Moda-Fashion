"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const items = [
    { label: "Dashboard", icon: "🏠", href: "/dashboard" },
    { label: "User", icon: "👤", href: "/users" },
    { label: "Blog", icon: "📝", href: "/dashboard/blog" },
  ];
  return (
    <aside
      className="d-none d-md-flex flex-column text-light p-3"
      style={{
        width: 260,
        background: "#0b0f17",
        borderRight: "1px solid #111827",
        minHeight: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <div className="d-flex align-items-center gap-2 mb-4">
        <div
          className="rounded-circle d-inline-flex align-items-center justify-content-center"
          style={{ width: 36, height: 36, background: "#111827" }}
        >
          D
        </div>
        <span className="fw-semibold">Delbari</span>
      </div>
      <nav className="nav flex-column small">
        {items.map((it) => (
          <div key={it.label} className="mb-2">
            <a
              className="nav-link text-light py-2 px-2 rounded-2 d-flex align-items-center gap-2"
              href={it.href || "#"}
              style={{
                background: it.label === "User" ? "#111827" : "transparent",
              }}
            >
              <span style={{ width: 20, textAlign: "center" }}>{it.icon}</span>
              <span>{it.label}</span>
            </a>
          </div>
        ))}
      </nav>
      <div className="mt-auto pt-3 border-top border-secondary-subtle small text-secondary">
        v1.0.0
      </div>
    </aside>
  );
};

async function fetchUsers() {
  const res = await fetch("/api/users", { cache: "no-store" });
  console.log("API Response status:", res.status);
  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ message: "Failed to fetch users" }));
    console.error("API Error:", errorData);
    throw new Error(errorData.message || "Failed to fetch users");
  }
  const data = await res.json();
  console.log("Fetched users data:", data);
  return data;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);

  // Client-side admin check
  React.useEffect(() => {
    const checkAdminAccess = () => {
      const userRole = localStorage.getItem("userRole");
      const userToken = localStorage.getItem("userToken");

      if (!userToken || userRole !== "admin") {
        router.push("/login");
        return;
      }

      setIsCheckingAuth(false);
    };

    checkAdminAccess();
  }, [router]);

  const load = React.useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchUsers();
      console.log("Setting users:", data);
      // Ensure data is an array
      const usersArray = Array.isArray(data) ? data : [];
      console.log("Users array length:", usersArray.length);
      setUsers(usersArray);
      if (usersArray.length === 0) {
        console.log("No users found in response");
      }
    } catch (e) {
      console.error("Error loading users:", e);
      setError(`Could not load users: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const onDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    load();
  };

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid g-0 bg-dark text-light min-vh-100">
      <div className="d-flex">
        <Sidebar />
        <main className="flex-grow-1 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h4 mb-0">Registered Users</h1>
          </div>

          <div className="card bg-black border-0 shadow-sm">
            <div className="card-body">
              {loading ? (
                <div className="text-secondary">Loading...</div>
              ) : error ? (
                <div className="text-danger">{error}</div>
              ) : users.length === 0 ? (
                <div className="text-secondary">No users yet.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-dark table-hover align-middle">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Country</th>
                        <th>Gender</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id || u.id}>
                          <td>
                            {(u._id || u.id).toString().substring(0, 8)}...
                          </td>
                          <td>
                            {u.firstName} {u.lastName}
                          </td>
                          <td>{u.email}</td>
                          <td>{u.country || "-"}</td>
                          <td>{u.gender || "-"}</td>
                          <td>
                            <span className="badge bg-secondary">
                              {u.role || "user"}
                            </span>
                          </td>
                          <td className="d-flex gap-2">
                            <Link
                              className="btn btn-sm btn-outline-info text-light"
                              href={`/users/${u._id || u.id}`}
                            >
                              View
                            </Link>
                            <Link
                              className="btn btn-sm btn-outline-secondary text-light"
                              href={`/users/${u._id || u.id}/edit`}
                            >
                              Edit
                            </Link>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => onDelete(u._id || u.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
