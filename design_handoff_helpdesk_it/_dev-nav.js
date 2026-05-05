(function () {
  if (window.__devNavLoaded) return;
  window.__devNavLoaded = true;

  // ---------- Prototype users (role-based) ----------
  var users = {
    it: {
      role: 'it',
      id: 'UCG-IT-007',
      name: 'J. Marrero',
      title: 'UCG · Mesa de Ayuda IT',
      initials: 'JM',
      brand: 'navy',
      kvs: [
        ['ID empleado',  'UCG-IT-007'],
        ['Email',        'j.marrero@ucg.pr'],
        ['SSO',          'JMARRERO@ucg.pr'],
        ['Equipo',       'IT Support · Tier 2'],
        ['Sucursal',     'UCG · San Juan'],
        ['Ext.',         'x2104'],
        ['Turno',        'Lun–Vie · 8:00–17:00 AST'],
        ['Supervisor',   'A. Vega · Director IT'],
      ],
    },
    admin: {
      role: 'admin',
      id: 'EMP-2104',
      name: 'M. Ríos',
      title: 'Administración · Tropigas PR',
      initials: 'MR',
      brand: 'red',
      kvs: [
        ['ID empleado',  'EMP-2104'],
        ['Email',        'm.rios@tropigas.pr'],
        ['SSO',          'm.rios@tropigas.pr'],
        ['Departamento', 'Administración'],
        ['Sucursal',     'Bayamón · Oficina Central'],
        ['Ext.',         'x4521'],
        ['Equipo asig.', 'LT-BYM-0114'],
        ['Supervisor',   'L. Vega'],
      ],
    },
  };

  // ---------- Data layer (window.tg) ----------
  var tg = {
    _state: null,

    async init() {
      if (this._state) return this._state;
      var r = await fetch('/api/state');
      this._state = await r.json();
      return this._state;
    },
    async refresh() {
      this._state = null;
      return this.init();
    },
    async tickets(filter) {
      var qs = filter ? '?' + new URLSearchParams(filter).toString() : '';
      var r = await fetch('/api/tickets' + qs);
      return r.json();
    },
    async ticket(id) {
      var r = await fetch('/api/tickets/' + encodeURIComponent(id));
      if (!r.ok) return null;
      return r.json();
    },
    async createTicket(data) {
      var r = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!r.ok) throw new Error('create failed');
      return r.json();
    },
    async patchTicket(id, patch) {
      var r = await fetch('/api/tickets/' + encodeURIComponent(id), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (!r.ok) throw new Error('patch failed');
      return r.json();
    },
    async addComment(id, comment) {
      var r = await fetch('/api/tickets/' + encodeURIComponent(id) + '/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment),
      });
      if (!r.ok) throw new Error('comment failed');
      return r.json();
    },
    async stats() {
      var r = await fetch('/api/stats');
      return r.json();
    },
    user(id) {
      if (!this._state) return null;
      return this._state.users.find(function (u) { return u.id === id; }) || null;
    },
    me() { return getCurrentUser(); },
    fmtAge(ms) {
      var m = Math.floor(ms / 60000);
      if (m < 1) return 'ahora';
      if (m < 60) return m + 'm';
      var h = Math.floor(m / 60);
      if (h < 24) return h + 'h ' + (m % 60) + 'm';
      var d = Math.floor(h / 24);
      return d + 'd ' + (h % 24) + 'h';
    },
    fmtDate(iso) {
      var d = new Date(iso);
      var months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
      var pad = function (n) { return String(n).padStart(2, '0'); };
      return pad(d.getDate()) + ' ' + months[d.getMonth()] + ' · ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    },
    importanceClass(imp) {
      return 'imp-' + imp;
    },
    statusKey(s) {
      return ({ 'Recibido': 'new', 'En progreso': 'prog', 'Resuelto': 'done', 'Cerrado': 'closed' })[s] || 'new';
    },
  };
  window.tg = tg;

  function getRole() {
    try { return localStorage.getItem('tg-role'); } catch (e) { return null; }
  }
  function getCurrentUser() {
    return users[getRole()] || users.admin;
  }
  function logout() {
    try { localStorage.removeItem('tg-role'); } catch (e) {}
    location.href = '/';
  }

  // Expose for settings.html and any other script
  window.__tgUsers = users;
  window.__tgGetCurrentUser = getCurrentUser;
  window.__tgLogout = logout;

  // ---------- Dev nav (bottom-center prototype switcher) ----------
  var pagesIT = [
    { href: '/',              label: 'Login' },
    { href: '/portal',        label: 'Empleado' },
    { href: '/dashboard',     label: 'Dashboard' },
    { href: '/tickets',       label: 'Tickets' },
    { href: '/asignar',       label: 'Asignar' },
    { href: '/ticket-detail', label: 'Detalle' },
    { href: '/kb',            label: 'KB' },
    { href: '/reportes',      label: 'Reportes' },
    { href: '/settings',      label: 'Settings' },
  ];
  var pagesAdmin = [
    { href: '/',              label: 'Login' },
    { href: '/portal',        label: 'Mi Portal' },
    { href: '/dashboard',     label: 'Mi Dashboard' },
    { href: '/ticket-detail', label: 'Mi Ticket' },
    { href: '/settings',      label: 'Settings' },
  ];
  var pages = (getRole() === 'admin') ? pagesAdmin : pagesIT;
  // Admin can see /tickets (own only) and /dashboard. /asignar /kb /reportes still IT-only.
  var itOnlyRoutes = ['/asignar', '/kb', '/reportes'];

  var here = (location.pathname.replace(/\/+$/, '') || '/');

  // Role-based redirect: admin should not access IT-only routes
  if (getRole() === 'admin' && itOnlyRoutes.indexOf(here) > -1) {
    location.replace('/dashboard');
    return;
  }

  // Replace IT tab strip with admin-specific tabs when role=admin
  function injectAdminTabs() {
    if (getRole() !== 'admin') return;
    var itTabs = document.querySelector('.it-tabs');
    if (!itTabs) return;
    while (itTabs.firstChild) itTabs.removeChild(itTabs.firstChild);

    var adminTabs = [
      { href: '/dashboard', label: 'Mi Dashboard', num: '[01]' },
      { href: '/tickets',   label: 'Mis Tickets', num: '[02]' },
    ];
    adminTabs.forEach(function (t) {
      var a = document.createElement('a');
      a.href = t.href;
      a.className = 'it-tab' + (here === t.href ? ' on' : '');
      var n = document.createElement('span');
      n.className = 'tab-num';
      n.textContent = t.num;
      a.appendChild(n);
      a.appendChild(document.createTextNode(t.label));
      itTabs.appendChild(a);
    });

    var spacer = document.createElement('div');
    spacer.className = 'it-tabs-spacer';
    itTabs.appendChild(spacer);

    var newBtn = document.createElement('a');
    newBtn.href = '/portal';
    newBtn.className = 'it-tab';
    newBtn.style.cssText = 'background:var(--tg-red);color:#fff;font-weight:700;';
    var plus = document.createElement('span');
    plus.className = 'tab-num';
    plus.style.color = '#fff';
    plus.textContent = '+';
    newBtn.appendChild(plus);
    newBtn.appendChild(document.createTextNode('Reportar nueva situación'));
    itTabs.appendChild(newBtn);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectAdminTabs);
  } else {
    injectAdminTabs();
  }

  var style = document.createElement('style');
  style.textContent = [
    /* dev-nav */
    '.dev-nav{position:fixed;left:50%;bottom:8px;transform:translateX(-50%);',
    'z-index:9999;display:flex;gap:0;background:rgba(15,23,42,.92);color:#fff;',
    'border-radius:4px;padding:4px;font-family:Inter,system-ui,sans-serif;',
    'font-size:11px;box-shadow:0 4px 12px rgba(0,0,0,.2)}',
    '.dev-nav .lbl{padding:6px 10px;opacity:.5;letter-spacing:.12em;',
    'text-transform:uppercase;font-weight:600;',
    'border-right:1px solid rgba(255,255,255,.15)}',
    '.dev-nav a{color:rgba(255,255,255,.85);text-decoration:none;',
    'padding:6px 10px;border-radius:3px;letter-spacing:.04em}',
    '.dev-nav a:hover{background:rgba(255,255,255,.1);color:#fff}',
    '.dev-nav a.on{background:#E30512;color:#fff}',
    /* user menu */
    '.user-menu{position:fixed;top:12px;right:12px;z-index:9998;',
    'font-family:Inter,system-ui,sans-serif}',
    '.user-pill{display:flex;align-items:center;background:#fff;',
    'border:1px solid #E5E7EB;border-radius:4px;',
    'box-shadow:0 2px 6px rgba(15,23,42,.08);cursor:pointer;user-select:none}',
    '.user-pill:hover{background:#F4F5F7}',
    '.user-pill .avatar{width:32px;height:32px;display:grid;place-items:center;',
    'font-family:JetBrains Mono,Source Code Pro,monospace;font-size:11px;',
    'font-weight:700;color:#fff;border-top-left-radius:3px;',
    'border-bottom-left-radius:3px;letter-spacing:.04em}',
    '.user-pill.b-navy .avatar{background:#1C2F5C}',
    '.user-pill.b-red  .avatar{background:#E30512}',
    '.user-pill .nm{padding:0 10px;font-size:12px;font-weight:500;color:#0F172A}',
    '.user-pill .chev{padding:0 8px 0 4px;font-size:10px;color:#6B7280}',
    '.user-dropdown{position:absolute;top:calc(100% + 6px);right:0;min-width:260px;',
    'background:#fff;border:1px solid #E5E7EB;border-radius:4px;',
    'box-shadow:0 10px 24px rgba(15,23,42,.15);display:none;overflow:hidden}',
    '.user-dropdown.open{display:block}',
    '.user-dropdown .head{padding:14px 16px;display:flex;align-items:center;gap:12px;',
    'border-bottom:1px solid #F3F4F6}',
    '.user-dropdown .head .avatar{width:40px;height:40px;display:grid;place-items:center;',
    'border-radius:4px;font-family:JetBrains Mono,monospace;font-size:13px;',
    'font-weight:700;color:#fff;letter-spacing:.04em}',
    '.user-dropdown.b-navy .head .avatar{background:#1C2F5C}',
    '.user-dropdown.b-red  .head .avatar{background:#E30512}',
    '.user-dropdown .head .nm{font-size:14px;font-weight:600;color:#0F172A;margin-bottom:2px}',
    '.user-dropdown .head .ti{font-size:11px;color:#6B7280}',
    '.user-dropdown .links{padding:6px 0}',
    '.user-dropdown .links a{display:flex;align-items:center;gap:10px;padding:9px 16px;',
    'font-size:13px;color:#1F2937;text-decoration:none;cursor:pointer}',
    '.user-dropdown .links a:hover{background:#F4F5F7;color:#0F172A}',
    '.user-dropdown .links a .ico{width:16px;display:grid;place-items:center;',
    'font-size:13px;color:#6B7280}',
    '.user-dropdown .links a:hover .ico{color:#E30512}',
    '.user-dropdown .links .divider{height:1px;background:#F3F4F6;margin:6px 0}',
    '.user-dropdown .links a.danger{color:#9F1239}',
    '.user-dropdown .links a.danger:hover{background:#FCE4E6}',
    /* hide in-page user widget on IT pages — replaced by floating menu */
    '.top-user{display:none !important}',
    /* search bar (floating top-center) */
    '.search-bar{position:fixed;top:12px;left:50%;transform:translateX(-50%);',
    'z-index:9998;width:380px;max-width:calc(100vw - 360px);',
    'background:#fff;border:1px solid #E5E7EB;border-radius:4px;',
    'box-shadow:0 2px 6px rgba(15,23,42,.08);',
    'display:flex;align-items:center;font-family:Inter,system-ui,sans-serif}',
    '.search-bar:focus-within{border-color:#1C2F5C;box-shadow:0 0 0 2px rgba(28,47,92,.18)}',
    '.search-bar .ico{padding:0 10px;color:#6B7280;font-size:14px}',
    '.search-bar input{flex:1;border:none;outline:none;background:transparent;',
    'padding:9px 0;font-family:inherit;font-size:13px;color:#0F172A}',
    '.search-bar input::placeholder{color:#9CA3AF}',
    '.search-bar kbd{margin:0 8px;padding:2px 6px;font-family:JetBrains Mono,monospace;',
    'font-size:10px;color:#6B7280;background:#F3F4F6;border:1px solid #E5E7EB;',
    'border-radius:3px}',
    '.search-results{position:absolute;top:calc(100% + 6px);left:0;right:0;',
    'background:#fff;border:1px solid #E5E7EB;border-radius:4px;',
    'box-shadow:0 10px 24px rgba(15,23,42,.15);overflow:hidden;display:none}',
    '.search-results.open{display:block}',
    '.search-results .group{padding:6px 0}',
    '.search-results .group + .group{border-top:1px solid #F3F4F6}',
    '.search-results .gh{font-size:9px;font-weight:700;letter-spacing:.14em;',
    'text-transform:uppercase;color:#9CA3AF;padding:6px 14px 4px}',
    '.search-results a{display:flex;align-items:baseline;gap:10px;',
    'padding:8px 14px;text-decoration:none;color:#1F2937;font-size:13px}',
    '.search-results a:hover{background:#F4F5F7;color:#0F172A}',
    '.search-results a .id{font-family:JetBrains Mono,monospace;font-size:11px;',
    'color:#6B7280;min-width:64px}',
    '.search-results a .lbl{flex:1}',
    '.search-results a .typ{font-size:10px;color:#9CA3AF;',
    'font-family:JetBrains Mono,monospace;letter-spacing:.06em;text-transform:uppercase}'
  ].join('');
  document.head.appendChild(style);

  function renderDevNav() {
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

  function renderUserMenu() {
    if (here === '/') return; // login screen — no user yet

    var u = getCurrentUser();

    var wrap = document.createElement('div');
    wrap.className = 'user-menu';

    // Pill
    var pill = document.createElement('button');
    pill.type = 'button';
    pill.className = 'user-pill b-' + u.brand;

    var av = document.createElement('span');
    av.className = 'avatar';
    av.textContent = u.initials;
    pill.appendChild(av);

    var nm = document.createElement('span');
    nm.className = 'nm';
    nm.textContent = u.name;
    pill.appendChild(nm);

    var chev = document.createElement('span');
    chev.className = 'chev';
    chev.textContent = '▾';
    pill.appendChild(chev);

    // Dropdown
    var dd = document.createElement('div');
    dd.className = 'user-dropdown b-' + u.brand;

    var head = document.createElement('div');
    head.className = 'head';
    var bigAv = document.createElement('div');
    bigAv.className = 'avatar';
    bigAv.textContent = u.initials;
    head.appendChild(bigAv);
    var hi = document.createElement('div');
    var hn = document.createElement('div');
    hn.className = 'nm';
    hn.textContent = u.name;
    hi.appendChild(hn);
    var ht = document.createElement('div');
    ht.className = 'ti';
    ht.textContent = u.title;
    hi.appendChild(ht);
    head.appendChild(hi);
    dd.appendChild(head);

    var links = document.createElement('div');
    links.className = 'links';

    var settingsLink = document.createElement('a');
    settingsLink.href = '/settings';
    var sIco = document.createElement('span');
    sIco.className = 'ico';
    sIco.textContent = '⚙';
    var sLbl = document.createElement('span');
    sLbl.textContent = 'Configuración';
    settingsLink.appendChild(sIco);
    settingsLink.appendChild(sLbl);
    links.appendChild(settingsLink);

    var divider = document.createElement('div');
    divider.className = 'divider';
    links.appendChild(divider);

    var logoutLink = document.createElement('a');
    logoutLink.href = '/';
    logoutLink.className = 'danger';
    var lIco = document.createElement('span');
    lIco.className = 'ico';
    lIco.textContent = '⏻';
    var lLbl = document.createElement('span');
    lLbl.textContent = 'Cerrar sesión';
    logoutLink.appendChild(lIco);
    logoutLink.appendChild(lLbl);
    logoutLink.addEventListener('click', function (e) {
      e.preventDefault();
      logout();
    });
    links.appendChild(logoutLink);

    dd.appendChild(links);

    wrap.appendChild(pill);
    wrap.appendChild(dd);
    document.body.appendChild(wrap);

    pill.addEventListener('click', function (e) {
      e.stopPropagation();
      dd.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) dd.classList.remove('open');
    });
  }

  // ---------- Auto-wire prototype clicks ----------
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
    document.querySelectorAll('.rail-block').forEach(function (rb) {
      var h = rb.querySelector('.rail-h h4');
      if (h && h.textContent.trim() === 'Base de conocimiento') {
        rb.querySelectorAll('.rail-b > div > div').forEach(function (card) {
          wireClick(card, '/kb');
        });
      }
    });
  }

  // ---------- Global search ----------
  var searchIndex = [
    { id: 'SM-00043', label: 'Cola Salesforce atascada · M. Ríos',          type: 'ticket', href: '/ticket-detail' },
    { id: 'SM-00041', label: 'Salesforce no carga reportes · M. Ríos',      type: 'ticket', href: '/ticket-detail' },
    { id: 'SM-00038', label: 'VPN se desconecta cada 10 min · M. Ríos',     type: 'ticket', href: '/ticket-detail' },
    { id: 'SM-00029', label: 'Reset de contraseña EMAS · M. Ríos',          type: 'ticket', href: '/ticket-detail' },
    { id: 'SM-00021', label: 'Monitor 2 no enciende · M. Ríos',             type: 'ticket', href: '/ticket-detail' },
    { id: 'KB-029',   label: 'Cola Salesforce atascada — diagnóstico',      type: 'kb',     href: '/kb' },
    { id: 'KB-014',   label: 'Reiniciar print server',                      type: 'kb',     href: '/kb' },
    { id: 'KB-007',   label: 'Reset de contraseña SSO',                     type: 'kb',     href: '/kb' },
    { id: 'EMP-2104', label: 'M. Ríos · Administración · Bayamón',          type: 'empleado', href: '/ticket-detail' },
    { id: 'UCG-IT-007', label: 'J. Marrero · UCG IT',                       type: 'tecnico',  href: '/asignar' },
    { id: 'LT-BYM-0114', label: 'Laptop · M. Ríos',                          type: 'activo',   href: '/ticket-detail' },
  ];

  function renderSearchBar() {
    if (here === '/') return;

    var bar = document.createElement('div');
    bar.className = 'search-bar';

    var ico = document.createElement('span');
    ico.className = 'ico';
    ico.textContent = '⌕';
    bar.appendChild(ico);

    var input = document.createElement('input');
    input.type = 'search';
    input.placeholder = 'Buscar tickets, KB, empleados, activos…';
    input.setAttribute('aria-label', 'Buscar');
    bar.appendChild(input);

    var k = document.createElement('kbd');
    k.textContent = '/';
    bar.appendChild(k);

    var results = document.createElement('div');
    results.className = 'search-results';
    bar.appendChild(results);

    document.body.appendChild(bar);

    function clearChildren(node) {
      while (node.firstChild) node.removeChild(node.firstChild);
    }

    function buildGroup(title, items) {
      if (!items.length) return null;
      var g = document.createElement('div');
      g.className = 'group';
      var h = document.createElement('div');
      h.className = 'gh';
      h.textContent = title;
      g.appendChild(h);
      items.forEach(function (it) {
        var a = document.createElement('a');
        a.href = it.href;
        var idEl = document.createElement('span');
        idEl.className = 'id';
        idEl.textContent = it.id;
        var lbl = document.createElement('span');
        lbl.className = 'lbl';
        lbl.textContent = it.label;
        var typ = document.createElement('span');
        typ.className = 'typ';
        typ.textContent = it.type;
        a.appendChild(idEl);
        a.appendChild(lbl);
        a.appendChild(typ);
        g.appendChild(a);
      });
      return g;
    }

    function renderResults(q) {
      clearChildren(results);
      var query = q.trim().toLowerCase();
      var matches = searchIndex.filter(function (it) {
        if (!query) return true;
        return it.id.toLowerCase().indexOf(query) > -1 ||
               it.label.toLowerCase().indexOf(query) > -1 ||
               it.type.toLowerCase().indexOf(query) > -1;
      });
      var groups = {};
      matches.forEach(function (m) {
        if (!groups[m.type]) groups[m.type] = [];
        groups[m.type].push(m);
      });
      var labels = { ticket: 'Tickets', kb: 'Base de conocimiento', empleado: 'Empleados', tecnico: 'Técnicos', activo: 'Activos' };
      var order = ['ticket', 'kb', 'empleado', 'tecnico', 'activo'];
      var any = false;
      order.forEach(function (k) {
        if (!groups[k]) return;
        var grp = buildGroup(labels[k], groups[k].slice(0, 4));
        if (grp) { results.appendChild(grp); any = true; }
      });
      if (!any) {
        var empty = document.createElement('div');
        empty.className = 'group';
        var p = document.createElement('div');
        p.className = 'gh';
        p.textContent = 'Sin coincidencias';
        empty.appendChild(p);
        results.appendChild(empty);
      }
    }

    input.addEventListener('focus', function () {
      renderResults(input.value);
      results.classList.add('open');
    });
    input.addEventListener('input', function () {
      renderResults(input.value);
      results.classList.add('open');
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var first = results.querySelector('a');
        if (first) location.href = first.href;
        else location.href = '/tickets';
      }
      if (e.key === 'Escape') {
        input.blur();
        results.classList.remove('open');
      }
    });
    document.addEventListener('click', function (e) {
      if (!bar.contains(e.target)) results.classList.remove('open');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement !== input) {
        var t = e.target;
        if (t && /INPUT|TEXTAREA|SELECT/.test(t.tagName)) return;
        e.preventDefault();
        input.focus();
      }
    });
  }

  function boot() {
    renderDevNav();
    renderUserMenu();
    renderSearchBar();
    wireAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
