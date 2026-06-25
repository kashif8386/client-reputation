/* ============================================
   REVA REPUTATION MANAGER — DASHBOARD JS
   dashboard.js — Only runs on dashboard.html
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- AUTH GUARD --- */
  const session = RevaAuth.requireAuth();
  if (!session) return;

  /* --- RENDER STATS --- */
  function renderStats() {
    const s = RevaData.getSummary();

    document.getElementById('stat-clients').textContent  = s.total;
    document.getElementById('stat-rating').textContent   = s.avgRating;
    document.getElementById('stat-pending').textContent  = s.pending;
    document.getElementById('stat-response').textContent = s.avgResponse + '%';

    /* Topbar greeting */
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const greetEl = document.getElementById('topbar-greeting');
    if (greetEl) greetEl.textContent = `${greeting}, ${session.name.split(' ')[0]} 👋`;
  }

  /* --- RENDER CLIENT CARDS --- */
  function renderClients(filter = 'all', search = '') {
    const grid = document.getElementById('clients-grid');
    let clients = RevaData.getAll();

    /* Filter by status */
    if (filter === 'urgent')    clients = clients.filter(c => c.status === 'needs-attention');
    if (filter === 'excellent') clients = clients.filter(c => c.status === 'excellent');
    if (filter === 'pending')   clients = clients.filter(c => c.pending_replies > 0);

    /* Filter by search */
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      clients = clients.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }

    if (clients.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <i class="ti ti-users-off"></i>
          <h4>No clients found</h4>
          <p>Try a different filter or search term.</p>
        </div>`;
      return;
    }

    grid.innerHTML = clients.map(c => buildClientCard(c)).join('');
  }

  /* --- BUILD SINGLE CLIENT CARD HTML --- */
  function buildClientCard(c) {
    const status    = RevaData.getStatus(c.status);
    const gStars    = RevaData.starsHTML(c.google_rating);
    const fStars    = RevaData.starsHTML(c.facebook_rating);

    const pendingText = c.pending_replies === 0
      ? `<span class="pending-dot clear"></span> All replied`
      : `<span class="pending-dot ${c.pending_replies >= 3 ? 'urgent' : ''}"></span> ${c.pending_replies} pending repl${c.pending_replies > 1 ? 'ies' : 'y'}`;

    return `
      <a class="client-card" href="client.html?id=${c.id}">
        <div class="client-card-accent" style="background:${c.color}"></div>
        <div class="client-card-body">

          <div class="client-card-top">
            <div style="display:flex;align-items:center;gap:12px;flex:1;min-width:0">
              <div class="client-avatar" style="background:${c.color}">
                ${c.initials}
              </div>
              <div style="min-width:0">
                <div class="client-name">${c.name}</div>
                <div class="client-category">
                  <i class="ti ${c.icon}"></i> ${c.category}
                </div>
              </div>
            </div>
            <span class="badge ${status.badge}">${status.label}</span>
          </div>

          <div class="client-rating-row">
            <div class="client-platform-rating">
              <span class="client-platform-label">
                <i class="ti ti-brand-google"></i> Google
              </span>
              <span class="client-platform-score">${c.google_rating}</span>
              <span class="client-platform-stars stars">${gStars}</span>
            </div>
            <div class="rating-divider"></div>
            <div class="client-platform-rating">
              <span class="client-platform-label">
                <i class="ti ti-brand-facebook"></i> Facebook
              </span>
              <span class="client-platform-score">${c.facebook_rating}</span>
              <span class="client-platform-stars stars">${fStars}</span>
            </div>
          </div>

          <div class="client-card-footer">
            <div class="client-pending">
              ${pendingText}
            </div>
            <span class="text-muted text-sm">${c.total_reviews} reviews</span>
            <div class="client-arrow">
              <i class="ti ti-arrow-right"></i>
            </div>
          </div>

        </div>
      </a>`;
  }

  /* --- FILTER BUTTONS --- */
  function bindFilters() {
    const btns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('client-search');
    let activeFilter = 'all';

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        renderClients(activeFilter, searchInput ? searchInput.value : '');
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        renderClients(activeFilter, searchInput.value);
      });
    }
  }

  /* --- INIT --- */
  renderStats();
  renderClients();
  bindFilters();

});
