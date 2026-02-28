'use client';
import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const Sidebar = () => {
  const items = [
    { label: 'Dashboard', icon: '🏠', href: '/dashboard' },
    { label: 'User', icon: '👤', href: '/users' },
    { label: 'Blog', icon: '📝', href: '/dashboard/blog' },
  ];
  return (
    <aside className="d-none d-md-flex flex-column text-light p-3" style={{ width: 260, background: '#0b0f17', borderRight: '1px solid #111827', minHeight: '100vh', position: 'sticky', top: 0 }}>
      <div className="d-flex align-items-center gap-2 mb-4">
        <div className="rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: 36, height: 36, background: '#111827' }}>D</div>
        <span className="fw-semibold">Delbari</span>
      </div>
      <nav className="nav flex-column small">
        {items.map((it) => (
          <div key={it.label} className="mb-2">
            <a className="nav-link text-light py-2 px-2 rounded-2 d-flex align-items-center gap-2" href={it.href || '#'} style={{ background: it.label === 'Dashboard' ? '#111827' : 'transparent' }}>
              <span style={{ width: 20, textAlign: 'center' }}>{it.icon}</span>
              <span>{it.label}</span>
            </a>
          </div>
        ))}
      </nav>
      <div className="mt-auto pt-3 border-top border-secondary-subtle small text-secondary">v1.0.0</div>
    </aside>
  );
};

export { Sidebar };

const DashboardContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);

  React.useEffect(() => {
    const checkAdminAccess = () => {
      const userRole = localStorage.getItem('userRole');
      const userToken = localStorage.getItem('userToken');

      if (!userToken || userRole !== 'admin') {
        router.push('/login');
        return;
      }

      setIsCheckingAuth(false);
    };

    checkAdminAccess();
  }, [router]);

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
    <div className="d-flex">
      <Sidebar />
      <main className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h4 mb-0">Dashboard</h1>
          <div className="d-flex gap-2">
            <Link href="/users" className="btn btn-outline-primary text-light">Manage Users</Link>
            <Link href="/dashboard/blog" className="btn btn-outline-info text-light">Manage Blog</Link>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-6">
            <div className="card bg-black border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <h2 className="display-4 mb-3">📝</h2>
                <h5 className="text-light mb-2">Blog Management</h5>
                <p className="text-secondary mb-3">Create, edit, and manage blog posts</p>
                <Link href="/dashboard/blog" className="btn btn-primary">Manage Blog</Link>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card bg-black border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <h2 className="display-4 mb-3">👤</h2>
                <h5 className="text-light mb-2">User Management</h5>
                <p className="text-secondary mb-3">View and manage registered users</p>
                <Link href="/users" className="btn btn-primary">Manage Users</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const DashboardPage = () => {
  return (
    <div className="container-fluid g-0 bg-dark text-light min-vh-100">
      <Suspense fallback={
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </div>
  );
};

export default DashboardPage;
