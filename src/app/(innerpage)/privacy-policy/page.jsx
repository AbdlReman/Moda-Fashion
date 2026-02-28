import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container-fluid min-vh-100 py-5" style={{ backgroundColor: '#fff0f8' }}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="mb-4">
                <div className="text-center mb-5">
                  <h1 className="display-4 fw-bold mb-3" style={{ color: '#9b1b5a' }}>Privacy Policy</h1>
                  <div className="mx-auto" style={{ width: '80px', height: '4px', backgroundColor: '#ff4da6', borderRadius: '2px' }}></div>
                </div>
                <div className="content-section" style={{ 
                  backgroundColor: '#fff', 
                  padding: '2rem', 
                  borderRadius: '10px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  lineHeight: '1.8',
                  color: '#636363'
                }}>
                  <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                    At Delbari, we value your privacy and are committed to protecting your personal information. We collect details such as your name, contact information, profile data, and payment information to provide our matrimonial and wedding directory services, connect you with matches and vendors, and improve your experience on our platform.
                  </p>
                  <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                    Your information is kept secure and is never sold; it may only be shared with trusted vendors, service providers, or when required by law. We use cookies to enhance your browsing experience, and you have the right to access, correct, or request deletion of your personal data in accordance with Australian privacy laws.
                  </p>
                  <p style={{ fontSize: '1.1rem', marginBottom: '0' }}>
                    By using Delbari, you consent to the collection and use of your information as outlined in this policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

