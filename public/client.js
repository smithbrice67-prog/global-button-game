const button = document.getElementById("button");
const score = document.getElementById("score");

const protocol = location.protocol === "https:" ? "wss:" : "ws:";
const socket = new WebSocket(`${protocol}//${location.host}`);

socket.addEventListener("open", () => {
  console.log("Connected!");
});

socket.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "score") {
    score.textContent = data.total;
  }
});

socket.addEventListener("close", () => {
  console.log("Disconnected.");
});

button.addEventListener("click", () => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send("button_clicked");
  }
});
