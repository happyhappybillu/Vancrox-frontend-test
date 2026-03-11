// ============================================
//   VANCROX - Shared Utilities
// ============================================

const API = '/api';

// --- Token helpers ---
const getToken = () => localStorage.getItem('vancrox_token');
const getUser = () => JSON.parse(localStorage.getItem('vancrox_user') || 'null');
const setAuth = (token, user) => { localStorage.setItem('vancrox_token', token); localStorage.setItem('vancrox_user', JSON.stringify(user)); };
const clearAuth = () => { localStorage.removeItem('vancrox_token'); localStorage.removeItem('vancrox_user'); };

// --- API request ---
async function apiRequest(method, endpoint, data = null, isFormData = false) {
  const headers = { Authorization: `Bearer ${getToken()}` };
  if (!isFormData) headers['Content-Type'] = 'application/json';

  const options = { method, headers };
  if (data) options.body = isFormData ? data : JSON.stringify(data);

  const res = await fetch(API + endpoint, options);
  const json = await res.json();
  return json;
}

// --- Toast notification ---
function showToast(message, type = 'info') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.className = `show ${type}`;
  toast.textContent = message;
  setTimeout(() => { toast.className = ''; }, 3000);
}

// --- Format currency ---
function formatUSDT(amount) {
  return parseFloat(amount || 0).toFixed(2);
}

// --- Format date ---
function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// --- Countdown timer ---
function startCountdown(deadline, element) {
  const update = () => {
    const remaining = new Date(deadline) - new Date();
    if (remaining <= 0) {
      element.textContent = 'Expired';
      element.style.color = 'var(--red)';
      return;
    }
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    element.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    element.style.color = remaining < 60000 ? 'var(--red)' : 'var(--gold)';
    setTimeout(update, 1000);
  };
  update();
}

// --- Redirect if not logged in ---
function requireAuth(role) {
  const user = getUser();
  const token = getToken();
  if (!token || !user) { window.location.href = '/index.html'; return false; }
  if (role && user.role !== role) { window.location.href = '/index.html'; return false; }
  return true;
}

// --- Logout ---
function logout() {
  clearAuth();
  window.location.href = '/index.html';
}
