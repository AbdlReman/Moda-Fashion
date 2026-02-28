'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Step 2
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
    
    // Step 3
    profilePhoto: null,
    identityDocument: null,
    aboutMe: ''
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState({
    profilePhoto: null,
    identityDocument: null
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    // Handle file uploads with preview
    if (files && files[0]) {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(prev => ({
            ...prev,
            [name]: reader.result
          }));
        };
        reader.readAsDataURL(file);
      } else {
        // For PDFs, just show the filename
        setImagePreview(prev => ({
          ...prev,
          [name]: null
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.education) newErrors.education = 'Education is required';
    if (!formData.height) newErrors.height = 'Height is required';
    if (!formData.weight) newErrors.weight = 'Weight is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    else {
      const selected = new Date(formData.dateOfBirth);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selected.setHours(0, 0, 0, 0);
      if (selected > today) newErrors.dateOfBirth = 'Date of birth cannot be in the future';
    }
    if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital status is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    
    if (!formData.profilePhoto) newErrors.profilePhoto = 'Profile photo is required';
    if (!formData.identityDocument) newErrors.identityDocument = 'Identity document is required';
    if (!formData.aboutMe.trim()) newErrors.aboutMe = 'About me is required';
    else if (formData.aboutMe.trim().length < 50) newErrors.aboutMe = 'About me must be at least 50 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    
    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    }
    
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep3()) return;
    
    try {
      const body = new FormData();
      body.append('firstName', formData.firstName);
      body.append('lastName', formData.lastName);
      body.append('email', formData.email);
      body.append('password', formData.password);
      body.append('country', formData.country);
      body.append('education', formData.education);
      body.append('height', formData.height);
      body.append('weight', formData.weight);
      body.append('dateOfBirth', formData.dateOfBirth);
      body.append('maritalStatus', formData.maritalStatus);
      body.append('gender', formData.gender);
      body.append('ethnicity', formData.ethnicity);
      body.append('religion', formData.religion);
      body.append('hobbies', formData.hobbies);
      body.append('qualifications', formData.qualifications);
      body.append('occupation', formData.occupation);
      body.append('aboutMe', formData.aboutMe);
      if (formData.profilePhoto) body.append('profilePhoto', formData.profilePhoto);
      if (formData.identityDocument) body.append('identityDocument', formData.identityDocument);

      const res = await fetch('/api/register', {
        method: 'POST',
        body,
      });

      const data = await res.json();
      if (!res.ok) {
        const errorMsg = data.details 
          ? `${data.error}: ${data.details}` 
          : data.error || 'Registration failed';
        alert(errorMsg);
        console.error('Registration error:', data);
        return;
      }

      alert('Registration successful! Welcome to our matrimonial platform.');
      // Redirect to login after successful registration
      router.push('/login');
    } catch (err) {
      alert('Something went wrong. Please try again.');
    }
  };

  const renderStep1 = () => (
    <div className="">
      <div className="text-center mb-8">
        <h2 className="h4 fw-semibold text-dark mb-1">Basic Information</h2>
        <p className="text-muted mb-0">Tell us about yourself</p>
      </div>

      <div className="row g-3">
        <div>
          <label className="form-label">
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
            placeholder="Enter your first name"
          />
          {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
        </div>

        <div>
          <label className="form-label">
            Last Name *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
            placeholder="Enter your last name"
          />
          {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
        </div>
      </div>

      <div>
        <label className="form-label">
          Email Address *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          placeholder="Enter your email address"
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>

      <div className="row g-3">
        <div>
          <label className="form-label">
            Password *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            placeholder="Create a password"
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>

        <div>
          <label className="form-label">
            Confirm Password *
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="">
      <div className="text-center mb-8">
        <h2 className="h4 fw-semibold text-dark mb-1">Personal Details</h2>
        <p className="text-muted mb-0">Help us understand you better</p>
      </div>

      <div className="row g-3">
        <div>
          <label className="form-label">
            Country *
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className={`form-select ${errors.country ? 'is-invalid' : ''}`}
          >
            <option value="">Select Country</option>
            <option value="USA">United States</option>
            <option value="Canada">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="India">India</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
            <option value="Other">Other</option>
          </select>
          {errors.country && <div className="invalid-feedback">{errors.country}</div>}
        </div>

        <div>
          <label className="form-label">
            Education *
          </label>
          <select
            name="education"
            value={formData.education}
            onChange={handleInputChange}
            className={`form-select ${errors.education ? 'is-invalid' : ''}`}
          >
            <option value="">Select Education</option>
            <option value="High School">High School</option>
            <option value="Bachelor's Degree">Bachelor&apos;s Degree</option>
            <option value="Master's Degree">Master&apos;s Degree</option>
            <option value="PhD">PhD</option>
            <option value="Professional Degree">Professional Degree</option>
            <option value="Other">Other</option>
          </select>
          {errors.education && <div className="invalid-feedback">{errors.education}</div>}
        </div>

        <div>
          <label className="form-label">
            Ethnicity
          </label>
          <input
            type="text"
            name="ethnicity"
            value={formData.ethnicity}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Enter your ethnicity"
          />
        </div>
      </div>

      <div className="row g-3">
        <div>
          <label className="form-label">
            Religion
          </label>
          <select
            name="religion"
            value={formData.religion}
            onChange={handleInputChange}
            className="form-select"
          >
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

        <div>
          <label className="form-label">
            Occupation
          </label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Enter your occupation"
          />
        </div>
      </div>

      <div className="row g-3">
        <div>
          <label className="form-label">
            Qualifications
          </label>
          <input
            type="text"
            name="qualifications"
            value={formData.qualifications}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Enter your qualifications (e.g., CPA, PMP, etc.)"
          />
        </div>

        <div>
          <label className="form-label">
            Hobbies
          </label>
          <input
            type="text"
            name="hobbies"
            value={formData.hobbies}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Enter your hobbies (comma-separated)"
          />
        </div>
      </div>

      <div className="row g-3">
        <div>
          <label className="form-label">
            Height *
          </label>
          <select
            name="height"
            value={formData.height}
            onChange={handleInputChange}
            className={`form-select ${errors.height ? 'is-invalid' : ''}`}
          >
            <option value="">Select Height</option>
            <option value="4'6\">4&apos;6&quot; (137 cm)</option>
            <option value="4'7\">4&apos;7&quot; (140 cm)</option>
            <option value="4'8\">4&apos;8&quot; (142 cm)</option>
            <option value="4'9\">4&apos;9&quot; (145 cm)</option>
            <option value="4'10\">4&apos;10&quot; (147 cm)</option>
            <option value="4'11\">4&apos;11&quot; (150 cm)</option>
            <option value="5'0\">5&apos;0&quot; (152 cm)</option>
            <option value="5'1\">5&apos;1&quot; (155 cm)</option>
            <option value="5'2\">5&apos;2&quot; (157 cm)</option>
            <option value="5'3\">5&apos;3&quot; (160 cm)</option>
            <option value="5'4\">5&apos;4&quot; (163 cm)</option>
            <option value="5'5\">5&apos;5&quot; (165 cm)</option>
            <option value="5'6\">5&apos;6&quot; (168 cm)</option>
            <option value="5'7\">5&apos;7&quot; (170 cm)</option>
            <option value="5'8\">5&apos;8&quot; (173 cm)</option>
            <option value="5'9\">5&apos;9&quot; (175 cm)</option>
            <option value="5'10\">5&apos;10&quot; (178 cm)</option>
            <option value="5'11\">5&apos;11&quot; (180 cm)</option>
            <option value="6'0\">6&apos;0&quot; (183 cm)</option>
            <option value="6'1\">6&apos;1&quot; (185 cm)</option>
            <option value="6'2\">6&apos;2&quot; (188 cm)</option>
            <option value="6'3\">6&apos;3&quot; (190 cm)</option>
            <option value="6'4\">6&apos;4&quot; (193 cm)</option>
            <option value="6'5\">6&apos;5&quot; (196 cm)</option>
            <option value="6'6\">6&apos;6&quot; (198 cm)</option>
            <option value="6'7\">6&apos;7&quot; (201 cm)</option>
            <option value="6'8\">6&apos;8&quot; (203 cm)</option>
          </select>
          {errors.height && <div className="invalid-feedback">{errors.height}</div>}
        </div>

        <div>
          <label className="form-label">
            Weight *
          </label>
          <select
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            className={`form-select ${errors.weight ? 'is-invalid' : ''}`}
          >
            <option value="">Select Weight</option>
            <option value="80-90 lbs">80-90 lbs (36-41 kg)</option>
            <option value="90-100 lbs">90-100 lbs (41-45 kg)</option>
            <option value="100-110 lbs">100-110 lbs (45-50 kg)</option>
            <option value="110-120 lbs">110-120 lbs (50-54 kg)</option>
            <option value="120-130 lbs">120-130 lbs (54-59 kg)</option>
            <option value="130-140 lbs">130-140 lbs (59-64 kg)</option>
            <option value="140-150 lbs">140-150 lbs (64-68 kg)</option>
            <option value="150-160 lbs">150-160 lbs (68-73 kg)</option>
            <option value="160-170 lbs">160-170 lbs (73-77 kg)</option>
            <option value="170-180 lbs">170-180 lbs (77-82 kg)</option>
            <option value="180-190 lbs">180-190 lbs (82-86 kg)</option>
            <option value="190-200 lbs">190-200 lbs (86-91 kg)</option>
            <option value="200-210 lbs">200-210 lbs (91-95 kg)</option>
            <option value="210-220 lbs">210-220 lbs (95-100 kg)</option>
            <option value="220+ lbs">220+ lbs (100+ kg)</option>
          </select>
          {errors.weight && <div className="invalid-feedback">{errors.weight}</div>}
        </div>
      </div>

      <div>
        <label className="form-label">
          Date of Birth *
        </label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          max={new Date().toISOString().split('T')[0]}
          className={`form-control ${errors.dateOfBirth ? 'is-invalid' : ''}`}
        />
        {errors.dateOfBirth && <div className="invalid-feedback">{errors.dateOfBirth}</div>}
      </div>

      <div className="row g-3">
        <div>
          <label className="form-label">
            Marital Status *
          </label>
          <select
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleInputChange}
            className={`form-select ${errors.maritalStatus ? 'is-invalid' : ''}`}
          >
            <option value="">Select Marital Status</option>
            <option value="Never Married">Never Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
            <option value="Separated">Separated</option>
          </select>
          {errors.maritalStatus && <div className="invalid-feedback">{errors.maritalStatus}</div>}
        </div>

        <div>
          <label className="form-label">
            Gender *
          </label>
          <div className="d-flex gap-4">
            <label className="d-flex align-items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={formData.gender === 'Male'}
                onChange={handleInputChange}
                className="form-check-input"
              />
              ♂️ 
              Male
            </label>
            <label className="d-flex align-items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={formData.gender === 'Female'}
                onChange={handleInputChange}
                className="form-check-input"
              />
              ♀️ 
              Female
            </label>
          </div>
          {errors.gender && <div className="invalid-feedback d-block">{errors.gender}</div>}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="">
      <div className="text-center mb-8">
        <h2 className="h4 fw-semibold text-dark mb-1">Complete Your Profile</h2>
        <p className="text-muted mb-0">Add photos and tell us about yourself</p>
      </div>

      <div className="row g-3">
        <div>
          <label className="form-label">
            Upload Profile Photo *
          </label>
          <div className="border border-2 border-dashed rounded p-4 text-center">
            <input
              type="file"
              name="profilePhoto"
              onChange={handleInputChange}
              accept="image/*"
              className="d-none"
              id="profilePhoto"
            />
            <label htmlFor="profilePhoto" className="cursor-pointer w-100">
              {imagePreview.profilePhoto ? (
                <div>
                  <img 
                    src={imagePreview.profilePhoto} 
                    alt="Profile preview" 
                    className="img-thumbnail mb-2"
                    style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                  />
                  <p className="text-muted small mb-1">{formData.profilePhoto?.name}</p>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData(prev => ({ ...prev, profilePhoto: null }));
                      setImagePreview(prev => ({ ...prev, profilePhoto: null }));
                      document.getElementById('profilePhoto').value = '';
                    }}
                  >
                    Change Photo
                  </button>
                </div>
              ) : (
                <>
                  <div className="mx-auto fs-1 text-muted mb-2">📷</div>
                  <p className="text-muted mb-1">Click to upload profile photo</p>
                  <p className="small text-muted">PNG, JPG up to 5MB</p>
                </>
              )}
            </label>
          </div>
          {errors.profilePhoto && <div className="invalid-feedback d-block">{errors.profilePhoto}</div>}
        </div>

        <div>
          <label className="form-label">
            Upload Identity Document *
          </label>
          <div className="border border-2 border-dashed rounded p-4 text-center">
            <input
              type="file"
              name="identityDocument"
              onChange={handleInputChange}
              accept="image/*,.pdf"
              className="d-none"
              id="identityDocument"
            />
            <label htmlFor="identityDocument" className="cursor-pointer w-100">
              {imagePreview.identityDocument ? (
                <div>
                  <img 
                    src={imagePreview.identityDocument} 
                    alt="Document preview" 
                    className="img-thumbnail mb-2"
                    style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                  />
                  <p className="text-muted small mb-1">{formData.identityDocument?.name}</p>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData(prev => ({ ...prev, identityDocument: null }));
                      setImagePreview(prev => ({ ...prev, identityDocument: null }));
                      document.getElementById('identityDocument').value = '';
                    }}
                  >
                    Change Document
                  </button>
                </div>
              ) : formData.identityDocument ? (
                <div>
                  <div className="mx-auto fs-1 text-muted mb-2">📄</div>
                  <p className="text-success small mb-1">✓ {formData.identityDocument.name}</p>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData(prev => ({ ...prev, identityDocument: null }));
                      setImagePreview(prev => ({ ...prev, identityDocument: null }));
                      document.getElementById('identityDocument').value = '';
                    }}
                  >
                    Change Document
                  </button>
                </div>
              ) : (
                <>
                  <div className="mx-auto fs-1 text-muted mb-2">🆔</div>
                  <p className="text-muted mb-1">Click to upload ID document</p>
                  <p className="small text-muted">PNG, JPG, PDF up to 10MB</p>
                </>
              )}
            </label>
          </div>
          {errors.identityDocument && <div className="invalid-feedback d-block">{errors.identityDocument}</div>}
        </div>
      </div>

      <div>
        <label className="form-label">
          About Me *
        </label>
        <textarea
          name="aboutMe"
          value={formData.aboutMe}
          onChange={handleInputChange}
          rows={4}
          className={`form-control ${errors.aboutMe ? 'is-invalid' : ''}`}
          placeholder="Tell us about yourself..."
        />
        {errors.aboutMe && <div className="invalid-feedback">{errors.aboutMe}</div>}
      </div>
    </div>
  );

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3 py-4">
      <div className="w-100" style={{maxWidth: 560}}>
        {/* Card */}
        <div className="card shadow-lg border-0">
          <div className="card-body p-4 p-md-5">
            {/* Small logo and title */}
            <div className="text-center mb-4">
              <Link href="/" className="d-inline-flex align-items-center justify-content-center mb-2">
                <Image src="/assets/img/logo.png" alt="Logo" width={120} height={36} />
              </Link>
              <h1 className="h4 fw-bold text-dark mb-0">Create your account</h1>
              <div className="text-muted small mt-1">Enter your personal details to create account</div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="d-flex align-items-center">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="d-flex align-items-center flex-fill">
                    <div className={`rounded-circle d-flex align-items-center justify-content-center ${currentStep >= step ? 'bg-primary text-white' : 'bg-secondary bg-opacity-25 text-secondary'} `} style={{width:32,height:32,fontSize:14,fontWeight:600}}>
                      {step}
                    </div>
                    {step < 3 && (
                      <div className={`mx-2 flex-fill rounded`} style={{height:4, backgroundColor: currentStep > step ? 'var(--bs-primary)' : 'rgba(108,117,125,.25)'}}></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center text-muted small mt-2">Step {currentStep} of 3</div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Actions */}
              <div className="d-flex align-items-center justify-content-between mt-4 pt-4 border-top">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className={`btn ${currentStep === 1 ? 'btn-light disabled' : 'btn-outline-secondary'}`}
                >
                  Previous
                </button>

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn btn-primary"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Complete Registration
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Login link */}
        <p className="text-center text-muted mt-3 mb-0">
          Already have an account?{' '}
          <Link href="/login" className="text-primary fw-medium">Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
