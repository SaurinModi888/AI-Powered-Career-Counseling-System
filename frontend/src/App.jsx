import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ExploreCareers } from './components/ExploreCareers';
import { Features } from './components/Features';
import { AboutUs } from './components/AboutUs';
import { LatestBlogs } from './components/LatestBlogs';
import { LatestResources } from './components/LatestResources';
import { UserReviews } from './components/UserReviews';
import { ContactUs } from './components/ContactUs';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { QuizModal } from './components/QuizModal';
import { ChatWidget } from './components/ChatWidget';

function App() {
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCareer, setSelectedCareer] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.getMe().then(res => {
        if (res.user) {
          setUser(res.user);
        } else {
          localStorage.removeItem('token');
        }
      }).catch(err => {
        console.error(err);
        localStorage.removeItem('token');
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const handleGetStarted = () => {
    if (!user) {
      setIsAuthOpen(true);
    } else {
      setIsQuizOpen(true);
    }
  };

  return (
    <div className="app-root">
      {/* Navigation Header */}
      <Navbar 
        user={user} 
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Homepage Sections matching Reference Screenshots */}
      <Hero onGetStarted={handleGetStarted} />
      <ExploreCareers onSelectCareer={(career) => { setSelectedCareer(career); setIsQuizOpen(true); }} />
      <Features />
      <AboutUs />
      <LatestBlogs />
      <LatestResources user={user} />
      <UserReviews user={user} />
      <ContactUs />
      <Footer setActiveTab={setActiveTab} />

      {/* Modals & Floating Components */}
      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(userData) => {
          setUser(userData);
          setIsQuizOpen(true);
        }}
      />

      <QuizModal 
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        user={user}
        onCareerSelected={(career) => setSelectedCareer(career)}
      />

      <ChatWidget 
        user={user}
        selectedCareer={selectedCareer}
      />
    </div>
  );
}

export default App;
