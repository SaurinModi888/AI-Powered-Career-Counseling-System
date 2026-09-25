import React from 'react';
import { Globe, Share2, MessageCircle, Send } from 'lucide-react';

export const Footer = ({ setActiveTab }) => {
  return (
    <footer style={{
      backgroundColor: '#001529',
      color: 'white',
      padding: '60px 20px 30px 20px',
      borderTop: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          marginBottom: '40px',
          textAlign: 'left'
        }}>
          {/* About Us Column */}
          <div>
            <h4 style={{ color: '#ffb703', fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>
              About Us
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              PathFinder helps individuals discover their true potential and pursue fulfilling careers with AI-powered guidance.
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 style={{ color: '#ffb703', fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.88rem' }}>
              <li style={{ marginBottom: '8px' }}>
                <a href="#home" onClick={() => setActiveTab('home')} style={{ color: '#cbd5e1', textDecoration: 'none' }}>Home</a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#about" onClick={() => setActiveTab('about')} style={{ color: '#cbd5e1', textDecoration: 'none' }}>about</a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#contact" onClick={() => setActiveTab('contact')} style={{ color: '#cbd5e1', textDecoration: 'none' }}>contact</a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 style={{ color: '#ffb703', fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>
              Contact
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginBottom: '8px' }}>
              Email: pathfinderai@gmail.com
            </p>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1' }}>
              Phone: +91 9876543210
            </p>
          </div>

          {/* Follow Us Column */}
          <div>
            <h4 style={{ color: '#ffb703', fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>
              Follow Us
            </h4>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ color: 'white' }}><Globe size={20} /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ color: 'white' }}><Share2 size={20} /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: 'white' }}><MessageCircle size={20} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: 'white' }}><Send size={20} /></a>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '24px',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: '#94a3b8'
        }}>
          © 2026 PathFinder AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
