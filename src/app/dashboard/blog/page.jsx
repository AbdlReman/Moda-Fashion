'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '../page';

const BlogManagement = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    const userToken = localStorage.getItem('userToken');
    if (!userToken || userRole !== 'admin') {
      router.push('/login');
      return;
    }
    fetchBlogs();
  }, [router]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/blog?limit=100');
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.items || []);
      }
    } catch (e) {
      console.error('Error fetching blogs:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => b._id !== id));
      } else {
        alert('Failed to delete blog post');
      }
    } catch {
      alert('Error deleting blog post');
    } finally {
      setDeleting(null);
    }
  };

  const togglePublish = async (blog) => {
    try {
      const res = await fetch(`/api/blog/${blog._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !blog.isPublished }),
      });
      if (res.ok) {
        setBlogs((prev) =>
          prev.map((b) =>
            b._id === blog._id ? { ...b, isPublished: !b.isPublished } : b
          )
        );
      }
    } catch {
      alert('Error updating blog post');
    }
  };

  return (
    <div className="container-fluid g-0 bg-dark text-light min-vh-100">
      <div className="d-flex">
        <Sidebar />
        <main className="flex-grow-1 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h4 mb-0">Blog Management</h1>
            <Link href="/dashboard/blog/new" className="btn btn-primary">
              + New Post
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="card bg-black border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <h5 className="text-secondary mb-3">No blog posts yet</h5>
                <Link href="/dashboard/blog/new" className="btn btn-primary">
                  Create Your First Post
                </Link>
              </div>
            </div>
          ) : (
            <div className="card bg-black border-0 shadow-sm">
              <div className="table-responsive">
                <table className="table table-dark table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((blog) => (
                      <tr key={blog._id}>
                        <td>
                          <div className="fw-semibold">{blog.title}</div>
                          <small className="text-secondary">/{blog.slug}</small>
                        </td>
                        <td>
                          <span className="badge bg-secondary">{blog.category}</span>
                        </td>
                        <td>
                          <span
                            className={`badge ${blog.isPublished ? 'bg-success' : 'bg-warning text-dark'}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => togglePublish(blog)}
                          >
                            {blog.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td>
                          <small>
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </small>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Link
                              href={`/dashboard/blog/${blog._id}`}
                              className="btn btn-sm btn-outline-primary"
                            >
                              Edit
                            </Link>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(blog._id, blog.title)}
                              disabled={deleting === blog._id}
                            >
                              {deleting === blog._id ? '...' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BlogManagement;
