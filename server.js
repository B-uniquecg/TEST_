const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const DESIGN_ROOT = path.join(__dirname, 'design_handoff_helpdesk_it');

app.use(express.static(DESIGN_ROOT));

const pages = {
  '/': 'design/helpdesk/Helpdesk Screens.html',
  '/dashboard': 'design/helpdesk/pages/dashboard.html',
  '/tickets': 'design/helpdesk/pages/tickets.html',
  '/asignar': 'design/helpdesk/pages/asignar.html',
  '/ticket-detail': 'design/helpdesk/pages/ticket-detail.html',
  '/kb': 'design/helpdesk/pages/kb.html',
  '/reportes': 'design/helpdesk/pages/reportes.html',
};

for (const [route, file] of Object.entries(pages)) {
  app.get(route, (req, res) => {
    res.sendFile(path.join(DESIGN_ROOT, file));
  });
}

app.get('/healthz', (req, res) => {
  res.json({ status: 'ok', service: 'tropigas-it-helpdesk', version: '2.0.0' });
});

app.listen(PORT, HOST, () => {
  console.log(`Tropigas IT Helpdesk listening on http://${HOST}:${PORT}`);
  console.log('Routes:', ['/healthz', ...Object.keys(pages)].join(', '));
});
