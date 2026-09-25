const API_BASE_URL = 'http://localhost:5000';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Auth
  register: async (payload) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  login: async (payload) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  // Profile
  getProfile: async (userId) => {
    const url = userId ? `${API_BASE_URL}/api/profile?user_id=${userId}` : `${API_BASE_URL}/api/profile`;
    const res = await fetch(url, { headers: getHeaders() });
    return res.json();
  },

  updateProfile: async (payload) => {
    const res = await fetch(`${API_BASE_URL}/api/profile`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Quiz & Predictions
  getQuestions: async () => {
    const res = await fetch(`${API_BASE_URL}/api/quiz/questions`);
    return res.json();
  },

  submitQuiz: async (payload) => {
    const res = await fetch(`${API_BASE_URL}/api/quiz/submit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  getPredictions: async () => {
    const res = await fetch(`${API_BASE_URL}/api/career/predictions`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  selectCareer: async (selected_career) => {
    const res = await fetch(`${API_BASE_URL}/api/career/select`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ selected_career }),
    });
    return res.json();
  },

  // Chatbot
  startChat: async () => {
    const res = await fetch(`${API_BASE_URL}/api/chat/start`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return res.json();
  },

  sendMessage: async (message) => {
    const res = await fetch(`${API_BASE_URL}/api/chat/message`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ message }),
    });
    return res.json();
  },

  closeChat: async (messages = []) => {
    const res = await fetch(`${API_BASE_URL}/api/chat/close`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ messages }),
    });
    return res.json();
  },

  getChatHistory: async () => {
    const res = await fetch(`${API_BASE_URL}/api/chat/history`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  // Resources
  getResources: async (category = '', career = '') => {
    let url = `${API_BASE_URL}/api/resources`;
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (career) params.append('career', career);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url);
    return res.json();
  },

  saveResource: async (resource_id) => {
    const res = await fetch(`${API_BASE_URL}/api/resources/save`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ resource_id }),
    });
    return res.json();
  },

  getSavedResources: async () => {
    const res = await fetch(`${API_BASE_URL}/api/resources/saved`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  // Reviews
  getReviews: async () => {
    const res = await fetch(`${API_BASE_URL}/api/reviews`);
    return res.json();
  },

  submitReview: async (rating, comment) => {
    const res = await fetch(`${API_BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ rating, comment }),
    });
    return res.json();
  }
};
