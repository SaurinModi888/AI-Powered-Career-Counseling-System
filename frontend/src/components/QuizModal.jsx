import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { X, CheckCircle, Sparkles, Award, BookOpen, ArrowRight, ArrowLeft } from 'lucide-react';

export const QuizModal = ({ isOpen, onClose, user, onCareerSelected }) => {
  const [step, setStep] = useState(1); // 1: Personal Details, 2: Educational Details, 3: Quiz Questions, 4: Results
  
  // Personal Details state (matching screenshot 3)
  const [personalDetails, setPersonalDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    ageGroup: '18-22',
    hobbies: '',
    languages: ''
  });

  // Educational Details state (matching screenshot 2)
  const [educationalDetails, setEducationalDetails] = useState({
    highestDegree: "Bachelor's",
    fieldOfStudy: 'Computer Science',
    university: '',
    graduationYear: '2025',
    certifications: 'AWS Certified',
    skills: 'Python, Data Analysis',
    experience: 'None',
    preferredDomain: 'IT'
  });

  // Quiz state (matching screenshot 1)
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [predictions, setPredictions] = useState([]);
  const [loadingPredictions, setLoadingPredictions] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState('');

  useEffect(() => {
    if (isOpen) {
      api.getQuestions().then(res => {
        if (res.questions) {
          setQuestions(res.questions);
        }
      }).catch(err => console.error(err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePersonalSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleEducationalSubmit = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handleSelectOption = (option) => {
    const q = questions[currentQuestionIdx];
    const key = q.field || q.id.toString();
    setQuizAnswers(prev => ({ ...prev, [key]: option }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      // Final Question Answered -> Submit Quiz
      submitQuizData();
    }
  };

  const submitQuizData = async () => {
    setLoadingPredictions(true);
    setStep(4);

    const mergedAnswers = {
      ...quizAnswers,
      "Education Level": educationalDetails.highestDegree,
      "Specialization": educationalDetails.fieldOfStudy,
      "Skills": educationalDetails.skills,
      "Certifications": educationalDetails.certifications,
      "CGPA/Percentage": educationalDetails.graduationYear
    };

    try {
      const res = await api.submitQuiz({ answers: mergedAnswers });
      if (res.predictions && res.predictions.length > 0) {
        setPredictions(res.predictions);
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
    } finally {
      setLoadingPredictions(false);
    }
  };

  const handleSelectCareerPath = async (careerName) => {
    setSelectedCareer(careerName);
    try {
      const res = await api.selectCareer(careerName);
      if (res.selected_career) {
        alert(`Congratulations! You have selected '${careerName}' as your target career path. Start using the AI Chatbot mentor to guide your journey!`);
        onCareerSelected(careerName);
        onClose();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '650px',
          padding: '36px 30px',
          borderRadius: '20px',
          background: 'white'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0077b6' }}>
            STEP {step} OF 4 — CAREER ASSESSMENT
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={22} color="#64748b" />
          </button>
        </div>

        {/* STEP 1: Personal Details Form (matching screenshot 3) */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', textAlign: 'center', marginBottom: '24px' }}>
              Personal Details
            </h2>
            <form onSubmit={handlePersonalSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="First Name" 
                    value={personalDetails.firstName}
                    onChange={(e) => setPersonalDetails({ ...personalDetails, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Last Name" 
                    value={personalDetails.lastName}
                    onChange={(e) => setPersonalDetails({ ...personalDetails, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Email Address" 
                  value={personalDetails.email}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <input 
                  type="tel" 
                  className="form-control" 
                  placeholder="Contact Number" 
                  value={personalDetails.contactNumber}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, contactNumber: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <select 
                  className="form-control"
                  value={personalDetails.ageGroup}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, ageGroup: e.target.value })}
                >
                  <option value="15-18">Age Group: 15-18</option>
                  <option value="18-22">Age Group: 18-22</option>
                  <option value="23-28">Age Group: 23-28</option>
                  <option value="29+">Age Group: 29+</option>
                </select>
              </div>

              <div className="form-group">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Hobbies/Interests" 
                  value={personalDetails.hobbies}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, hobbies: e.target.value })}
                />
              </div>

              <div className="form-group">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Languages Known" 
                  value={personalDetails.languages}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, languages: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                NEXT <ArrowRight size={18} />
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: Educational Details Form (matching screenshot 2) */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', textAlign: 'center', marginBottom: '24px' }}>
              Educational Details
            </h2>
            <form onSubmit={handleEducationalSubmit}>
              <div className="form-group">
                <label className="form-label">Highest Degree / Education Level</label>
                <select 
                  className="form-control"
                  value={educationalDetails.highestDegree}
                  onChange={(e) => setEducationalDetails({ ...educationalDetails, highestDegree: e.target.value })}
                >
                  <option value="Bachelor's">Bachelor's</option>
                  <option value="Master's">Master's</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="High School">High School</option>
                  <option value="Ph.D.">Ph.D.</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Field of Study / Specialization</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={educationalDetails.fieldOfStudy}
                  onChange={(e) => setEducationalDetails({ ...educationalDetails, fieldOfStudy: e.target.value })}
                  placeholder="e.g. Computer Science, Finance, IT"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">University/Institute</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={educationalDetails.university}
                  onChange={(e) => setEducationalDetails({ ...educationalDetails, university: e.target.value })}
                  placeholder="e.g. Stanford / College Name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Graduation Year / CGPA Percentage</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={educationalDetails.graduationYear}
                  onChange={(e) => setEducationalDetails({ ...educationalDetails, graduationYear: e.target.value })}
                  placeholder="e.g. 85.0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Certifications (comma-separated)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={educationalDetails.certifications}
                  onChange={(e) => setEducationalDetails({ ...educationalDetails, certifications: e.target.value })}
                  placeholder="e.g. AWS Certified, Google UX"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Skills (comma-separated)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={educationalDetails.skills}
                  onChange={(e) => setEducationalDetails({ ...educationalDetails, skills: e.target.value })}
                  placeholder="e.g. Python, SQL, CSS"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '14px', marginTop: '16px' }}>
                <button type="button" onClick={() => setStep(1)} className="btn-secondary" style={{ flex: 1 }}>
                  <ArrowLeft size={16} /> BACK
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 2 }}>
                  NEXT <ArrowRight size={18} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: 16-Question Assessment (matching screenshot 1) */}
        {step === 3 && questions.length > 0 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '16px', fontSize: '1rem', fontWeight: 700, color: '#0077b6' }}>
              Question {currentQuestionIdx + 1} of {questions.length}
            </div>

            {/* Top Progress Track */}
            <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '28px' }}>
              <div 
                style={{
                  height: '100%',
                  width: `${((currentQuestionIdx + 1) / questions.length) * 100}%`,
                  backgroundColor: '#0077b6',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', textAlign: 'center', marginBottom: '8px' }}>
              {questions[currentQuestionIdx].field || `Question ${currentQuestionIdx + 1}`}
            </h3>

            <p style={{ fontSize: '1.05rem', color: '#475569', textAlign: 'center', marginBottom: '24px' }}>
              {questions[currentQuestionIdx].question}
            </p>

            {/* Selectable Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              {questions[currentQuestionIdx].options.map((opt, i) => {
                const qKey = questions[currentQuestionIdx].field || questions[currentQuestionIdx].id.toString();
                const isSelected = quizAnswers[qKey] === opt;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(opt)}
                    style={{
                      padding: '14px 20px',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid #0077b6' : '1px solid #cbd5e1',
                      backgroundColor: isSelected ? '#0077b6' : '#ffffff',
                      color: isSelected ? '#ffffff' : '#334155',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textTransform: 'uppercase'
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {currentQuestionIdx > 0 && (
                <button 
                  onClick={() => setCurrentQuestionIdx(prev => prev - 1)} 
                  className="btn-secondary"
                >
                  <ArrowLeft size={16} /> PREVIOUS
                </button>
              )}
              <button 
                onClick={handleNextQuestion} 
                className="btn-primary" 
                style={{ marginLeft: 'auto' }}
              >
                {currentQuestionIdx === questions.length - 1 ? 'SUBMIT QUIZ' : 'NEXT'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: 5 Unique Career Predictions Results */}
        {step === 4 && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0077b6', marginBottom: '8px' }}>
              Your 5 Top Career Recommendations
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '24px' }}>
              Based on your academic profile and 16 assessment answers, our Random Forest ML model predicted these 5 unique career paths:
            </p>

            {loadingPredictions ? (
              <div style={{ padding: '40px 0', fontSize: '1.1rem', color: '#0077b6', fontWeight: 600 }}>
                Running AI Machine Learning Predictions...
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '50vh', overflowY: 'auto', paddingRight: '6px' }}>
                {predictions.map((p, idx) => (
                  <div 
                    key={idx}
                    className="card"
                    style={{
                      padding: '20px',
                      borderRadius: '12px',
                      textAlign: 'left',
                      borderLeft: '5px solid #0077b6',
                      backgroundColor: selectedCareer === p.career ? '#f0f9ff' : 'white'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#00296b' }}>
                        #{idx + 1} {p.career}
                      </h3>
                      <span style={{ backgroundColor: '#e0f2fe', color: '#0077b6', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem' }}>
                        {p.score}% Match
                      </span>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '10px' }}>
                      {p.description}
                    </p>
                    <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '12px' }}>
                      <strong>Key Skills:</strong> {p.key_skills ? p.key_skills.join(', ') : 'N/A'}
                    </div>
                    <button
                      onClick={() => handleSelectCareerPath(p.career)}
                      className="btn-primary"
                      style={{ fontSize: '0.82rem', padding: '8px 16px' }}
                    >
                      SELECT THIS CAREER PATH <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
