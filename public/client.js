const button = document.getElementById("button");
const score = document.getElementById("score");

const socket = io();

socket.on("connect", () => {
  console.log("Connected to server!");
});

socket.on("score_update", (total) => {
  score.textContent = total;
});

button.addEventListener("click", () => {
  socket.emit("button_clicked");
});
