const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.use(express.static(__dirname, { extensions: ['html'] }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'tickets-tropigas.html'));
});

app.get('/healthz', (req, res) => {
  res.json({ status: 'ok', service: 'tropigas-it-helpdesk', version: '2.0.0' });
});

app.listen(PORT, HOST, () => {
  console.log(`Tropigas IT Helpdesk listening on http://${HOST}:${PORT}`);
});
