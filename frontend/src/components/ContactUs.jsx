import React, { useState } from 'react';
import { Send, MapPin, Mail, Phone } from 'lucide-react';

export const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      alert('Thank you for contacting PathFinder AI! We will get back to you shortly.');
      setName('');
      setEmail('');
      setMessage('');
      setSubmitted(false);
    }, 500);
  };

  return (
    <section 
      id="contact"
      style={{
        background: 'linear-gradient(135deg, #001d3d 0%, #0077b6 100%)',
        padding: '90px 20px',
        color: 'white',
        textAlign: 'center'
      }}
    >
      <div className="container">
        {/* Main white card container matching 04_contact_us_page.png */}
        <div className="card" style={{
          backgroundColor: 'white',
          color: '#1e293b',
          padding: '48px 40px',
          borderRadius: '24px',
          maxWidth: '1000px',
          margin: '0 auto',
          boxShadow: '0 20px 45px rgba(0,0,0,0.2)'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: '#0077b6',
            marginBottom: '8px'
          }}>
            Contact Us
          </h2>

          <p style={{
            fontSize: '1rem',
            color: '#64748b',
            marginBottom: '40px'
          }}>
            Have questions or feedback? We'd love to hear from you!
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            textAlign: 'left'
          }}>
            {/* Contact Form */}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email *</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea 
                  className="form-control" 
                  rows={4} 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message..."
                  required 
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', marginTop: '10px' }}
              >
                {submitted ? 'SENDING...' : 'SUBMIT'}
              </button>
            </form>

            {/* Map & Location Info matching screenshot 4 */}
            <div style={{
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <iframe 
                title="Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.1782299863266!2d72.84651937596208!3d19.187383648464673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b713426e27ab%3A0xb3cf25881aa5444a!2sKES&#39;%20Shroff%20College%20of%20Arts%20%26%20Commerce!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" 
                height="260" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <div style={{ padding: '20px', backgroundColor: '#f8fafc', fontSize: '0.9rem', color: '#475569' }}>
                <p style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <MapPin size={16} color="#0077b6" /> Mumbai, India
                </p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Mail size={16} color="#0077b6" /> pathfinderai@gmail.com
                </p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={16} color="#0077b6" /> +91 9876543210
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
