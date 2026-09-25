import React, { useState } from 'react';
import { Briefcase, TrendingUp, ChevronRight } from 'lucide-react';

const CAREERS_DATA = [
  {
    id: 1,
    title: 'Software Developer',
    package: '3-5 LPA',
    growth: '20%',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Data Scientist',
    package: '4-7 LPA',
    growth: '35%',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Cybersecurity Analyst',
    package: '3.5-6 LPA',
    growth: '28%',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 4,
    title: 'Cloud Engineer',
    package: '4.5-7.5 LPA',
    growth: '32%',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 5,
    title: 'UI/UX Designer',
    package: '3-6 LPA',
    growth: '25%',
    image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 6,
    title: 'DevOps Engineer',
    package: '4-7 LPA',
    growth: '30%',
    image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 7,
    title: 'Marketing Manager',
    package: '5-10 LPA',
    growth: '20%',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 8,
    title: 'Financial Analyst',
    package: '4-8 LPA',
    growth: '25%',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 9,
    title: 'Graphic Designer',
    package: '2.5-5 LPA',
    growth: '15%',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=600&auto=format&fit=crop'
  }
];

export const ExploreCareers = ({ onSelectCareer }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedCareers = showAll ? CAREERS_DATA : CAREERS_DATA.slice(0, 3);

  return (
    <section 
      id="careers"
      style={{
        background: 'linear-gradient(135deg, #001d3d 0%, #003566 50%, #0077b6 100%)',
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
          EXPLORE CAREERS
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          marginBottom: '40px'
        }}>
          {displayedCareers.map((c) => (
            <div 
              key={c.id}
              className="card"
              style={{
                backgroundColor: 'white',
                color: '#1e293b',
                overflow: 'hidden',
                textAlign: 'center',
                borderRadius: '16px',
                boxShadow: '0 12px 28px rgba(0,0,0,0.15)'
              }}
            >
              <div style={{ height: '180px', overflow: 'hidden' }}>
                <img 
                  src={c.image} 
                  alt={c.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                />
              </div>
              <div style={{ padding: '24px 20px' }}>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: '#0077b6',
                  marginBottom: '12px'
                }}>
                  {c.title}
                </h3>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '16px',
                  fontSize: '0.88rem',
                  color: '#475569',
                  fontWeight: 600
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Briefcase size={15} color="#8b5cf6" /> Package: {c.package}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <TrendingUp size={15} color="#10b981" /> Growth: {c.growth}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => setShowAll(!showAll)}
          style={{
            backgroundColor: '#0096c7',
            color: 'white',
            border: 'none',
            padding: '12px 32px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          {showAll ? 'SHOW LESS' : 'VIEW ALL CAREERS'}
        </button>
      </div>
    </section>
  );
};
