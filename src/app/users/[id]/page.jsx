'use client';
import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

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
            <a className="nav-link text-light py-2 px-2 rounded-2 d-flex align-items-center gap-2" href={it.href || '#'} style={{ background: it.label === 'User' ? '#111827' : 'transparent' }}>
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

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id || '';
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);

  // Client-side admin check
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

  const fetchUser = React.useCallback(async (id) => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`/api/users/${id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch user');
      }
      const data = await res.json();
      setUser(data);
    } catch (e) {
      console.error('Error loading user:', e);
      setError(`Could not load user: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId, fetchUser]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const InfoRow = ({ label, value }) => (
    <div className="row mb-3">
      <div className="col-md-3 fw-semibold text-light">{label}:</div>
      <div className="col-md-9 text-light">{value || '-'}</div>
    </div>
  );

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

  if (loading) {
    return (
      <div className="container-fluid g-0 bg-dark text-light min-vh-100">
        <div className="d-flex">
          <Sidebar />
          <main className="flex-grow-1 p-4">
            <div className="text-secondary">Loading user details...</div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container-fluid g-0 bg-dark text-light min-vh-100">
        <div className="d-flex">
          <Sidebar />
          <main className="flex-grow-1 p-4">
            <div className="text-danger">{error || 'User not found'}</div>
            <Link href="/users" className="btn btn-primary mt-3">Back to Users</Link>
          </main>
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
            <h1 className="h4 mb-0">User Details</h1>
            <div className="d-flex gap-2">
              <Link href="/users" className="btn btn-outline-secondary text-light">Back to Users</Link>
              <Link href={`/users/${userId}/edit`} className="btn btn-primary">Edit User</Link>
            </div>
          </div>

          <div className="row g-4">
            {/* Profile Section */}
            <div className="col-12 col-lg-4">
              <div className="card bg-black border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="text-center mb-4">
                    <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                         style={{ width: 120, height: 120, background: '#111827', fontSize: '3rem' }}>
                      {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                    </div>
                    <h3 className="mb-1 text-light">{user.firstName} {user.lastName}</h3>
                    <p className="text-light mb-2">{user.email}</p>
                    <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                      {user.role || 'user'}
                    </span>
                  </div>

                  {(user.profilePhotoUrl || user.profilePhotoName) && (
                    <div className="mt-4">
                      <label className="text-light small mb-2 d-block fw-semibold">Profile Photo</label>
                      {user.profilePhotoUrl ? (
                        <div className="text-center">
                          <img 
                            src={user.profilePhotoUrl} 
                            alt="Profile" 
                            className="img-thumbnail rounded shadow-sm"
                            style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'cover', cursor: 'pointer' }}
                            onClick={() => window.open(user.profilePhotoUrl, '_blank')}
                            title="Click to view full size"
                          />
                          <div className="mt-2">
                            <a 
                              href={user.profilePhotoUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="btn btn-sm btn-outline-info"
                            >
                              View Full Size
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="border rounded p-3 text-center" style={{ background: '#111827' }}>
                          <div className="text-secondary small">{user.profilePhotoName}</div>
                          <small className="text-muted">File uploaded (not available)</small>
                        </div>
                      )}
                    </div>
                  )}

                  {(user.identityDocumentUrl || user.identityDocumentName) && (
                    <div className="mt-4">
                      <label className="text-light small mb-2 d-block fw-semibold">Identity Document</label>
                      {user.identityDocumentUrl ? (
                        user.identityDocumentUrl.toLowerCase().includes('pdf') || user.identityDocumentUrl.toLowerCase().endsWith('.pdf') ? (
                          <div className="border rounded p-4 text-center" style={{ background: '#111827' }}>
                            <div className="mb-3">
                              <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-25" style={{ width: 80, height: 80 }}>
                                <span className="fs-1">📄</span>
                              </div>
                            </div>
                            <a 
                              href={user.identityDocumentUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="btn btn-primary"
                            >
                              <span className="me-2">📄</span>
                              View Document (PDF)
                            </a>
                          </div>
                        ) : (
                          <div className="text-center">
                            <img 
                              src={user.identityDocumentUrl} 
                              alt="Identity Document" 
                              className="img-thumbnail rounded shadow-sm"
                              style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'cover', cursor: 'pointer' }}
                              onClick={() => window.open(user.identityDocumentUrl, '_blank')}
                              title="Click to view full size"
                            />
                            <div className="mt-2">
                              <a 
                                href={user.identityDocumentUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="btn btn-sm btn-outline-info"
                              >
                                View Full Size
                              </a>
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="border rounded p-3 text-center" style={{ background: '#111827' }}>
                          <div className="text-secondary small">{user.identityDocumentName}</div>
                          <small className="text-muted">File uploaded (not available)</small>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="col-12 col-lg-8">
              <div className="card bg-black border-0 shadow-sm mb-4">
                <div className="card-header border-secondary">
                  <h5 className="mb-0 text-light">Personal Information</h5>
                </div>
                <div className="card-body">
                  <InfoRow label="First Name" value={user.firstName} />
                  <InfoRow label="Last Name" value={user.lastName} />
                  <InfoRow label="Email" value={user.email} />
                  <InfoRow label="Gender" value={user.gender} />
                  <InfoRow label="Date of Birth" value={formatDate(user.dateOfBirth)} />
                  <InfoRow label="Marital Status" value={user.maritalStatus} />
                  <InfoRow label="Country" value={user.country} />
                </div>
              </div>

              <div className="card bg-black border-0 shadow-sm mb-4">
                <div className="card-header border-secondary">
                  <h5 className="mb-0 text-light">Physical Information</h5>
                </div>
                <div className="card-body">
                  <InfoRow label="Height" value={user.height} />
                  <InfoRow label="Weight" value={user.weight} />
                </div>
              </div>

              <div className="card bg-black border-0 shadow-sm mb-4">
                <div className="card-header border-secondary">
                  <h5 className="mb-0 text-light">Professional & Personal Details</h5>
                </div>
                <div className="card-body">
                  <InfoRow label="Ethnicity" value={user.ethnicity || '-'} />
                  <InfoRow label="Religion" value={user.religion || '-'} />
                  <InfoRow label="Education" value={user.education || '-'} />
                  <InfoRow label="Occupation" value={user.occupation || '-'} />
                  <InfoRow label="Qualifications" value={user.qualifications || '-'} />
                  <InfoRow label="Hobbies" value={user.hobbies || '-'} />
                </div>
              </div>

              <div className="card bg-black border-0 shadow-sm mb-4">
                <div className="card-header border-secondary">
                  <h5 className="mb-0 text-light">About Me</h5>
                </div>
                <div className="card-body">
                  <div className="text-light" style={{ whiteSpace: 'pre-wrap', minHeight: '100px' }}>
                    {user.aboutMe || <span className="text-secondary">No description provided</span>}
                  </div>
                </div>
              </div>

              <div className="card bg-black border-0 shadow-sm">
                <div className="card-header border-secondary">
                  <h5 className="mb-0 text-light">Account Information</h5>
                </div>
                <div className="card-body">
                  <InfoRow label="User ID" value={user.id || user._id} />
                  <InfoRow label="Role" value={<span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>{user.role || 'user'}</span>} />
                  <InfoRow label="Created At" value={user.createdAt ? formatDate(user.createdAt) : '-'} />
                  <InfoRow label="Updated At" value={user.updatedAt ? formatDate(user.updatedAt) : '-'} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

