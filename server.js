const express = require('express');
const path = require('path');
const { createInitialState } = require('./state');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const DESIGN_ROOT = path.join(__dirname, 'design_handoff_helpdesk_it');

const state = createInitialState();
const startedAt = new Date().toISOString();

app.use(express.json({ limit: '256kb' }));
app.use(express.static(DESIGN_ROOT));

// ---------- API ----------

function nextTicketId() {
  state.counters.lastTicketId += 1;
  return 'SM-' + String(state.counters.lastTicketId).padStart(5, '0');
}

function denormalizeTicket(t) {
  const empleado = state.users.find((u) => u.id === t.empleadoId) || null;
  const assignee = t.assigneeId ? state.users.find((u) => u.id === t.assigneeId) || null : null;
  return {
    ...t,
    empleadoName: empleado ? empleado.name : null,
    empleadoSucursal: empleado ? empleado.sucursal : null,
    empleadoDept: empleado ? empleado.department : null,
    assigneeName: assignee ? assignee.name : null,
    assigneeInitials: assignee ? assignee.initials : null,
    ageMs: Date.now() - new Date(t.createdAt).getTime(),
    slaPct: Math.min(100, ((Date.now() - new Date(t.createdAt).getTime()) / (t.slaHours * 3600_000)) * 100),
  };
}

function denormalizeAll() {
  return state.tickets.map(denormalizeTicket);
}

app.get('/api/state', (req, res) => {
  res.json({
    users: state.users,
    tickets: denormalizeAll(),
    kb: state.kb,
    serverStartedAt: startedAt,
    now: new Date().toISOString(),
  });
});

app.get('/api/tickets', (req, res) => {
  let list = denormalizeAll();
  const { status, importance, assigneeId, empleadoId, categoria, q } = req.query;
  if (status)     list = list.filter((t) => t.status === status);
  if (importance) list = list.filter((t) => t.importance === importance);
  if (assigneeId) list = list.filter((t) => t.assigneeId === assigneeId);
  if (empleadoId) list = list.filter((t) => t.empleadoId === empleadoId);
  if (categoria)  list = list.filter((t) => t.categoria === categoria);
  if (q) {
    const needle = String(q).toLowerCase();
    list = list.filter((t) =>
      t.id.toLowerCase().includes(needle) ||
      (t.summary && t.summary.toLowerCase().includes(needle)) ||
      (t.empleadoName && t.empleadoName.toLowerCase().includes(needle))
    );
  }
  res.json(list);
});

app.get('/api/tickets/:id', (req, res) => {
  const t = state.tickets.find((t) => t.id === req.params.id);
  if (!t) return res.status(404).json({ error: 'ticket not found' });
  res.json(denormalizeTicket(t));
});

app.post('/api/tickets', (req, res) => {
  const body = req.body || {};
  if (!body.summary || !body.empleadoId || !body.importance) {
    return res.status(400).json({ error: 'summary, empleadoId, importance required' });
  }
  const importance = ['Alta', 'Media', 'Baja'].includes(body.importance) ? body.importance : 'Media';
  const slaHours = importance === 'Alta' ? 4 : importance === 'Media' ? 8 : 24;
  const now = new Date().toISOString();
  const t = {
    id: nextTicketId(),
    summary: String(body.summary).slice(0, 200),
    description: body.description ? String(body.description).slice(0, 2000) : '',
    empleadoId: body.empleadoId,
    categoria: body.categoria || 'Sistema',
    importance,
    status: 'Recibido',
    assigneeId: null,
    slaHours,
    assetId: body.assetId || null,
    tags: Array.isArray(body.tags) ? body.tags.slice(0, 10) : [],
    createdAt: now,
    updatedAt: now,
    comments: [],
    cliente: body.cliente && typeof body.cliente === 'object' ? body.cliente : null,
    salesforceTxIds: Array.isArray(body.salesforceTxIds) ? body.salesforceTxIds.slice(0, 20) : [],
    errorMessage: body.errorMessage ? String(body.errorMessage).slice(0, 4000) : null,
  };
  state.tickets.unshift(t);
  res.status(201).json(denormalizeTicket(t));
});

app.patch('/api/tickets/:id', (req, res) => {
  const t = state.tickets.find((t) => t.id === req.params.id);
  if (!t) return res.status(404).json({ error: 'ticket not found' });
  const body = req.body || {};
  const allowed = ['summary', 'description', 'categoria', 'importance', 'status', 'assigneeId', 'tags', 'assetId', 'cliente', 'salesforceTxIds', 'errorMessage'];
  allowed.forEach((k) => {
    if (k in body) t[k] = body[k];
  });
  if ('importance' in body) {
    t.slaHours = body.importance === 'Alta' ? 4 : body.importance === 'Media' ? 8 : 24;
  }
  t.updatedAt = new Date().toISOString();
  res.json(denormalizeTicket(t));
});

app.post('/api/tickets/:id/comments', (req, res) => {
  const t = state.tickets.find((t) => t.id === req.params.id);
  if (!t) return res.status(404).json({ error: 'ticket not found' });
  const body = req.body || {};
  if (!body.body) return res.status(400).json({ error: 'body required' });
  const author = body.authorId ? state.users.find((u) => u.id === body.authorId) : null;
  const comment = {
    author: author ? author.name : (body.author || 'Anónimo'),
    authorId: body.authorId || null,
    role: author ? author.role : (body.role || 'system'),
    type: ['message', 'note', 'system'].includes(body.type) ? body.type : 'message',
    body: String(body.body).slice(0, 2000),
    createdAt: new Date().toISOString(),
  };
  t.comments = t.comments || [];
  t.comments.push(comment);
  t.updatedAt = comment.createdAt;
  res.status(201).json(comment);
});

app.get('/api/users', (req, res) => res.json(state.users));
app.get('/api/users/:id', (req, res) => {
  const u = state.users.find((u) => u.id === req.params.id);
  if (!u) return res.status(404).json({ error: 'user not found' });
  res.json(u);
});

app.get('/api/kb', (req, res) => res.json(state.kb));
app.get('/api/kb/:id', (req, res) => {
  const a = state.kb.find((a) => a.id === req.params.id);
  if (!a) return res.status(404).json({ error: 'article not found' });
  res.json(a);
});

app.get('/api/stats', (req, res) => {
  const tickets = state.tickets;
  const total = tickets.length;
  const byStatus = tickets.reduce((acc, t) => { acc[t.status] = (acc[t.status] || 0) + 1; return acc; }, {});
  const unassigned = tickets.filter((t) => !t.assigneeId).length;
  const overdueAlta = tickets.filter((t) => {
    const ageH = (Date.now() - new Date(t.createdAt).getTime()) / 3600_000;
    return t.importance === 'Alta' && ageH > t.slaHours && t.status !== 'Resuelto' && t.status !== 'Cerrado';
  }).length;
  const resolvedToday = tickets.filter((t) => {
    const updated = new Date(t.updatedAt);
    return (t.status === 'Resuelto' || t.status === 'Cerrado') &&
      (Date.now() - updated.getTime()) < 24 * 3600_000;
  }).length;

  const techLoad = state.users
    .filter((u) => u.role === 'it')
    .map((u) => {
      const open = tickets.filter((t) => t.assigneeId === u.id && t.status !== 'Resuelto' && t.status !== 'Cerrado').length;
      const closed = tickets.filter((t) => t.assigneeId === u.id && (t.status === 'Resuelto' || t.status === 'Cerrado')).length;
      return { id: u.id, name: u.name, initials: u.initials, open, closed };
    });

  res.json({ total, byStatus, unassigned, overdueAlta, resolvedToday, techLoad });
});

// ---------- Pages ----------

const pages = {
  '/': 'design/login.html',
  '/portal': 'design/helpdesk/Helpdesk Screens.html',
  '/dashboard': 'design/helpdesk/pages/dashboard.html',
  '/tickets': 'design/helpdesk/pages/tickets.html',
  '/asignar': 'design/helpdesk/pages/asignar.html',
  '/ticket-detail': 'design/helpdesk/pages/ticket-detail.html',
  '/kb': 'design/helpdesk/pages/kb.html',
  '/reportes': 'design/helpdesk/pages/reportes.html',
  '/settings': 'design/settings.html',
  '/notificaciones': 'design/notifications.html',
};

for (const [route, file] of Object.entries(pages)) {
  app.get(route, (req, res) => {
    res.sendFile(path.join(DESIGN_ROOT, file));
  });
}

app.get('/healthz', (req, res) => {
  res.json({ status: 'ok', service: 'tropigas-it-helpdesk', version: '2.0.0', tickets: state.tickets.length });
});

app.listen(PORT, HOST, () => {
  console.log(`Tropigas IT Helpdesk listening on http://${HOST}:${PORT}`);
  console.log(`State seeded: ${state.tickets.length} tickets, ${state.users.length} users, ${state.kb.length} KB articles`);
});
