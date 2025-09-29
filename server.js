const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Frontend'i public klasöründen servis et
app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Sinyal gönderildiğinde tüm clientlere yayınla
  socket.on('message', (data) => {
    io.emit('message', data);
  });

  // Bağlantı kesildiğinde logla
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
