import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ExternalLink, Bookmark, Check } from 'lucide-react';

const STATIC_PLATFORMS = [
  {
    name: 'Coursera',
    color: '#0056D2',
    url: 'https://www.coursera.org',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Coursera-Logo_600x600.svg'
  },
  {
    name: 'Udemy',
    color: '#A435F0',
    url: 'https://www.udemy.com',
    logo: 'https://www.vectorlogo.zone/logos/udemy/udemy-icon.svg'
  },
  {
    name: 'LinkedIn Learning',
    color: '#0A66C2',
    url: 'https://www.linkedin.com/learning',
    logo: 'https://www.vectorlogo.zone/logos/linkedin/linkedin-icon.svg'
  },
  {
    name: 'edX',
    color: '#0B2C4D',
    url: 'https://www.edx.org',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/EdX_logo.svg'
  },
  {
    name: 'Khan Academy',
    color: '#14BF96',
    url: 'https://www.khanacademy.org',
    logo: 'https://www.vectorlogo.zone/logos/khanacademy/khanacademy-icon.svg'
  },
  {
    name: 'Harvard Online Courses',
    color: '#A51C30',
    url: 'https://online-learning.harvard.edu',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Harvard_University_coat_of_arms.svg'
  }
];

export const LatestResources = ({ user }) => {
  const [resources, setResources] = useState([]);
  const [savedMap, setSavedMap] = useState({});

  useEffect(() => {
    api.getResources().then(res => {
      if (res.resources) {
        setResources(res.resources);
      }
    }).catch(err => console.error(err));
  }, []);

  const handleSave = async (id) => {
    if (!user) {
      alert('Please login to bookmark educational resources.');
      return;
    }
    const res = await api.saveResource(id);
    if (res.message) {
      setSavedMap(prev => ({ ...prev, [id]: true }));
    }
  };

  return (
    <section 
      id="resources"
      style={{
        background: 'linear-gradient(135deg, #00296b 0%, #0096c7 100%)',
        padding: '80px 20px',
        color: 'white',
        textAlign: 'center'
      }}
    >
      <div className="container">
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          marginBottom: '48px',
          letterSpacing: '1px'
        }}>
          LATEST RESOURCES
        </h2>

        {/* Platforms Grid matching screenshot 12 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
          marginBottom: '50px'
        }}>
          {STATIC_PLATFORMS.map((p, idx) => (
            <a 
              key={idx}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="card"
              style={{
                backgroundColor: 'white',
                color: '#1e293b',
                padding: '36px 20px',
                borderRadius: '16px',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px'
              }}
            >
              <img 
                src={p.logo} 
                alt={p.name}
                style={{ height: '60px', maxWidth: '160px', objectFit: 'contain' }}
              />
              <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#334155' }}>
                {p.name}
              </span>
            </a>
          ))}
        </div>

        {/* Backend Courses List */}
        {resources.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '24px' }}>
              Curated Recommended Courses
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              {resources.map((r) => (
                <div key={r.id} className="card" style={{ padding: '24px', textAlign: 'left', backgroundColor: 'white', color: '#1e293b' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0077b6', backgroundColor: '#e0f2fe', padding: '4px 10px', borderRadius: '20px' }}>
                      {r.career_tag}
                    </span>
                    <button 
                      onClick={() => handleSave(r.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      title="Bookmark course"
                    >
                      {savedMap[r.id] ? <Check size={20} color="#10b981" /> : <Bookmark size={20} color="#64748b" />}
                    </button>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: '#00296b' }}>{r.title}</h4>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '16px' }}>{r.description}</p>
                  <a href={r.url} target="_blank" rel="noreferrer" style={{ color: '#0077b6', fontWeight: 600, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    Enroll Course <ExternalLink size={14} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
