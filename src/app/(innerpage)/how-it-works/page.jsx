import React from 'react';

export default function HowItWorksPage() {
  return (
    <div className="container-fluid min-vh-100 py-5" style={{ backgroundColor: '#fff0f8' }}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="mb-4">
                <div className="text-center mb-5">
                  <h1 className="display-4 fw-bold mb-3" style={{ color: '#9b1b5a' }}>How It Works</h1>
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
                    At Delbari, we understand that both finding a life partner and planning a wedding are some of the most meaningful journeys you&apos;ll ever take. That&apos;s why we created a space where you can do both with ease.
                  </p>
                  <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                    If you&apos;re looking for a partner, you can create a profile with trust and privacy, connect with families in a respectful, faith based way and take the next step toward Nikah with confidence.
                  </p>
                  <p style={{ fontSize: '1.1rem', marginBottom: '0' }}>
                    And if you&apos;re preparing for your big day, Delbari is here to support you by connecting you with trusted vendors—from venues and photographers to makeup artists and more—so you can plan your wedding with peace of mind and celebrate knowing every detail is in good hands.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

