(function () {
  if (window.__devNavLoaded) return;
  window.__devNavLoaded = true;

  var pages = [
    { href: '/',              label: 'Login' },
    { href: '/portal',        label: 'Empleado' },
    { href: '/dashboard',     label: 'Dashboard' },
    { href: '/tickets',       label: 'Tickets' },
    { href: '/asignar',       label: 'Asignar' },
    { href: '/ticket-detail', label: 'Detalle' },
    { href: '/kb',            label: 'KB' },
    { href: '/reportes',      label: 'Reportes' },
  ];

  var here = (location.pathname.replace(/\/+$/, '') || '/');

  var style = document.createElement('style');
  style.textContent =
    '.dev-nav{position:fixed;left:50%;bottom:8px;transform:translateX(-50%);' +
    'z-index:9999;display:flex;gap:0;background:rgba(15,23,42,.92);color:#fff;' +
    'border-radius:4px;padding:4px;font-family:Inter,system-ui,sans-serif;' +
    'font-size:11px;box-shadow:0 4px 12px rgba(0,0,0,.2)}' +
    '.dev-nav .lbl{padding:6px 10px;opacity:.5;letter-spacing:.12em;' +
    'text-transform:uppercase;font-weight:600;' +
    'border-right:1px solid rgba(255,255,255,.15)}' +
    '.dev-nav a{color:rgba(255,255,255,.85);text-decoration:none;' +
    'padding:6px 10px;border-radius:3px;letter-spacing:.04em}' +
    '.dev-nav a:hover{background:rgba(255,255,255,.1);color:#fff}' +
    '.dev-nav a.on{background:#E30512;color:#fff}';
  document.head.appendChild(style);

  function render() {
    var nav = document.createElement('nav');
    nav.className = 'dev-nav';

    var lbl = document.createElement('span');
    lbl.className = 'lbl';
    lbl.textContent = 'Prototype';
    nav.appendChild(lbl);

    pages.forEach(function (p) {
      var a = document.createElement('a');
      a.href = p.href;
      a.textContent = p.label;
      if (p.href === here) a.className = 'on';
      nav.appendChild(a);
    });

    document.body.appendChild(nav);
  }

  // Auto-wire prototype navigation: any element matching one of these
  // selectors becomes a clickable shortcut to the mapped route. The
  // existing inline onclick handlers (e.g. row-toggle in /asignar) keep
  // firing — this just adds a navigation side-effect on top.
  var navMap = [
    { sel: '.tbl tbody tr, .full tbody tr, .log-tbl tbody tr, .my-tickets-row, .un-card', href: '/ticket-detail' },
    { sel: '.tech-tbl tbody tr, .suc-card', href: '/tickets' },
    { sel: '.kb-tbl tbody tr', href: '/kb' },
  ];

  function wireClick(el, href) {
    if (el.tagName === 'A' || el.dataset.protoWired === '1') return;
    el.dataset.protoWired = '1';
    el.style.cursor = 'pointer';
    el.addEventListener('click', function (e) {
      if (e.target.closest('a, button, input, select, textarea, label')) return;
      location.href = href;
    });
  }

  function wireAll() {
    navMap.forEach(function (m) {
      document.querySelectorAll(m.sel).forEach(function (el) {
        wireClick(el, m.href);
      });
    });

    // Context-specific: KB suggestion cards in ticket-detail right rail
    document.querySelectorAll('.rail-block').forEach(function (rb) {
      var h = rb.querySelector('.rail-h h4');
      if (h && h.textContent.trim() === 'Base de conocimiento') {
        rb.querySelectorAll('.rail-b > div > div').forEach(function (card) {
          wireClick(card, '/kb');
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      render();
      wireAll();
    });
  } else {
    render();
    wireAll();
  }
})();
