'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Editor } from '@tinymce/tinymce-react';
import { Sidebar } from '../../page';

const EditBlogPost = () => {
  const router = useRouter();
  const { id } = useParams();
  const editorRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    category: 'General',
    tags: '',
    featuredImage: '',
    author: 'Admin',
    isPublished: false,
    content: '',
  });

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    const userToken = localStorage.getItem('userToken');
    if (!userToken || userRole !== 'admin') {
      router.push('/login');
      return;
    }
    fetchBlog();
  }, [router, id]);

  const fetchBlog = async () => {
    try {
      const res = await fetch(`/api/blog/${id}`);
      if (res.ok) {
        const data = await res.json();
        setForm({
          title: data.title || '',
          slug: data.slug || '',
          excerpt: data.excerpt || '',
          category: data.category || 'General',
          tags: (data.tags || []).join(', '),
          featuredImage: data.featuredImage || '',
          author: data.author || 'Admin',
          isPublished: data.isPublished || false,
          content: data.content || '',
        });
      } else {
        alert('Blog post not found');
        router.push('/dashboard/blog');
      }
    } catch {
      alert('Error loading blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert('Please enter a title');
      return;
    }

    const content = editorRef.current ? editorRef.current.getContent() : form.content;
    if (!content.trim()) {
      alert('Please enter content');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        content,
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      const res = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/dashboard/blog');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update blog post');
      }
    } catch {
      alert('Error updating blog post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid g-0 bg-dark text-light min-vh-100">
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
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
            <h1 className="h4 mb-0">Edit Blog Post</h1>
            <Link href="/dashboard/blog" className="btn btn-outline-secondary text-light">
              Back to Blog List
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="card bg-black border-0 shadow-sm mb-4">
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        name="title"
                        className="form-control bg-dark text-light border-secondary"
                        value={form.title}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Slug</label>
                      <input
                        type="text"
                        name="slug"
                        className="form-control bg-dark text-light border-secondary"
                        value={form.slug}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Content</label>
                      <Editor
                        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        initialValue={form.content}
                        init={{
                          height: 500,
                          menubar: true,
                          skin: 'oxide-dark',
                          content_css: 'dark',
                          plugins: [
                            'advlist', 'autolink', 'lists', 'link', 'image',
                            'charmap', 'preview', 'anchor', 'searchreplace',
                            'visualblocks', 'code', 'fullscreen', 'insertdatetime',
                            'media', 'table', 'help', 'wordcount',
                          ],
                          toolbar:
                            'undo redo | blocks | bold italic forecolor | ' +
                            'alignleft aligncenter alignright alignjustify | ' +
                            'bullist numlist outdent indent | link image media | ' +
                            'removeformat | help',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card bg-black border-0 shadow-sm mb-4">
                  <div className="card-header border-secondary">
                    <h6 className="mb-0">Post Settings</h6>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">Excerpt</label>
                      <textarea
                        name="excerpt"
                        className="form-control bg-dark text-light border-secondary"
                        rows="3"
                        value={form.excerpt}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <input
                        type="text"
                        name="category"
                        className="form-control bg-dark text-light border-secondary"
                        value={form.category}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Tags (comma separated)</label>
                      <input
                        type="text"
                        name="tags"
                        className="form-control bg-dark text-light border-secondary"
                        value={form.tags}
                        onChange={handleChange}
                        placeholder="tag1, tag2, tag3"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Featured Image URL</label>
                      <input
                        type="text"
                        name="featuredImage"
                        className="form-control bg-dark text-light border-secondary"
                        value={form.featuredImage}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Author</label>
                      <input
                        type="text"
                        name="author"
                        className="form-control bg-dark text-light border-secondary"
                        value={form.author}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-check mb-3">
                      <input
                        type="checkbox"
                        name="isPublished"
                        className="form-check-input"
                        id="isPublished"
                        checked={form.isPublished}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="isPublished">
                        Published
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Update Post'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default EditBlogPost;
