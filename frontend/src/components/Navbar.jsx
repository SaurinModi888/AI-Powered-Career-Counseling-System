import React from 'react';
import { BrainCircuit, User, LogOut, LogIn } from 'lucide-react';

export const Navbar = ({ user, onOpenAuth, onOpenQuiz, onLogout, activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', label: 'HOME' },
    { id: 'about', label: 'ABOUT' },
    { id: 'careers', label: 'CAREERS' },
    { id: 'features', label: 'FEATURES' },
    { id: 'reviews', label: 'REVIEWS' },
    { id: 'resources', label: 'RESOURCES' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav style={{
      backgroundColor: '#00296b',
      color: 'white',
      position: 'sticky',
      top: 0,
      zIndex: 900,
      boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
      padding: '14px 0'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Brand */}
        <div 
          onClick={() => handleNavClick('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <BrainCircuit size={28} color="#00b4d8" />
          <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '1px', fontFamily: 'Outfit, sans-serif' }}>
            PATHFINDER AI
          </span>
        </div>

        {/* Nav Links matching 15_homepage_hero.png */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === item.id ? '#00b4d8' : '#e2e8f0',
                fontSize: '0.88rem',
                fontWeight: activeTab === item.id ? 700 : 600,
                letterSpacing: '0.5px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                padding: '4px 0',
                borderBottom: activeTab === item.id ? '2px solid #00b4d8' : '2px solid transparent'
              }}
            >
              {item.label}
            </button>
          ))}

          {/* User Auth Controls */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginLeft: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: '#90e0ef', fontWeight: 600 }}>
                Hi, {user.full_name || user.email}
              </span>
              <button
                onClick={onLogout}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <LogOut size={14} /> LOGOUT
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              style={{
                backgroundColor: '#0077b6',
                color: 'white',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginLeft: '10px'
              }}
            >
              <LogIn size={15} /> LOGIN
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
