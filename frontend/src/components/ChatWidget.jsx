import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';

export const ChatWidget = ({ user, selectedCareer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentCareer, setCurrentCareer] = useState(selectedCareer || 'Software Engineer');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleToggleChat = async () => {
    if (!isOpen) {
      if (!user) {
        alert('Please login to use the Gemini AI Career Chatbot.');
        return;
      }
      setIsOpen(true);
      try {
        // Start chat session -> loads prior transcript from .txt file referenced in MySQL
        const res = await api.startChat();
        if (res.selected_career) {
          setCurrentCareer(res.selected_career);
        }
        if (res.past_transcript) {
          // Parse past transcript text into message blocks if available
          setMessages([
            { role: 'assistant', content: `Welcome back! I am your PathFinder AI mentor for **${res.selected_career || currentCareer}**. I have loaded our prior session context from your transcript file. How can I assist your career path today?` }
          ]);
        } else {
          setMessages([
            { role: 'assistant', content: `Hello! I am PathFinder AI, your dedicated mentor for **${res.selected_career || currentCareer}**. Ask me for learning roadmaps, portfolio project ideas, resume tips, or interview preparation!` }
          ]);
        }
      } catch (err) {
        console.error('Start chat error:', err);
      }
    } else {
      // Close chat session -> updates/saves .txt transcript file & DB reference
      try {
        await api.closeChat(messages);
      } catch (err) {
        console.error('Close chat error:', err);
      }
      setIsOpen(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || loading) return;

    const userText = inputMsg.trim();
    setInputMsg('');
    const userMsgObj = { role: 'user', content: userText };
    setMessages(prev => [...prev, userMsgObj]);
    setLoading(true);

    try {
      const res = await api.sendMessage(userText);
      if (res.response) {
        const aiMsgObj = { role: 'assistant', content: res.response };
        setMessages(prev => [...prev, aiMsgObj]);
      }
    } catch (err) {
      console.error('Send message error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an issue connecting to Gemini AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button matching bottom right corner of reference screenshots */}
      <button
        onClick={handleToggleChat}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#0077b6',
          color: 'white',
          border: 'none',
          boxShadow: '0 8px 25px rgba(0, 119, 182, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          transition: 'transform 0.3s ease'
        }}
        title="Open PathFinder AI Chatbot"
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>

      {/* Expandable Chat Drawer */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '95px',
          right: '24px',
          width: '380px',
          maxHeight: '560px',
          height: '80vh',
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0, 29, 61, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          overflow: 'hidden',
          border: '1px solid rgba(0, 119, 182, 0.2)',
          animation: 'slideUp 0.3s ease-out'
        }}>
          {/* Header */}
          <div style={{
            backgroundColor: '#00296b',
            color: 'white',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: '#0077b6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bot size={20} color="white" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0 }}>PathFinder AI Mentor</h4>
                <span style={{ fontSize: '0.75rem', color: '#90e0ef' }}>
                  Path: {currentCareer}
                </span>
              </div>
            </div>
            <button onClick={handleToggleChat} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
              <X size={20} />
            </button>
          </div>

          {/* Messages Body */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            backgroundColor: '#f8fafc'
          }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}
              >
                {m.role === 'assistant' && (
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#0077b6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Bot size={16} color="white" />
                  </div>
                )}
                <div style={{
                  backgroundColor: m.role === 'user' ? '#0077b6' : 'white',
                  color: m.role === 'user' ? 'white' : '#1e293b',
                  padding: '12px 16px',
                  borderRadius: m.role === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  fontSize: '0.88rem',
                  boxShadow: m.role === 'user' ? 'none' : '0 2px 8px rgba(0,0,0,0.06)',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap'
                }}>
                  {m.content}
                </div>
                {m.role === 'user' && (
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#00296b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={16} color="white" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ fontSize: '0.82rem', color: '#0077b6', fontStyle: 'italic', paddingLeft: '38px' }}>
                PathFinder AI is generating guidance...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <form onSubmit={handleSendMessage} style={{
            padding: '12px 16px',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: 'white',
            display: 'flex',
            gap: '8px'
          }}>
            <input 
              type="text" 
              className="form-control"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Ask career question..."
              style={{ fontSize: '0.88rem', padding: '10px 14px' }}
            />
            <button 
              type="submit" 
              disabled={loading || !inputMsg.trim()}
              style={{
                backgroundColor: '#0077b6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
