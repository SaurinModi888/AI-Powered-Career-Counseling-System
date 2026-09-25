import React from 'react';
import { Cpu, HelpCircle, Compass, BookOpen, MessageSquare, Briefcase } from 'lucide-react';

const FEATURES_LIST = [
  {
    icon: <Cpu size={32} color="#0077b6" />,
    title: 'AI-Powered Career Recommendations',
    desc: 'Tailored suggestions based on your profile to help you find your ideal career path.'
  },
  {
    icon: <HelpCircle size={32} color="#0077b6" />,
    title: 'Interactive Quizzes',
    desc: 'Evaluate your skills and personality with engaging quizzes.'
  },
  {
    icon: <Compass size={32} color="#0077b6" />,
    title: 'Career Pathways',
    desc: 'Step-by-step guides to navigate your professional journey.'
  },
  {
    icon: <BookOpen size={32} color="#0077b6" />,
    title: 'Skill-Building Resources',
    desc: 'Access courses and tutorials to enhance your abilities.'
  },
  {
    icon: <MessageSquare size={32} color="#0077b6" />,
    title: 'Soft Skills Development via Chatbot',
    desc: 'Enhance communication, leadership, and teamwork skills with chatbot-driven guidance.'
  },
  {
    icon: <Briefcase size={32} color="#0077b6" />,
    title: 'Internship & Job Listings via Chatbot',
    desc: 'Get real-time updates on internships and job opportunities directly through the chatbot.'
  }
];

export const Features = () => {
  return (
    <section 
      id="features"
      style={{
        backgroundColor: '#edf6f9',
        padding: '80px 20px',
        textAlign: 'center'
      }}
    >
      <div className="container">
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          color: '#00296b',
          marginBottom: '48px'
        }}>
          Features
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px'
        }}>
          {FEATURES_LIST.map((f, idx) => (
            <div 
              key={idx}
              className="card"
              style={{
                padding: '36px 28px',
                textAlign: 'left',
                backgroundColor: 'white',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start'
              }}
            >
              <div style={{ marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                color: '#003566',
                marginBottom: '12px'
              }}>
                {f.title}
              </h3>
              <p style={{
                fontSize: '0.92rem',
                color: '#64748b',
                lineHeight: 1.6
              }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
