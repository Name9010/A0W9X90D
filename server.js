const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS izni ver
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// SSE (Server-Sent Events) için
const clients = [];

app.get('/events', (req, res) => {
  res.writeHead(200, {
    'Connection': 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*'
  });

  const clientId = Date.now();
  const newClient = {
    id: clientId,
    response: res
  };
  clients.push(newClient);

  req.on('close', () => {
    clients.splice(clients.findIndex(c => c.id === clientId), 1);
  });
});

// Sinyal gönderme endpoint
app.post('/send', (req, res) => {
  const { type, pair, callput, risk, sender, balance } = req.body;

  const data = JSON.stringify({ type, pair, callput, risk, sender, balance });

  clients.forEach(client => {
    client.response.write(`data: ${data}\n\n`);
  });

  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
