/* ============================================
   REVA REPUTATION MANAGER — ALERTS PAGE JS
   alerts.js — Only runs on alerts.html
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  const session = RevaAuth.requireAuth();
  if (!session) return;

  /* --- ALERTS DATA --- */
  let alerts = [
    { id: 1,  priority: 'urgent',  icon: 'ti-star-off',        title: '1★ review on Google',           desc: 'Ahmed Al-Rashid left a 1-star review: "Waited 40 minutes and no one helped us."',          client: 'Al Badr Restaurant', clientId: 1, time: '18 mins ago',  read: false, link: 'client.html?id=1' },
    { id: 2,  priority: 'urgent',  icon: 'ti-mood-angry',      title: '2★ review on Google',           desc: 'Khalid Ibrahim left a 2-star review: "Service was very slow and staff was not helpful."',  client: 'Al Badr Restaurant', clientId: 1, time: '2 hrs ago',   read: false, link: 'client.html?id=1' },
    { id: 3,  priority: 'urgent',  icon: 'ti-star-off',        title: '2★ review on Google',           desc: 'Tariq Mohammed left a 2-star review: "Order was wrong and took forever."',                 client: 'Burger Nest',        clientId: 4, time: '3 hrs ago',   read: false, link: 'client.html?id=4' },
    { id: 4,  priority: 'warning', icon: 'ti-star-half',       title: '3★ review on Facebook',         desc: 'Khalid Ibrahim left a 3-star review: "Good food but parking is always an issue."',         client: 'Burger Nest',        clientId: 4, time: '5 hrs ago',   read: false, link: 'client.html?id=4' },
    { id: 5,  priority: 'warning', icon: 'ti-star-half',       title: '3★ review on Google',           desc: 'Hessa Al-Kuwari left a 3-star review: "Good service but waiting time was a bit long."',   client: 'Glow Salon & Spa',   clientId: 2, time: '6 hrs ago',   read: true,  link: 'client.html?id=2' },
    { id: 6,  priority: 'warning', icon: 'ti-star-half',       title: '3★ review on Google',           desc: 'Saad Al-Marri left a 3-star review: "Good gym but gets very crowded in evenings."',       client: 'Peak Fitness',       clientId: 5, time: '8 hrs ago',   read: true,  link: 'client.html?id=5' },
    { id: 7,  priority: 'success', icon: 'ti-star-filled',     title: '5★ review on Google',           desc: 'Fatima Al-Jaber left a 5-star review: "Best clinic experience I\'ve had in Doha."',       client: 'SmileCare Dental',   clientId: 3, time: '5 hrs ago',   read: true,  link: 'client.html?id=3' },
    { id: 8,  priority: 'success', icon: 'ti-star-filled',     title: '5★ review on Google',           desc: 'Noor Al-Mansoori left a 5-star review: "Amazing service! Very professional team."',       client: 'Glow Salon & Spa',   clientId: 2, time: '1 hr ago',    read: true,  link: 'client.html?id=2' },
    { id: 9,  priority: 'success', icon: 'ti-star-filled',     title: '5★ review on Facebook',         desc: 'Noura Jassim left a 5-star review: "Love this gym! Clean, modern and great trainers."',   client: 'Peak Fitness',       clientId: 5, time: '9 hrs ago',   read: true,  link: 'client.html?id=5' },
    { id: 10, priority: 'info',    icon: 'ti-chart-line',      title: 'Rating dropped below 4.0',      desc: 'Al Badr Restaurant\'s Google rating has dropped to 3.4. Immediate attention recommended.',  client: 'Al Badr Restaurant', clientId: 1, time: '1 day ago',   read: false, link: 'client.html?id=1' },
    { id: 11, priority: 'info',    icon: 'ti-file-analytics',  title: 'Monthly report ready',          desc: 'SmileCare Dental\'s June report has been generated and is ready to send.',                 client: 'SmileCare Dental',   clientId: 3, time: '1 day ago',   read: true,  link: 'reports.html' },
    { id: 12, priority: 'info',    icon: 'ti-message-exclamation', title: '4 reviews pending reply',   desc: 'Al Badr Restaurant has 4 reviews waiting for a response. Reply rate is below average.',    client: 'Al Badr Restaurant', clientId: 1, time: '2 days ago',  read: true,  link: 'client.html?id=1' },
  ];

  let activeTab = 'all';

  /* --- RENDER STATS --- */
  function renderStats() {
    const urgent  = alerts.filter(a => a.priority === 'urgent').length;
    const warning = alerts.filter(a => a.priority === 'warning').length;
    const unread  = alerts.filter(a => !a.read).length;
    const total   = alerts.length;

    document.getElementById('as-total').textContent   = total;
    document.getElementById('as-unread').textContent  = unread;
    document.getElementById('as-urgent').textContent  = urgent;
    document.getElementById('as-warning').textContent = warning;

    /* Right panel summary */
    document.getElementById('sum-urgent').textContent  = urgent;
    document.getElementById('sum-warning').textContent = warning;
    document.getElementById('sum-info').textContent    = alerts.filter(a => a.priority === 'info').length;
    document.getElementById('sum-positive').textContent = alerts.filter(a => a.priority === 'success').length;
  }

  /* --- GET FILTERED ALERTS --- */
  function getFiltered() {
    if (activeTab === 'unread')  return alerts.filter(a => !a.read);
    if (activeTab === 'urgent')  return alerts.filter(a => a.priority === 'urgent');
    if (activeTab === 'warning') return alerts.filter(a => a.priority === 'warning');
    if (activeTab === 'info')    return alerts.filter(a => a.priority === 'info' || a.priority === 'success');
    return alerts;
  }

  /* --- RENDER ALERTS LIST --- */
  function renderAlerts() {
    const list      = getFiltered();
    const container = document.getElementById('alerts-list');
    const countEl   = document.getElementById('alerts-count');

    if (countEl) countEl.textContent = `${list.length} alert${list.length !== 1 ? 's' : ''}`;

    if (list.length === 0) {
      container.innerHTML = `
        <div class="alerts-empty">
          <i class="ti ti-bell-off"></i>
          <p>No alerts in this category.</p>
        </div>`;
      return;
    }

    container.innerHTML = list.map(a => buildAlertItem(a)).join('');
  }

  /* --- BUILD ALERT ITEM --- */
  function buildAlertItem(a) {
    const priorityClass = {
      urgent:  'priority-urgent',
      warning: 'priority-warning',
      success: 'priority-success',
      info:    'priority-info',
    }[a.priority];

    const badgeClass = {
      urgent:  'badge-urgent',
      warning: 'badge-warning',
      success: 'badge-success',
      info:    'badge-info',
    }[a.priority];

    const badgeLabel = {
      urgent:  '🔴 Urgent',
      warning: '🟡 Standard',
      success: '🟢 Positive',
      info:    '🔵 Info',
    }[a.priority];

    return `
      <div class="alert-item ${a.read ? '' : 'unread'}" id="alert-item-${a.id}">
        <div class="alert-priority-icon ${priorityClass}">
          <i class="ti ${a.icon}"></i>
        </div>
        <div class="alert-content">
          <div class="alert-top">
            <span class="alert-title">${a.title}</span>
            <span class="alert-time">${a.time}</span>
          </div>
          <p class="alert-desc">${a.desc}</p>
          <div class="alert-meta">
            <span class="badge ${badgeClass}" style="font-size:10px;">${badgeLabel}</span>
            <span class="alert-client-chip">${a.client}</span>
            <a href="${a.link}" class="alert-action-btn">
              <i class="ti ti-arrow-right"></i> Take Action
            </a>
            ${!a.read ? `<button class="alert-action-btn" onclick="markRead(${a.id})">
              <i class="ti ti-check"></i> Mark Read
            </button>` : ''}
          </div>
        </div>
        <i class="ti ti-x alert-dismiss" onclick="dismissAlert(${a.id})" title="Dismiss"></i>
      </div>`;
  }

  /* --- MARK AS READ --- */
  window.markRead = function(id) {
    const alert = alerts.find(a => a.id === id);
    if (alert) {
      alert.read = true;
      const item = document.getElementById(`alert-item-${id}`);
      if (item) item.classList.remove('unread');
      renderStats();
      renderAlerts();
    }
  };

  /* --- DISMISS ALERT --- */
  window.dismissAlert = function(id) {
    alerts = alerts.filter(a => a.id !== id);
    renderStats();
    renderAlerts();
  };

  /* --- MARK ALL READ --- */
  window.markAllRead = function() {
    alerts.forEach(a => a.read = true);
    renderStats();
    renderAlerts();
  };

  /* --- BIND TABS --- */
  function bindTabs() {
    document.querySelectorAll('.alert-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.alert-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeTab = tab.dataset.filter;
        renderAlerts();
      });
    });
  }

  /* --- INIT --- */
  renderStats();
  renderAlerts();
  bindTabs();

});
