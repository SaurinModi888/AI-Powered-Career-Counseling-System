import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export const Hero = ({ onGetStarted }) => {
  return (
    <section 
      id="home"
      style={{
        position: 'relative',
        minHeight: '82vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white',
        background: `linear-gradient(135deg, rgba(0, 29, 61, 0.88) 0%, rgba(0, 119, 182, 0.85) 100%), 
                    url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop') center/cover no-repeat`,
        padding: '60px 20px',
        overflow: 'hidden'
      }}
    >
      <div style={{ maxWidth: '850px', zIndex: 2 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          padding: '6px 18px',
          borderRadius: '30px',
          fontSize: '0.88rem',
          fontWeight: 600,
          marginBottom: '24px',
          color: '#90e0ef'
        }}>
          <Sparkles size={16} color="#00b4d8" /> Next-Gen AI Career Guidance Engine
        </div>

        <h1 style={{
          fontSize: '3.6rem',
          fontWeight: 800,
          lineHeight: 1.15,
          marginBottom: '20px',
          letterSpacing: '-0.5px'
        }}>
          Find Your Perfect Career Path
        </h1>

        <p style={{
          fontSize: '1.25rem',
          color: '#e2e8f0',
          maxWidth: '680px',
          margin: '0 auto 36px auto',
          fontWeight: 400
        }}>
          Unlock opportunities, gain insights, and shape your future with expert guidance powered by Machine Learning & Gemini AI.
        </p>

        <button 
          onClick={onGetStarted}
          className="btn-primary"
          style={{
            fontSize: '1.05rem',
            padding: '16px 36px',
            borderRadius: '8px',
            backgroundColor: '#0077b6',
            boxShadow: '0 10px 25px rgba(0, 119, 182, 0.4)'
          }}
        >
          GET STARTED <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
};
