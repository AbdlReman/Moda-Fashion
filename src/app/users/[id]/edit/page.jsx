'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

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

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id;

  const [form, setForm] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    education: '',
    height: '',
    weight: '',
    dateOfBirth: '',
    maritalStatus: '',
    gender: '',
    ethnicity: '',
    religion: '',
    hobbies: '',
    qualifications: '',
    occupation: '',
    aboutMe: '',
    role: 'user'
  });

  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);
  const [imagePreview, setImagePreview] = React.useState({
    profilePhoto: null,
    identityDocument: null
  });

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
  const [originalImages, setOriginalImages] = React.useState({
    profilePhotoUrl: null,
    identityDocumentUrl: null,
    profilePhotoPublicId: null,
    identityDocumentPublicId: null
  });

  React.useEffect(() => {
    async function load() {
      if (!userId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/users/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setForm({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            country: data.country || '',
            education: data.education || '',
            height: data.height || '',
            weight: data.weight || '',
            dateOfBirth: data.dateOfBirth || '',
            maritalStatus: data.maritalStatus || '',
            gender: data.gender || '',
            ethnicity: data.ethnicity || '',
            religion: data.religion || '',
            hobbies: data.hobbies || '',
            qualifications: data.qualifications || '',
            occupation: data.occupation || '',
            aboutMe: data.aboutMe || '',
            role: data.role || 'user'
          });
          
          // Store original images
          setOriginalImages({
            profilePhotoUrl: data.profilePhotoUrl || null,
            identityDocumentUrl: data.identityDocumentUrl || null,
            profilePhotoPublicId: data.profilePhotoPublicId || null,
            identityDocumentPublicId: data.identityDocumentPublicId || null
          });
          
          // Set image previews if URLs exist
          if (data.profilePhotoUrl) {
            setImagePreview(prev => ({ ...prev, profilePhoto: data.profilePhotoUrl }));
          }
          if (data.identityDocumentUrl) {
            setImagePreview(prev => ({ ...prev, identityDocument: data.identityDocumentUrl }));
          }
        }
      } catch (e) {
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId]);

  const onChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files && files[0]) {
      const file = files[0];
      setForm((f) => ({ ...f, [name]: file }));
      
      // Handle file preview
      if (file.type.startsWith('image/')) {
        // Create preview for images
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(prev => ({
            ...prev,
            [name]: reader.result
          }));
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        // For PDFs, show a placeholder with the file name
        setImagePreview(prev => ({
          ...prev,
          [name]: null // Clear image preview for PDFs
        }));
        // You could also show a data URL of a PDF icon here
      } else {
        setImagePreview(prev => ({
          ...prev,
          [name]: null
        }));
      }
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('firstName', form.firstName);
      formData.append('lastName', form.lastName);
      formData.append('email', form.email);
      formData.append('country', form.country);
      formData.append('education', form.education);
      formData.append('height', form.height);
      formData.append('weight', form.weight);
      formData.append('dateOfBirth', form.dateOfBirth);
      formData.append('maritalStatus', form.maritalStatus);
      formData.append('gender', form.gender);
      formData.append('ethnicity', form.ethnicity);
      formData.append('religion', form.religion);
      formData.append('hobbies', form.hobbies);
      formData.append('qualifications', form.qualifications);
      formData.append('occupation', form.occupation);
      formData.append('aboutMe', form.aboutMe);
      formData.append('role', form.role);
      
      // Only append files if they are actual File objects and have content
      if (form.profilePhoto instanceof File && form.profilePhoto.size > 0) {
        console.log('Appending profile photo to FormData:', {
          name: form.profilePhoto.name,
          size: form.profilePhoto.size,
          type: form.profilePhoto.type
        });
        formData.append('profilePhoto', form.profilePhoto);
      } else if (form.profilePhoto !== null && form.profilePhoto !== undefined) {
        console.warn('profilePhoto is not a valid File:', {
          type: typeof form.profilePhoto,
          isFile: form.profilePhoto instanceof File,
          hasSize: form.profilePhoto?.size
        });
      }
      
      if (form.identityDocument instanceof File && form.identityDocument.size > 0) {
        console.log('Appending identity document to FormData:', {
          name: form.identityDocument.name,
          size: form.identityDocument.size,
          type: form.identityDocument.type
        });
        formData.append('identityDocument', form.identityDocument);
      } else if (form.identityDocument !== null && form.identityDocument !== undefined) {
        console.warn('identityDocument is not a valid File:', {
          type: typeof form.identityDocument,
          isFile: form.identityDocument instanceof File,
          hasSize: form.identityDocument?.size
        });
      }

      console.log('Submitting form with:', {
        userId,
        hasProfilePhoto: form.profilePhoto instanceof File,
        hasIdentityDocument: form.identityDocument instanceof File,
        profilePhotoSize: form.profilePhoto instanceof File ? form.profilePhoto.size : 0,
        identityDocumentSize: form.identityDocument instanceof File ? form.identityDocument.size : 0
      });

      const res = await fetch(`/api/users/${userId}`, { 
        method: 'PUT', 
        body: formData 
      });
      
      const responseData = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        const errorMessage = responseData?.error 
          ? `${responseData.message || 'Failed to update user'}: ${responseData.error}` 
          : responseData?.message || 'Failed to update user';
        setError(errorMessage);
        setSubmitting(false);
        
        // Log error details for debugging
        console.error('❌ Update failed:', {
          status: res.status,
          statusText: res.statusText,
          error: responseData,
          file1: form.profilePhoto instanceof File ? {
            name: form.profilePhoto.name,
            size: form.profilePhoto.size,
            type: form.profilePhoto.type
          } : 'none',
          file2: form.identityDocument instanceof File ? {
            name: form.identityDocument.name,
            size: form.identityDocument.size,
            type: form.identityDocument.type
          } : 'none'
        });
        return;
      }
      
      console.log('✅ Update successful:', responseData);
      
      // Refresh the user data to show updated images
      router.refresh();
      router.push(`/users/${userId}`);
    } catch (e) {
      setError('Failed to update user');
      setSubmitting(false);
    }
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
            <h1 className="h4 mb-0">Edit User</h1>
            <Link href={`/users/${userId}`} className="btn btn-outline-secondary text-light">Cancel</Link>
          </div>

          <form className="card bg-black border-0 shadow-sm" onSubmit={onSubmit}>
            <div className="card-body">
              {loading ? (
                <div className="text-secondary">Loading...</div>
              ) : (
                <>
                  {error && <div className="alert alert-danger">{error}</div>}
                  
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label">First Name *</label>
                      <input className="form-control bg-dark text-light border-secondary" name="firstName" value={form.firstName} onChange={onChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Last Name *</label>
                      <input className="form-control bg-dark text-light border-secondary" name="lastName" value={form.lastName} onChange={onChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email *</label>
                      <input type="email" className="form-control bg-dark text-light border-secondary" name="email" value={form.email} onChange={onChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Role</label>
                      <select className="form-select bg-dark text-light border-secondary" name="role" value={form.role} onChange={onChange}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>

                  <hr className="border-secondary" />

                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label">Country</label>
                      <input className="form-control bg-dark text-light border-secondary" name="country" value={form.country} onChange={onChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Education</label>
                      <input className="form-control bg-dark text-light border-secondary" name="education" value={form.education} onChange={onChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Height</label>
                      <input className="form-control bg-dark text-light border-secondary" name="height" value={form.height} onChange={onChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Weight</label>
                      <input className="form-control bg-dark text-light border-secondary" name="weight" value={form.weight} onChange={onChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Date of Birth</label>
                      <input type="date" className="form-control bg-dark text-light border-secondary" name="dateOfBirth" value={form.dateOfBirth} onChange={onChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Marital Status</label>
                      <select className="form-select bg-dark text-light border-secondary" name="maritalStatus" value={form.maritalStatus} onChange={onChange}>
                        <option value="">Select Status</option>
                        <option value="Never Married">Never Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                        <option value="Separated">Separated</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Gender</label>
                      <select className="form-select bg-dark text-light border-secondary" name="gender" value={form.gender} onChange={onChange}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>

                  <hr className="border-secondary" />

                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label">Ethnicity</label>
                      <input className="form-control bg-dark text-light border-secondary" name="ethnicity" value={form.ethnicity} onChange={onChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Religion</label>
                      <select className="form-select bg-dark text-light border-secondary" name="religion" value={form.religion} onChange={onChange}>
                        <option value="">Select Religion</option>
                        <option value="Christianity">Christianity</option>
                        <option value="Islam">Islam</option>
                        <option value="Hinduism">Hinduism</option>
                        <option value="Buddhism">Buddhism</option>
                        <option value="Sikhism">Sikhism</option>
                        <option value="Judaism">Judaism</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Occupation</label>
                      <input className="form-control bg-dark text-light border-secondary" name="occupation" value={form.occupation} onChange={onChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Qualifications</label>
                      <input className="form-control bg-dark text-light border-secondary" name="qualifications" value={form.qualifications} onChange={onChange} placeholder="e.g., CPA, PMP, etc." />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Hobbies</label>
                      <input className="form-control bg-dark text-light border-secondary" name="hobbies" value={form.hobbies} onChange={onChange} placeholder="Comma-separated hobbies" />
                    </div>
                  </div>

                  <hr className="border-secondary" />

                  <div className="mb-4">
                    <label className="form-label">About Me</label>
                    <textarea className="form-control bg-dark text-light border-secondary" name="aboutMe" value={form.aboutMe} onChange={onChange} rows={5} />
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label">Profile Photo</label>
                      <div className="border border-secondary rounded p-3" style={{ background: '#0b0f17' }}>
                        {imagePreview.profilePhoto ? (
                          <div className="text-center">
                            <div className="position-relative d-inline-block mb-2">
                              <img 
                                src={imagePreview.profilePhoto} 
                                alt="Profile preview" 
                                className="img-thumbnail rounded"
                                style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                              />
                              {originalImages.profilePhotoUrl && (
                                <span className="badge bg-info position-absolute top-0 start-0 m-1">Current</span>
                              )}
                              {!originalImages.profilePhotoUrl && form.profilePhoto instanceof File && (
                                <span className="badge bg-success position-absolute top-0 start-0 m-1">New</span>
                              )}
                            </div>
                            <div className="d-flex gap-2 justify-content-center">
                              <label className="btn btn-sm btn-outline-primary mb-0">
                                Change Photo
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  className="d-none" 
                                  name="profilePhoto" 
                                  onChange={onChange} 
                                />
                              </label>
                              <button 
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => {
                                  setForm(prev => ({ ...prev, profilePhoto: null }));
                                  setImagePreview(prev => ({ ...prev, profilePhoto: originalImages.profilePhotoUrl || null }));
                                  const input = document.querySelector('input[name="profilePhoto"]');
                                  if (input) input.value = '';
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="mb-2">
                              <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-secondary bg-opacity-25" style={{ width: 80, height: 80 }}>
                                <span className="fs-1">📷</span>
                              </div>
                            </div>
                            <label className="btn btn-sm btn-primary mb-0">
                              Upload Photo
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="d-none" 
                                name="profilePhoto" 
                                onChange={onChange} 
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Identity Document</label>
                      <div className="border border-secondary rounded p-3" style={{ background: '#0b0f17' }}>
                        {imagePreview.identityDocument || (form.identityDocument instanceof File && (form.identityDocument.type === 'application/pdf' || form.identityDocument.name.toLowerCase().endsWith('.pdf'))) || (originalImages.identityDocumentUrl && originalImages.identityDocumentUrl.toLowerCase().includes('pdf')) ? (
                          <div className="text-center">
                            {/* Show PDF indicator */}
                            {(form.identityDocument instanceof File && (form.identityDocument.type === 'application/pdf' || form.identityDocument.name.toLowerCase().endsWith('.pdf'))) || 
                             (originalImages.identityDocumentUrl && originalImages.identityDocumentUrl.toLowerCase().includes('pdf')) ||
                             (imagePreview.identityDocument && !imagePreview.identityDocument.startsWith('data:') && imagePreview.identityDocument.toLowerCase().includes('pdf')) ? (
                              <div>
                                <div className="mb-2">
                                  <div className="d-inline-flex align-items-center justify-content-center rounded bg-secondary bg-opacity-25 p-3">
                                    <span className="fs-1">📄</span>
                                  </div>
                                </div>
                                {originalImages.identityDocumentUrl && (
                                  <div className="mb-2">
                                    <a 
                                      href={originalImages.identityDocumentUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="btn btn-sm btn-outline-info mb-2"
                                    >
                                      View Current Document
                                    </a>
                                  </div>
                                )}
                                {form.identityDocument instanceof File && (
                                  <div className="mb-2">
                                    <p className="text-success small mb-0">✓ {form.identityDocument.name}</p>
                                    <span className="badge bg-success">New Upload</span>
                                  </div>
                                )}
                                <div className="d-flex gap-2 justify-content-center">
                                  <label className="btn btn-sm btn-outline-primary mb-0">
                                    Change Document
                                    <input 
                                      type="file" 
                                      accept="image/*,.pdf" 
                                      className="d-none" 
                                      name="identityDocument" 
                                      onChange={onChange} 
                                    />
                                  </label>
                                  <button 
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => {
                                      setForm(prev => ({ ...prev, identityDocument: null }));
                                      setImagePreview(prev => ({ ...prev, identityDocument: originalImages.identityDocumentUrl || null }));
                                      const input = document.querySelector('input[name="identityDocument"]');
                                      if (input) input.value = '';
                                    }}
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="position-relative d-inline-block mb-2">
                                  <img 
                                    src={imagePreview.identityDocument} 
                                    alt="Document preview" 
                                    className="img-thumbnail rounded"
                                    style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                                  />
                                  {originalImages.identityDocumentUrl && (
                                    <span className="badge bg-info position-absolute top-0 start-0 m-1">Current</span>
                                  )}
                                  {!originalImages.identityDocumentUrl && form.identityDocument instanceof File && (
                                    <span className="badge bg-success position-absolute top-0 start-0 m-1">New</span>
                                  )}
                                </div>
                                <div className="d-flex gap-2 justify-content-center">
                                  <label className="btn btn-sm btn-outline-primary mb-0">
                                    Change Document
                                    <input 
                                      type="file" 
                                      accept="image/*,.pdf" 
                                      className="d-none" 
                                      name="identityDocument" 
                                      onChange={onChange} 
                                    />
                                  </label>
                                  <button 
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => {
                                      setForm(prev => ({ ...prev, identityDocument: null }));
                                      setImagePreview(prev => ({ ...prev, identityDocument: originalImages.identityDocumentUrl || null }));
                                      const input = document.querySelector('input[name="identityDocument"]');
                                      if (input) input.value = '';
                                    }}
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="mb-2">
                              <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-secondary bg-opacity-25" style={{ width: 80, height: 80 }}>
                                <span className="fs-1">🆔</span>
                              </div>
                            </div>
                            <label className="btn btn-sm btn-primary mb-0">
                              Upload Document
                              <input 
                                type="file" 
                                accept="image/*,.pdf" 
                                className="d-none" 
                                name="identityDocument" 
                                onChange={onChange} 
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="card-footer d-flex justify-content-end gap-2 border-secondary">
              <Link href={`/users/${userId}`} className="btn btn-outline-secondary text-light">Cancel</Link>
              <button className="btn btn-primary" disabled={submitting || loading}>
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
