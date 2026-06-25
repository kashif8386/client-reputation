/* ============================================
   REVA REPUTATION MANAGER — SETTINGS JS
   settings.js — Only runs on settings.html
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  const session = RevaAuth.requireAuth();
  if (!session) return;

  /* --- SECTION NAV --- */
  const navItems  = document.querySelectorAll('.settings-nav-item');
  const sections  = document.querySelectorAll('.settings-section');

  function showSection(id) {
    sections.forEach(s => s.classList.remove('active'));
    navItems.forEach(n => n.classList.remove('active'));

    const target  = document.getElementById(`section-${id}`);
    const navItem = document.querySelector(`.settings-nav-item[data-section="${id}"]`);

    if (target)  target.classList.add('active');
    if (navItem) navItem.classList.add('active');
  }

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      showSection(item.dataset.section);
    });
  });

  /* --- SAVE BAR: show on any input change --- */
  const saveBar = document.getElementById('save-bar');

  document.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('change', () => {
      if (saveBar) saveBar.classList.add('show');
    });
  });

  window.saveSettings = function() {
    const btn = document.getElementById('save-btn');
    if (btn) {
      btn.textContent = 'Saving...';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = '<i class="ti ti-check"></i> Saved!';
        btn.style.background = 'var(--status-success)';
        setTimeout(() => {
          btn.innerHTML = '<i class="ti ti-device-floppy"></i> Save Changes';
          btn.style.background = '';
          btn.disabled = false;
          if (saveBar) saveBar.classList.remove('show');
        }, 1500);
      }, 800);
    }
  };

  window.discardChanges = function() {
    if (saveBar) saveBar.classList.remove('show');
  };

  /* --- POPULATE PROFILE FROM SESSION --- */
  function populateProfile() {
    const nameEl  = document.getElementById('profile-name-display');
    const roleEl  = document.getElementById('profile-role-display');
    const initEl  = document.getElementById('profile-avatar-initials');
    const fnameEl = document.getElementById('field-firstname');
    const lnameEl = document.getElementById('field-lastname');

    if (nameEl)  nameEl.textContent  = session.name;
    if (roleEl)  roleEl.textContent  = session.role;
    if (initEl)  initEl.textContent  = session.initials;

    if (fnameEl && session.name) fnameEl.value = session.name.split(' ')[0] || '';
    if (lnameEl && session.name) lnameEl.value = session.name.split(' ')[1] || '';
  }

  /* --- RENDER CLIENT LIST IN SETTINGS --- */
  function renderClientList() {
    const container = document.getElementById('settings-client-list');
    if (!container) return;

    const clients = RevaData.getAll();
    container.innerHTML = clients.map(c => `
      <div class="client-manage-row">
        <div class="client-manage-avatar" style="background:${c.color}">${c.initials}</div>
        <div class="client-manage-info">
          <div class="client-manage-name">${c.name}</div>
          <div class="client-manage-meta">
            <i class="ti ti-${c.platforms.includes('google') ? 'brand-google' : 'x'}" style="font-size:12px;"></i> Google
            <span>·</span>
            <i class="ti ti-brand-facebook" style="font-size:12px;"></i> Facebook
            <span>·</span> ${c.category}
          </div>
        </div>
        <div class="client-manage-actions">
          <button class="btn btn-secondary btn-sm">
            <i class="ti ti-edit"></i> Edit
          </button>
          <button class="btn btn-sm" style="background:#fff5f5;color:var(--status-urgent);border:1px solid #feb2b2;">
            <i class="ti ti-trash"></i>
          </button>
        </div>
      </div>`
    ).join('');
  }

  /* --- INIT --- */
  showSection('profile');
  populateProfile();
  renderClientList();

});
