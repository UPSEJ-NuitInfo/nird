/**
 * NIRD Navigator Academy - Main JavaScript
 * Fonctions communes utilisées sur toutes les pages
 */

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function () {
  initMobileMenu();
  initSmoothScroll();
  initTooltips();
});

/**
 * Menu mobile - Toggle
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  if (!menuBtn) return;

  menuBtn.addEventListener('click', function () {
    // TODO: Implémenter menu mobile si nécessaire
    console.log('Menu mobile clicked');
  });
}

/**
 * Smooth scroll pour les ancres
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}

/**
 * Initialiser les tooltips (optionnel)
 */
function initTooltips() {
  // Peut être implémenté plus tard si nécessaire
}

/**
 * Afficher une notification toast
 * @param {string} message - Message à afficher
 * @param {string} type - Type: 'success', 'error', 'info'
 * @param {number} duration - Durée en ms (défaut: 3000)
 */
function showToast(message, type = 'info', duration = 3000) {
  // Créer l'élément toast
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  // Icône selon le type
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    info: 'fa-info-circle',
  };

  toast.innerHTML = `
    <i class="fas ${icons[type]} text-xl"></i>
    <span>${message}</span>
  `;

  // Ajouter au body
  document.body.appendChild(toast);

  // Supprimer après la durée
  setTimeout(() => {
    toast.style.animation = 'slide-out-right 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Afficher/Cacher un modal
 * @param {string} modalId - ID du modal
 * @param {boolean} show - true pour afficher, false pour cacher
 */
function toggleModal(modalId, show = true) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  if (show) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Afficher un spinner de chargement
 * @param {string} containerId - ID du conteneur
 */
function showLoading(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="flex justify-center items-center py-12">
      <div class="spinner"></div>
    </div>
  `;
}

/**
 * Formater un nombre en euros
 * @param {number} amount - Montant
 * @returns {string} - Montant formaté
 */
function formatEuro(amount) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formater un nombre avec des espaces
 * @param {number} num - Nombre
 * @returns {string} - Nombre formaté
 */
function formatNumber(num) {
  return new Intl.NumberFormat('fr-FR').format(num);
}

/**
 * Valider un email
 * @param {string} email - Email à valider
 * @returns {boolean} - true si valide
 */
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Récupérer les paramètres URL
 * @returns {Object} - Objet avec les paramètres
 */
function getUrlParams() {
  const params = {};
  const queryString = window.location.search.substring(1);
  const pairs = queryString.split('&');

  pairs.forEach((pair) => {
    const [key, value] = pair.split('=');
    if (key) {
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
  });

  return params;
}

/**
 * Sauvegarder dans localStorage
 * @param {string} key - Clé
 * @param {any} value - Valeur (sera stringifiée)
 */
function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error('Erreur localStorage:', e);
    return false;
  }
}

/**
 * Récupérer depuis localStorage
 * @param {string} key - Clé
 * @returns {any} - Valeur parsée ou null
 */
function getFromStorage(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.error('Erreur localStorage:', e);
    return null;
  }
}

/**
 * Supprimer de localStorage
 * @param {string} key - Clé
 */
function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error('Erreur localStorage:', e);
    return false;
  }
}

/**
 * Débounce function - Limite le nombre d'appels
 * @param {Function} func - Fonction à debouncer
 * @param {number} wait - Délai en ms
 * @returns {Function} - Fonction debouncée
 */
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Copier du texte dans le presse-papier
 * @param {string} text - Texte à copier
 * @returns {Promise<boolean>}
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copié dans le presse-papier !', 'success');
    return true;
  } catch (e) {
    console.error('Erreur copie:', e);
    showToast('Erreur lors de la copie', 'error');
    return false;
  }
}

/**
 * Générer un ID unique
 * @returns {string} - ID unique
 */
function generateId() {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Animer un nombre (compteur)
 * @param {HTMLElement} element - Élément à animer
 * @param {number} target - Valeur cible
 * @param {number} duration - Durée en ms
 */
function animateNumber(element, target, duration = 1000) {
  const start = 0;
  const increment = target / (duration / 16); // 60 FPS
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = Math.round(target);
      clearInterval(timer);
    } else {
      element.textContent = Math.round(current);
    }
  }, 16);
}

// Exporter les fonctions pour utilisation globale
window.NIRD = {
  showToast,
  toggleModal,
  showLoading,
  formatEuro,
  formatNumber,
  isValidEmail,
  getUrlParams,
  saveToStorage,
  getFromStorage,
  removeFromStorage,
  debounce,
  copyToClipboard,
  generateId,
  animateNumber,
};
