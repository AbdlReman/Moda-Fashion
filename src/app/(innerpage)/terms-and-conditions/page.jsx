import React from 'react';

export default function TermsAndConditionsPage() {
  return (
    <div className="container-fluid min-vh-100 py-5" style={{ backgroundColor: '#fff0f8' }}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="mb-4">
                <div className="text-center mb-5">
                  <h1 className="display-4 fw-bold mb-3" style={{ color: '#9b1b5a' }}>Terms and Conditions</h1>
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
                    By using Delbari, you agree to comply with our terms and conditions. The platform provides matrimonial and wedding directory services for individuals and vendors in Australia, and users must provide accurate and truthful information when creating profiles or listings.
                  </p>
                  <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                    All users are expected to communicate respectfully and use appropriate language in line with Islamic values. Posting content, including photos, that is inappropriate or not in accordance with Islamic principles is strictly prohibited; accounts found violating this may be suspended or permanently banned.
                  </p>
                  <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                    You are responsible for maintaining the confidentiality of your account, and any activities conducted through your account are your responsibility. Delbari is not liable for the actions of other users, the accuracy of profiles, or the quality of vendor services, and we encourage users to exercise caution and due diligence.
                  </p>
                  <p style={{ fontSize: '1.1rem', marginBottom: '0' }}>
                    Payments, subscriptions, and bookings through the platform are subject to applicable terms. By using the website, you consent to these terms and acknowledge that your use of the platform is at your own risk.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

