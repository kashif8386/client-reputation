/* ============================================
   REVA REPUTATION MANAGER — SIDEBAR JS
   sidebar.js — Handles sidebar on every page
   ============================================ */

const RevaSidebar = (() => {

  /* --- LOAD SIDEBAR HTML INTO PAGE --- */
  async function load() {
    const placeholder = document.getElementById('sidebar-placeholder');
    if (!placeholder) return;

    try {
      const res  = await fetch('components/sidebar.html');
      const html = await res.text();
      placeholder.innerHTML = html;

      setActiveLink();
      bindLogout();
      bindMobile();

      /* Inject user info from session */
      if (typeof RevaAuth !== 'undefined') {
        RevaAuth.injectUser();
      }

    } catch (err) {
      console.error('Sidebar load failed:', err);
    }
  }

  /* --- HIGHLIGHT CURRENT PAGE LINK --- */
  function setActiveLink() {
    const page = getCurrentPage();
    const links = document.querySelectorAll('.nav-item[data-page]');
    links.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.page === page) {
        link.classList.add('active');
      }
    });
  }

  /* --- GET CURRENT PAGE NAME --- */
  function getCurrentPage() {
    const path = window.location.pathname;
    const file = path.split('/').pop().replace('.html', '');
    return file || 'dashboard';
  }

  /* --- BIND LOGOUT BUTTON --- */
  function bindLogout() {
    const btn = document.getElementById('logout-btn');
    if (btn && typeof RevaAuth !== 'undefined') {
      btn.addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
          RevaAuth.logout();
        }
      });
    }
  }

  /* --- MOBILE SIDEBAR TOGGLE --- */
  function bindMobile() {
    const sidebar  = document.getElementById('sidebar');
    const overlay  = document.getElementById('sidebar-overlay');
    const menuBtn  = document.getElementById('mobile-menu-btn');

    if (menuBtn && sidebar && overlay) {
      menuBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
        overlay.classList.add('show');
      });

      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
      });
    }
  }

  /* --- UPDATE BADGE COUNT --- */
  function setBadge(id, count) {
    const badge = document.getElementById(id);
    if (!badge) return;
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'inline';
    } else {
      badge.style.display = 'none';
    }
  }

  return { load, setBadge };

})();


/* --- AUTO INIT ON DOM READY --- */
document.addEventListener('DOMContentLoaded', () => {
  RevaSidebar.load();
});
