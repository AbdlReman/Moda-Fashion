import React from 'react';

export default function OurMissionPage() {
  return (
    <div className="container-fluid min-vh-100 py-5" style={{ backgroundColor: '#fff0f8' }}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="mb-4">
                <div className="text-center mb-5">
                  <h1 className="display-4 fw-bold mb-3" style={{ color: '#9b1b5a' }}>Our Mission</h1>
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
                  <p style={{ fontSize: '1.1rem', marginBottom: '0' }}>
                    At Delbari, our mission is to create a trusted, respectful, and family-oriented community where individuals can find their life partners through faith-guided partner connections, and couples can plan their dream weddings with ease. We aim to connect hearts, honor traditions, and support local wedding vendors, making every step of the journey — from partner introductions to celebration — meaningful, safe, and stress-free.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

