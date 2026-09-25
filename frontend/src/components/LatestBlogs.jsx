import React from 'react';

const BLOGS_DATA = [
  {
    id: 1,
    title: 'How to Choose the Right Career Path',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Resume Building Tips for Freshers',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'How to Ace Your Next Job Interview',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 4,
    title: 'High-Paying Careers That Require No Degree',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 5,
    title: 'How to Improve Soft Skills for Career Growth',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 6,
    title: 'Career Switching: How to Transition Smoothly',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=crop'
  }
];

export const LatestBlogs = () => {
  return (
    <section 
      style={{
        background: 'linear-gradient(135deg, #001d3d 0%, #0077b6 100%)',
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
          LATEST CAREER BLOGS
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          {BLOGS_DATA.map((blog) => (
            <div 
              key={blog.id}
              className="card"
              style={{
                backgroundColor: 'white',
                color: '#1e293b',
                overflow: 'hidden',
                borderRadius: '16px'
              }}
            >
              <div style={{ height: '170px', overflow: 'hidden' }}>
                <img 
                  src={blog.image} 
                  alt={blog.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '24px 20px' }}>
                <h3 style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: '#1e293b',
                  lineHeight: 1.4
                }}>
                  {blog.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
