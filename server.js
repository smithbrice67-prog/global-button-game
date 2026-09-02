const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

let totalClicks = 0;

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("Player connected");

  // Send current score to the new player
  socket.emit("score_update", totalClicks);

  // Player clicked the button
  socket.on("button_clicked", () => {
    totalClicks++;

    // Send the real score to EVERYONE
    io.emit("score_update", totalClicks);
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected");
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Global Button Game running on port ${PORT}`);
});
