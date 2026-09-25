import React, { useState } from 'react';
import { api } from '../services/api';
import { Eye, EyeOff, X, LogIn, UserPlus } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await api.login({ email, password });
        if (res.token) {
          localStorage.setItem('token', res.token);
          onAuthSuccess(res.user);
          onClose();
        } else {
          setErrorMsg(res.error || 'Login failed');
        }
      } else {
        if (password !== confirmPassword) {
          setErrorMsg('Passwords do not match');
          setLoading(false);
          return;
        }
        const res = await api.register({ email, password, full_name: fullName });
        if (res.token) {
          localStorage.setItem('token', res.token);
          onAuthSuccess(res.user);
          onClose();
        } else {
          setErrorMsg(res.error || 'Registration failed');
        }
      }
    } catch (err) {
      setErrorMsg('An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #001d3d 0%, #0077b6 100%)',
          padding: '40px 20px',
          maxWidth: '440px',
          borderRadius: '20px'
        }}
      >
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '36px 30px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          textAlign: 'center',
          position: 'relative'
        }}>
          <button 
            onClick={onClose} 
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <X size={20} color="#64748b" />
          </button>

          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: 800,
            color: '#0077b6',
            marginBottom: '24px'
          }}>
            {isLogin ? 'Login' : 'Create Your Account'}
          </h2>

          {errorMsg && (
            <div style={{
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              padding: '10px',
              borderRadius: '6px',
              fontSize: '0.85rem',
              marginBottom: '16px',
              border: '1px solid #fecaca'
            }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  required 
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input 
                type="email" 
                className="form-control" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required 
              />
            </div>

            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label">Password *</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="form-control" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748b'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="form-group" style={{ position: 'relative' }}>
                <label className="form-label">Confirm Password *</label>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="form-control" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  required 
                />
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary" 
              style={{ width: '100%', marginTop: '12px' }}
            >
              {loading ? 'PROCESSING...' : (isLogin ? 'LOGIN' : 'SIGN UP')}
            </button>
          </form>

          {!isLogin && (
            <div style={{ margin: '20px 0 14px 0' }}>
              <div style={{ position: 'relative', textAlign: 'center' }}>
                <span style={{ backgroundColor: 'white', padding: '0 10px', fontSize: '0.8rem', color: '#94a3b8' }}>or</span>
                <div style={{ borderTop: '1px solid #e2e8f0', position: 'absolute', top: '50%', width: '100%', zIndex: -1 }}></div>
              </div>
              <button 
                type="button"
                onClick={() => alert('Google Sign-In integration ready!')}
                style={{
                  width: '100%',
                  marginTop: '14px',
                  backgroundColor: 'white',
                  border: '1.5px solid #cbd5e1',
                  color: '#0077b6',
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                G CONTINUE WITH GOOGLE
              </button>
            </div>
          )}

          <div style={{ marginTop: '20px', fontSize: '0.88rem', color: '#64748b' }}>
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <button 
                  onClick={() => setIsLogin(false)} 
                  style={{ background: 'none', border: 'none', color: '#0077b6', fontWeight: 700, cursor: 'pointer' }}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button 
                  onClick={() => setIsLogin(true)} 
                  style={{ background: 'none', border: 'none', color: '#0077b6', fontWeight: 700, cursor: 'pointer' }}
                >
                  LOGIN
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
