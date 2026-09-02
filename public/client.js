const button = document.getElementById("button");
const score = document.getElementById("score");

const socket = new WebSocket(
  `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws`
);

socket.addEventListener("open", () => {
  console.log("Connected to global server!");
});

socket.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "score") {
    score.textContent = data.total.toLocaleString();
  }
});

socket.addEventListener("close", () => {
  console.log("Disconnected from global server.");
});

socket.addEventListener("error", (error) => {
  console.error("WebSocket error:", error);
});

button.addEventListener("click", () => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send("button_clicked");
  }
});
