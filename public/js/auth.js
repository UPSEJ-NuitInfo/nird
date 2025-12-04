// API Base URL
const API_URL = '/api';

// Tab Switching
document.querySelectorAll('.tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;

    // Update active tab button
    document
      .querySelectorAll('.tab-btn')
      .forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    // Update active form
    document
      .querySelectorAll('.auth-form')
      .forEach((form) => form.classList.remove('active'));
    document.getElementById(`${tab}-form`).classList.add('active');

    // Clear errors
    document.getElementById('login-error').textContent = '';
    document.getElementById('register-error').textContent = '';
  });
});

// Login Form
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  const errorDiv = document.getElementById('login-error');
  const submitBtn = e.target.querySelector('button[type="submit"]');

  errorDiv.textContent = '';
  submitBtn.disabled = true;
  submitBtn.textContent = 'Connexion...';

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erreur de connexion');
    }

    // Save token
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Redirect to hub
    window.location.href = '/hub.html';
  } catch (error) {
    errorDiv.textContent = error.message;
    submitBtn.disabled = false;
    submitBtn.textContent = 'Se connecter';
  }
});

// Register Form
document
  .getElementById('register-form')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const passwordConfirm = document.getElementById(
      'register-password-confirm',
    ).value;
    const errorDiv = document.getElementById('register-error');
    const submitBtn = e.target.querySelector('button[type="submit"]');

    errorDiv.textContent = '';

    // Validate password match
    if (password !== passwordConfirm) {
      errorDiv.textContent = 'Les mots de passe ne correspondent pas';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Inscription...';

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur d'inscription");
      }

      // Save token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to hub
      window.location.href = '/hub.html';
    } catch (error) {
      errorDiv.textContent = error.message;
      submitBtn.disabled = false;
      submitBtn.textContent = "S'inscrire";
    }
  });

// Check if already logged in
if (localStorage.getItem('token')) {
  window.location.href = '/hub.html';
}
