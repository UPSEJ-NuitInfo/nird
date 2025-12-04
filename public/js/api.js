// API Helper
const API = {
  baseURL: window.location.origin,

  getToken() {
    return localStorage.getItem('token');
  },

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  },

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: this.getHeaders(),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur API');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Auth endpoints
  async login(username, password) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  async register(username, email, password) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username,
        email,
        password,
        displayName: username,
      }),
    });
  },

  async getProfile() {
    return this.request('/api/auth/me');
  },

  // Lessons endpoints
  async getLessons() {
    return this.request('/api/lessons');
  },

  async getLesson(id) {
    return this.request(`/api/lessons/${id}`);
  },

  async startLesson(id) {
    return this.request(`/api/lessons/${id}/start`, {
      method: 'POST',
    });
  },

  async completeLesson(id, score, stars) {
    return this.request(`/api/lessons/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify({ score, stars }),
    });
  },

  // Exercises endpoints
  async getExercise(id) {
    return this.request(`/api/exercises/${id}`);
  },

  async submitAnswer(exerciseId, answer, timeSpent) {
    return this.request(`/api/exercises/${exerciseId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answer, timeSpent }),
    });
  },

  // Users endpoints
  async getUserProfile() {
    return this.request('/api/users/profile');
  },

  async updateStreak() {
    return this.request('/api/users/update-streak', {
      method: 'POST',
    });
  },

  async getLeaderboard(timeframe = 'all-time') {
    return this.request(`/api/users/leaderboard?timeframe=${timeframe}`);
  },
};

// Toast Notifications
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icon =
    type === 'success'
      ? 'check-circle'
      : type === 'error'
      ? 'exclamation-circle'
      : 'info-circle';

  toast.innerHTML = `
    <i class="fas fa-${icon}"></i>
    <span>${message}</span>
  `;

  const container = document.getElementById('toastContainer');
  if (container) {
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideInRight 0.3s ease-out reverse';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Check authentication
function checkAuth() {
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = '/login.html';
    return false;
  }

  return true;
}

// Logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login.html';
}

// Format numbers
function formatNumber(num) {
  return new Intl.NumberFormat('fr-FR').format(num);
}

// Get user from localStorage
function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

// Update user in localStorage
function updateCurrentUser(userData) {
  localStorage.setItem('user', JSON.stringify(userData));
}
