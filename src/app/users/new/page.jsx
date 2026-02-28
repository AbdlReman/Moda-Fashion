'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function NewUserPage() {
  const router = useRouter();
  const [form, setForm] = React.useState({ name: '', email: '', phone: '', role: 'user' });
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const res = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.message || 'Failed to create user');
      setSubmitting(false);
      return;
    }
    router.push('/users');
  };

  return (
    <div className="container-fluid g-0 bg-dark text-light min-vh-100 p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 mb-0">Add User</h1>
      </div>
      <form className="card bg-black border-0 shadow-sm" onSubmit={onSubmit}>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input className="form-control bg-dark text-light" name="name" value={form.name} onChange={onChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input type="email" className="form-control bg-dark text-light" name="email" value={form.email} onChange={onChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input className="form-control bg-dark text-light" name="phone" value={form.phone} onChange={onChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Role</label>
              <select className="form-select bg-dark text-light" name="role" value={form.role} onChange={onChange}>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
              </select>
            </div>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-outline-secondary text-light" onClick={() => history.back()}>Cancel</button>
          <button className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save User'}</button>
        </div>
      </form>
    </div>
  );
}


