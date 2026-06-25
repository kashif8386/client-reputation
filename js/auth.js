/* ============================================
   REVA REPUTATION MANAGER — AUTH
   auth.js — Login / logout / session check
   ============================================ */

const RevaAuth = (() => {

  /* --- CREDENTIALS (replace with real backend later) --- */
  const USERS = [
    { username: 'admin',  password: 'reva@2024', name: 'Admin User',  role: 'Admin',   initials: 'AU' },
    { username: 'kashif', password: 'kashif123', name: 'Kashif Ahmed', role: 'Manager', initials: 'KA' },
  ];

  const SESSION_KEY = 'reva_session';

  /* --- SAVE SESSION --- */
  function saveSession(user) {
    const session = {
      username: user.username,
      name:     user.name,
      role:     user.role,
      initials: user.initials,
      loginAt:  new Date().toISOString(),
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  /* --- GET SESSION --- */
  function getSession() {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  /* --- CLEAR SESSION --- */
  function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
  }

  /* --- LOGIN --- */
  function login(username, password) {
    const user = USERS.find(
      u => u.username === username.trim().toLowerCase() &&
           u.password === password
    );
    if (user) {
      saveSession(user);
      return { success: true, user };
    }
    return { success: false, message: 'Invalid username or password.' };
  }

  /* --- LOGOUT --- */
  function logout() {
    clearSession();
    window.location.href = 'index.html';
  }

  /* --- GUARD: call on every protected page --- */
  function requireAuth() {
    const session = getSession();
    if (!session) {
      window.location.href = 'index.html';
      return null;
    }
    return session;
  }

  /* --- INJECT USER INFO into topbar --- */
  function injectUser() {
    const session = getSession();
    if (!session) return;

    const nameEl     = document.getElementById('user-name');
    const roleEl     = document.getElementById('user-role');
    const initialsEl = document.getElementById('user-initials');

    if (nameEl)     nameEl.textContent     = session.name;
    if (roleEl)     roleEl.textContent     = session.role;
    if (initialsEl) initialsEl.textContent = session.initials;
  }

  /* --- PUBLIC API --- */
  return { login, logout, requireAuth, getSession, injectUser };

})();


/* ============================================
   LOGIN FORM HANDLER — only runs on index.html
   ============================================ */
(function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  /* If already logged in, skip to dashboard */
  if (RevaAuth.getSession()) {
    window.location.href = 'dashboard.html';
    return;
  }

  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const errorBox      = document.getElementById('login-error');
  const loginBtn      = document.getElementById('login-btn');
  const btnText       = document.getElementById('btn-text');
  const spinner       = document.getElementById('btn-spinner');
  const togglePwd     = document.getElementById('toggle-password');

  /* Toggle password visibility */
  if (togglePwd) {
    togglePwd.addEventListener('click', () => {
      const isText = passwordInput.type === 'text';
      passwordInput.type = isText ? 'password' : 'text';
      togglePwd.className = isText ? 'ti ti-eye toggle-password' : 'ti ti-eye-off toggle-password';
    });
  }

  /* Show error */
  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.classList.add('show');
  }

  /* Hide error */
  function hideError() {
    errorBox.classList.remove('show');
  }

  /* Set loading state */
  function setLoading(loading) {
    loginBtn.disabled = loading;
    btnText.style.display  = loading ? 'none' : 'inline';
    spinner.style.display  = loading ? 'block' : 'none';
  }

  /* Submit */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    hideError();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
      showError('Please enter your username and password.');
      return;
    }

    setLoading(true);

    /* Simulate network delay */
    setTimeout(() => {
      const result = RevaAuth.login(username, password);
      if (result.success) {
        window.location.href = 'dashboard.html';
      } else {
        setLoading(false);
        showError(result.message);
        passwordInput.value = '';
        passwordInput.focus();
      }
    }, 800);
  });

  /* Clear error on input */
  [usernameInput, passwordInput].forEach(el => {
    el.addEventListener('input', hideError);
  });

})();
