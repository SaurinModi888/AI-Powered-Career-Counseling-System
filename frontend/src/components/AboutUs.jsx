import React from 'react';

export const AboutUs = () => {
  return (
    <section 
      id="about"
      style={{
        background: 'linear-gradient(135deg, #00296b 0%, #0077b6 100%)',
        padding: '90px 20px',
        color: 'white'
      }}
    >
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '40px',
        alignItems: 'center'
      }}>
        {/* Left image container matching 08_about_us_section.png */}
        <div style={{
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
          height: '400px'
        }}>
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop" 
            alt="PathFinder AI Team"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Right card matching 08_about_us_section.png */}
        <div className="card" style={{
          backgroundColor: 'white',
          color: '#1e293b',
          padding: '48px 40px',
          textAlign: 'center',
          borderRadius: '20px'
        }}>
          <h2 style={{
            fontSize: '2.4rem',
            fontWeight: 800,
            color: '#0077b6',
            marginBottom: '24px'
          }}>
            About Us
          </h2>

          <p style={{
            fontSize: '1rem',
            lineHeight: 1.7,
            color: '#334155',
            marginBottom: '20px'
          }}>
            <strong>PathFinder AI</strong> is an innovative career guidance platform powered by artificial intelligence. We provide personalized recommendations based on your skills, interests, and academic background.
          </p>

          <p style={{
            fontSize: '0.98rem',
            lineHeight: 1.7,
            color: '#64748b'
          }}>
            Our mission is to empower individuals with data-driven insights, helping them make informed career decisions. Whether you're a student, a professional looking for a change, or someone exploring new opportunities, <strong>PathFinder AI</strong> is here to guide you every step of the way.
          </p>
        </div>
      </div>
    </section>
  );
};
