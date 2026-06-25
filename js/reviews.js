/* ============================================
   REVA REPUTATION MANAGER — REVIEWS PAGE JS
   reviews.js — Only runs on reviews.html
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- AUTH GUARD --- */
  const session = RevaAuth.requireAuth();
  if (!session) return;

  /* --- STATE --- */
  let allReviews   = RevaData.getAllReviews();
  let activeTab    = 'all';
  let activeClient = 'all';
  let searchQuery  = '';

  /* --- RENDER STATS STRIP --- */
  function renderStats() {
    const total    = allReviews.length;
    const pending  = allReviews.filter(r => !r.replied).length;
    const urgent   = allReviews.filter(r => r.urgent && !r.replied).length;
    const positive = allReviews.filter(r => r.rating >= 4).length;

    document.getElementById('rs-total').textContent    = total;
    document.getElementById('rs-pending').textContent  = pending;
    document.getElementById('rs-urgent').textContent   = urgent;
    document.getElementById('rs-positive').textContent = positive;
  }

  /* --- BUILD CLIENT FILTER LIST --- */
  function renderClientFilter() {
    const clients   = RevaData.getAll();
    const container = document.getElementById('client-filter-list');

    const allCount = allReviews.length;
    let html = `
      <div class="filter-option active" data-client="all" onclick="setClientFilter('all', this)">
        <span><i class="ti ti-users" style="font-size:13px;margin-right:4px"></i> All Clients</span>
        <span class="filter-count">${allCount}</span>
      </div>`;

    clients.forEach(c => {
      const count = allReviews.filter(r => r.clientId === c.id).length;
      html += `
        <div class="filter-option" data-client="${c.id}" onclick="setClientFilter(${c.id}, this)">
          <span style="display:flex;align-items:center;gap:6px;">
            <span style="width:8px;height:8px;border-radius:50%;background:${c.color};flex-shrink:0;display:inline-block;"></span>
            ${c.name}
          </span>
          <span class="filter-count">${count}</span>
        </div>`;
    });

    container.innerHTML = html;
  }

  /* --- SET CLIENT FILTER --- */
  window.setClientFilter = function(clientId, el) {
    document.querySelectorAll('.filter-option').forEach(o => o.classList.remove('active'));
    el.classList.add('active');
    activeClient = clientId;
    renderReviews();
  };

  /* --- GET FILTERED REVIEWS --- */
  function getFiltered() {
    let reviews = [...allReviews];

    /* Client filter */
    if (activeClient !== 'all') {
      reviews = reviews.filter(r => r.clientId === parseInt(activeClient));
    }

    /* Tab filter */
    if (activeTab === 'pending')  reviews = reviews.filter(r => !r.replied);
    if (activeTab === 'urgent')   reviews = reviews.filter(r => r.urgent && !r.replied);
    if (activeTab === 'positive') reviews = reviews.filter(r => r.rating >= 4);
    if (activeTab === 'negative') reviews = reviews.filter(r => r.rating <= 2);
    if (activeTab === 'google')   reviews = reviews.filter(r => r.platform === 'google');
    if (activeTab === 'facebook') reviews = reviews.filter(r => r.platform === 'facebook');

    /* Search */
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      reviews = reviews.filter(r =>
        r.author.toLowerCase().includes(q) ||
        r.text.toLowerCase().includes(q) ||
        r.clientName.toLowerCase().includes(q)
      );
    }

    return reviews;
  }

  /* --- RENDER REVIEWS LIST --- */
  function renderReviews() {
    const reviews   = getFiltered();
    const container = document.getElementById('reviews-inbox-list');
    const countEl   = document.getElementById('inbox-count');

    if (countEl) countEl.textContent = `${reviews.length} review${reviews.length !== 1 ? 's' : ''}`;

    if (reviews.length === 0) {
      container.innerHTML = `
        <div class="inbox-empty">
          <i class="ti ti-message-off"></i>
          <p>No reviews match your filter.</p>
        </div>`;
      return;
    }

    container.innerHTML = reviews.map(r => buildReviewRow(r)).join('');
  }

  /* --- BUILD SINGLE REVIEW ROW --- */
  function buildReviewRow(r) {
    const initials = r.author.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
    const stars    = RevaData.starsHTML(r.rating);
    const client   = RevaData.getById(r.clientId);
    const color    = client ? client.color : '#888';

    const platform = r.platform === 'google'
      ? `<span class="platform-tag platform-google"><i class="ti ti-brand-google"></i> Google</span>`
      : `<span class="platform-tag platform-facebook"><i class="ti ti-brand-facebook"></i> Facebook</span>`;

    const urgentBadge = r.urgent && !r.replied
      ? `<span class="badge badge-urgent" style="font-size:10px;">🔴 Urgent</span>` : '';

    const repliedBadge = r.replied
      ? `<span style="font-size:11px;color:var(--status-success);font-weight:600;display:flex;align-items:center;gap:3px;"><i class="ti ti-check"></i> Replied</span>`
      : '';

    const aiBtn = !r.replied
      ? `<button class="btn btn-sm" style="background:#f0fdf8;color:#0f6e56;border:1px solid #a7f3d0;font-size:11px;" onclick="toggleReply('${r.id}', event)">
           <i class="ti ti-sparkles"></i> AI Reply
         </button>` : '';

    const viewBtn = `<a href="client.html?id=${r.clientId}" class="btn btn-ghost btn-sm" style="font-size:11px;">
      <i class="ti ti-external-link"></i> View Client
    </a>`;

    return `
      <div class="inbox-review ${r.urgent && !r.replied ? 'is-urgent' : ''} ${r.replied ? 'is-replied' : ''}" id="inbox-review-${r.id}">
        <div class="inbox-row-top">
          <div class="inbox-author">
            <div class="inbox-avatar" style="background:${color}">${initials}</div>
            <div style="min-width:0;">
              <div class="inbox-author-name">${r.author}</div>
              <div class="inbox-author-meta">
                ${platform}
                <span class="client-chip">${r.clientName}</span>
                <span class="text-muted text-sm">${formatDate(r.date)}</span>
              </div>
            </div>
          </div>
          <div class="inbox-right">
            <span class="stars" style="font-size:12px;">${stars}</span>
            ${urgentBadge}
            ${repliedBadge}
          </div>
        </div>

        <p class="inbox-review-text">${r.text}</p>

        <div class="inbox-actions">
          ${aiBtn}
          ${viewBtn}
        </div>

        <!-- AI Reply Area -->
        <div class="inbox-reply-area" id="reply-area-${r.id}">
          <div class="reply-label">
            <i class="ti ti-sparkles"></i> AI Suggested Reply
          </div>
          <textarea class="reply-textarea" id="reply-text-${r.id}">${generateReply(r)}</textarea>
          <div class="reply-btns">
            <button class="btn btn-primary btn-sm" onclick="postReply('${r.id}')">
              <i class="ti ti-send"></i> Post Reply
            </button>
            <button class="btn btn-secondary btn-sm" onclick="regenerate('${r.id}')">
              <i class="ti ti-refresh"></i> Regenerate
            </button>
            <button class="btn btn-ghost btn-sm" onclick="toggleReply('${r.id}', event)">
              Cancel
            </button>
          </div>
        </div>

      </div>`;
  }

  /* --- TOGGLE AI REPLY AREA --- */
  window.toggleReply = function(id, event) {
    if (event) event.stopPropagation();
    const area = document.getElementById(`reply-area-${id}`);
    if (area) area.classList.toggle('show');
  };

  /* --- POST REPLY --- */
  window.postReply = function(id) {
    const area   = document.getElementById(`reply-area-${id}`);
    const row    = document.getElementById(`inbox-review-${id}`);
    if (area) area.classList.remove('show');
    if (row) {
      row.classList.remove('is-urgent');
      row.classList.add('is-replied');
      const actions = row.querySelector('.inbox-actions');
      if (actions) {
        actions.innerHTML = `<span style="font-size:11px;color:var(--status-success);font-weight:600;display:flex;align-items:center;gap:3px;"><i class="ti ti-check"></i> Replied</span>
          <a href="client.html?id=${id}" class="btn btn-ghost btn-sm" style="font-size:11px;"><i class="ti ti-external-link"></i> View Client</a>`;
      }
    }
    /* Update pending count */
    const pendingEl = document.getElementById('rs-pending');
    if (pendingEl) pendingEl.textContent = Math.max(0, parseInt(pendingEl.textContent) - 1);
  };

  /* --- REGENERATE REPLY --- */
  window.regenerate = function(id) {
    const ta = document.getElementById(`reply-text-${id}`);
    if (ta) {
      ta.style.opacity = '0.4';
      setTimeout(() => { ta.style.opacity = '1'; }, 500);
    }
  };

  /* --- AI REPLY GENERATOR --- */
  function generateReply(r) {
    const name   = r.author.split(' ')[0];
    const client = RevaData.getById(r.clientId);
    const cName  = client ? client.name : 'our business';

    if (r.rating >= 4) {
      return `Thank you so much, ${name}! We truly appreciate your kind words about ${cName}. It means the world to our team to know you had a great experience. We look forward to welcoming you back soon! 😊`;
    } else if (r.rating === 3) {
      return `Thank you for taking the time to share your feedback, ${name}. We're glad you visited ${cName}, and we're sorry the experience wasn't perfect. Your comments help us improve, and we hope to see you again soon for a better visit!`;
    } else {
      return `Dear ${name}, we sincerely apologize for your experience at ${cName}. This is not the standard we hold ourselves to, and we take your feedback very seriously. We'd love the opportunity to make things right — please reach out to us directly so we can resolve this personally. Thank you for bringing this to our attention.`;
    }
  }

  /* --- FORMAT DATE --- */
  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }

  /* --- TAB BINDINGS --- */
  function bindTabs() {
    document.querySelectorAll('.inbox-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.inbox-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeTab = tab.dataset.filter;
        renderReviews();
      });
    });
  }

  /* --- SEARCH BINDING --- */
  function bindSearch() {
    const input = document.getElementById('inbox-search-input');
    if (!input) return;
    input.addEventListener('input', () => {
      searchQuery = input.value;
      renderReviews();
    });
  }

  /* --- INIT --- */
  renderStats();
  renderClientFilter();
  renderReviews();
  bindTabs();
  bindSearch();

});
