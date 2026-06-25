/* ============================================
   REVA REPUTATION MANAGER — CLIENT PAGE JS
   client.js — Only runs on client.html
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- AUTH GUARD --- */
  const session = RevaAuth.requireAuth();
  if (!session) return;

  /* --- GET CLIENT ID FROM URL --- */
  const params   = new URLSearchParams(window.location.search);
  const clientId = params.get('id');
  const client   = RevaData.getById(clientId);

  if (!client) {
    document.body.innerHTML = `
      <div class="flex-center" style="min-height:100vh;flex-direction:column;gap:12px;">
        <i class="ti ti-alert-circle" style="font-size:48px;color:#e53e3e"></i>
        <h2>Client not found</h2>
        <a href="dashboard.html" class="btn btn-primary">Back to Dashboard</a>
      </div>`;
    return;
  }

  /* --- SET PAGE TITLE --- */
  document.title = `${client.name} — Reva Reputation Manager`;

  /* --- RENDER HEADER --- */
  function renderHeader() {
    document.getElementById('client-accent').style.background = client.color;
    document.getElementById('client-avatar').style.background = client.color;
    document.getElementById('client-avatar').textContent = client.initials;
    document.getElementById('client-name').textContent = client.name;
    document.getElementById('client-category-tag').innerHTML = `<i class="ti ${client.icon}"></i> ${client.category}`;
    document.getElementById('client-location-tag').innerHTML = `<i class="ti ti-map-pin"></i> ${client.location}`;
    document.getElementById('client-email-tag').innerHTML = `<i class="ti ti-mail"></i> ${client.contact}`;

    const status = RevaData.getStatus(client.status);
    document.getElementById('client-status-badge').className = `badge ${status.badge}`;
    document.getElementById('client-status-badge').textContent = status.label;

    /* Topbar */
    document.getElementById('topbar-client-name').textContent = client.name;
  }

  /* --- RENDER STATS --- */
  function renderStats() {
    const avgRating = ((client.google_rating + client.facebook_rating) / 2).toFixed(1);

    document.getElementById('cs-google').textContent   = client.google_rating;
    document.getElementById('cs-facebook').textContent = client.facebook_rating;
    document.getElementById('cs-total').textContent    = client.total_reviews;
    document.getElementById('cs-pending').textContent  = client.pending_replies;
    document.getElementById('cs-response').textContent = client.response_rate + '%';

    const fill = document.getElementById('response-bar-fill');
    if (fill) fill.style.width = client.response_rate + '%';
  }

  /* --- RENDER REVIEWS --- */
  function renderReviews(filter = 'all') {
    const container = document.getElementById('reviews-list');
    let reviews = [...client.reviews];

    if (filter === 'pending')  reviews = reviews.filter(r => !r.replied);
    if (filter === 'urgent')   reviews = reviews.filter(r => r.urgent);
    if (filter === 'google')   reviews = reviews.filter(r => r.platform === 'google');
    if (filter === 'facebook') reviews = reviews.filter(r => r.platform === 'facebook');

    if (reviews.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="ti ti-message-off"></i>
          <p>No reviews match this filter.</p>
        </div>`;
      return;
    }

    container.innerHTML = reviews.map(r => buildReviewItem(r)).join('');
    bindReplyButtons();
  }

  /* --- BUILD REVIEW ITEM HTML --- */
  function buildReviewItem(r) {
    const initials = r.author.split(' ').map(w => w[0]).join('').toUpperCase();
    const stars    = RevaData.starsHTML(r.rating);
    const platform = r.platform === 'google'
      ? `<span class="platform-tag platform-google"><i class="ti ti-brand-google"></i> Google</span>`
      : `<span class="platform-tag platform-facebook"><i class="ti ti-brand-facebook"></i> Facebook</span>`;

    const repliedTag = r.replied
      ? `<span class="replied-tag"><i class="ti ti-check"></i> Replied</span>`
      : '';

    const urgentBadge = r.urgent && !r.replied
      ? `<span class="badge badge-urgent">🔴 Urgent</span>`
      : '';

    const aiBtn = !r.replied
      ? `<button class="btn btn-sm" style="background:#f0fdf8;color:#0f6e56;border:1px solid #a7f3d0;" onclick="toggleAIReply(${r.id})">
           <i class="ti ti-sparkles"></i> AI Reply
         </button>`
      : '';

    return `
      <div class="review-item ${r.urgent && !r.replied ? 'urgent-review' : ''}" id="review-${r.id}">
        <div class="review-item-top">
          <div class="review-author">
            <div class="review-author-avatar">${initials}</div>
            <div>
              <div class="review-author-name">${r.author}</div>
              <div class="review-author-meta">
                ${platform}
                <span class="review-date">${formatDate(r.date)}</span>
              </div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:6px;flex-shrink:0">
            ${urgentBadge}
            <span class="stars">${stars}</span>
          </div>
        </div>

        <p class="review-text">${r.text}</p>

        <div class="review-actions">
          ${aiBtn}
          ${repliedTag}
        </div>

        <!-- AI Reply Box -->
        <div class="ai-reply-box" id="ai-box-${r.id}">
          <div class="ai-reply-label">
            <i class="ti ti-sparkles"></i> AI Suggested Reply
          </div>
          <textarea class="ai-reply-text" id="ai-text-${r.id}">${generateAIReply(r)}</textarea>
          <div class="ai-reply-actions">
            <button class="btn btn-primary btn-sm" onclick="markReplied(${r.id})">
              <i class="ti ti-send"></i> Post Reply
            </button>
            <button class="btn btn-secondary btn-sm" onclick="regenerateReply(${r.id})">
              <i class="ti ti-refresh"></i> Regenerate
            </button>
            <button class="btn btn-ghost btn-sm" onclick="toggleAIReply(${r.id})">
              Cancel
            </button>
          </div>
        </div>

      </div>`;
  }

  /* --- AI REPLY GENERATOR (simple template-based) --- */
  function generateAIReply(r) {
    const name = r.author.split(' ')[0];
    if (r.rating >= 4) {
      return `Thank you so much, ${name}! We're thrilled to hear about your positive experience at ${client.name}. Your kind words mean a lot to our team, and we look forward to welcoming you back soon! 😊`;
    } else if (r.rating === 3) {
      return `Thank you for your feedback, ${name}. We appreciate you taking the time to share your experience. We're sorry it wasn't perfect — we take your comments seriously and will work to improve. We hope to see you again and give you an even better experience!`;
    } else {
      return `Dear ${name}, we sincerely apologize for your disappointing experience. This is not the standard we set for ourselves at ${client.name}. We'd love the opportunity to make things right — please reach out to us directly at ${client.contact} so we can resolve this personally. Thank you for bringing this to our attention.`;
    }
  }

  /* --- TOGGLE AI REPLY BOX --- */
  window.toggleAIReply = function(id) {
    const box = document.getElementById(`ai-box-${id}`);
    if (box) box.classList.toggle('show');
  };

  /* --- MARK AS REPLIED --- */
  window.markReplied = function(id) {
    const box = document.getElementById(`ai-box-${id}`);
    if (box) box.classList.remove('show');

    const item = document.getElementById(`review-${id}`);
    if (item) {
      item.classList.remove('urgent-review');
      const actions = item.querySelector('.review-actions');
      if (actions) {
        actions.innerHTML = `<span class="replied-tag"><i class="ti ti-check"></i> Replied</span>`;
      }
    }
  };

  /* --- REGENERATE REPLY --- */
  window.regenerateReply = function(id) {
    const textarea = document.getElementById(`ai-text-${id}`);
    if (textarea) {
      textarea.style.opacity = '0.5';
      setTimeout(() => {
        textarea.style.opacity = '1';
      }, 600);
    }
  };

  /* --- REVIEW TAB FILTERS --- */
  function bindReplyButtons() {}

  function bindTabs() {
    const tabs = document.querySelectorAll('.review-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderReviews(tab.dataset.filter);
      });
    });
  }

  /* --- FORMAT DATE --- */
  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  /* --- INIT --- */
  renderHeader();
  renderStats();
  renderReviews();
  bindTabs();

});
