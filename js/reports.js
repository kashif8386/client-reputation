/* ============================================
   REVA REPUTATION MANAGER — REPORTS PAGE JS
   reports.js — Only runs on reports.html
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  const session = RevaAuth.requireAuth();
  if (!session) return;

  const clients = RevaData.getAll();
  const month   = 'June 2024';

  /* --- RENDER STATS --- */
  function renderStats() {
    const sent      = clients.filter(c => c.monthly_report === 'sent').length;
    const pending   = clients.filter(c => c.monthly_report === 'pending').length;
    const generating = clients.filter(c => c.monthly_report === 'generating').length;
    const total     = clients.length;

    document.getElementById('rp-total').textContent      = total;
    document.getElementById('rp-sent').textContent       = sent;
    document.getElementById('rp-generating').textContent = generating;
    document.getElementById('rp-pending').textContent    = pending;
  }

  /* --- RENDER REPORTS LIST --- */
  function renderReports() {
    const container = document.getElementById('reports-list');

    container.innerHTML = clients.map(c => {
      const avgRating = ((c.google_rating + c.facebook_rating) / 2).toFixed(1);
      const statusConfig = {
        sent:       { badge: 'badge-success', label: 'Sent ✓',       icon: 'ti-circle-check' },
        pending:    { badge: 'badge-urgent',  label: 'Pending',       icon: 'ti-clock' },
        generating: { badge: 'badge-warning', label: 'Generating...', icon: 'ti-loader-2' },
      };
      const sc = statusConfig[c.monthly_report] || statusConfig.pending;

      return `
        <div class="report-row">
          <div class="report-client-avatar" style="background:${c.color}">${c.initials}</div>
          <div class="report-info">
            <div class="report-client-name">${c.name}</div>
            <div class="report-meta">
              <span class="report-period"><i class="ti ti-calendar"></i> ${month}</span>
              <span class="badge ${sc.badge}" style="font-size:10px;">
                <i class="ti ${sc.icon}"></i> ${sc.label}
              </span>
              <span class="text-muted text-sm">${c.category}</span>
            </div>
          </div>

          <div class="report-mini-stats">
            <div class="report-mini-stat">
              <span class="mini-val">${avgRating}★</span>
              <span class="mini-label">Avg Rating</span>
            </div>
            <div class="report-mini-stat">
              <span class="mini-val">${c.total_reviews}</span>
              <span class="mini-label">Reviews</span>
            </div>
            <div class="report-mini-stat">
              <span class="mini-val">${c.response_rate}%</span>
              <span class="mini-label">Response</span>
            </div>
          </div>

          <div class="report-right">
            <button class="btn btn-secondary btn-sm" onclick="previewReport(${c.id})">
              <i class="ti ti-eye"></i> Preview
            </button>
            ${c.monthly_report === 'sent'
              ? `<button class="btn btn-ghost btn-sm"><i class="ti ti-send"></i> Resend</button>`
              : `<button class="btn btn-primary btn-sm" onclick="generateReport(${c.id})">
                   <i class="ti ti-file-analytics"></i> Generate
                 </button>`
            }
          </div>
        </div>`;
    }).join('');
  }

  /* --- PREVIEW REPORT --- */
  window.previewReport = function(id) {
    const client  = RevaData.getById(id);
    if (!client) return;

    const avg = ((client.google_rating + client.facebook_rating) / 2).toFixed(1);
    const pending = client.reviews.filter(r => !r.replied).length;
    const replied = client.reviews.length - pending;

    document.getElementById('preview-client-name').textContent  = client.name;
    document.getElementById('preview-period').textContent       = `Monthly Report — ${month}`;
    document.getElementById('preview-google').textContent       = client.google_rating + '★';
    document.getElementById('preview-facebook').textContent     = client.facebook_rating + '★';
    document.getElementById('preview-total').textContent        = client.total_reviews;
    document.getElementById('preview-response').textContent     = client.response_rate + '%';
    document.getElementById('preview-replied').textContent      = replied + ' replied';
    document.getElementById('preview-pending').textContent      = pending + ' pending';

    document.getElementById('preview-modal').classList.add('show');
  };

  /* --- GENERATE REPORT --- */
  window.generateReport = function(id) {
    const client = RevaData.getById(id);
    if (!client) return;
    alert(`Generating report for ${client.name}...\n\nIn the full version, this will auto-generate a PDF and email it to the client.`);
  };

  /* --- CLOSE MODAL --- */
  window.closeModal = function() {
    document.getElementById('preview-modal').classList.remove('show');
  };

  document.getElementById('preview-modal').addEventListener('click', (e) => {
    if (e.target.id === 'preview-modal') closeModal();
  });

  /* --- GENERATE ALL --- */
  window.generateAll = function() {
    alert(`Generating reports for all ${clients.length} clients...\n\nIn the full version, this will batch-generate all PDFs and email them.`);
  };

  /* --- INIT --- */
  renderStats();
  renderReports();

});
