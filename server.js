const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
let totalClicks = 0;

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log(`Connected: ${socket.id}`);

  // Send the current global score to the new player.
  socket.emit('score_update', totalClicks);

  socket.on('button_clicked', () => {
    totalClicks += 1;

    // Tell EVERY connected player about the new score.
    io.emit('score_update', totalClicks);
  });

  socket.on('disconnect', () => {
    console.log(`Disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Global Button Game running at http://localhost:${PORT}`);
});
