const button = document.getElementById("button");
const score = document.getElementById("score");
const status = document.getElementById("status");

let socket = null;
let reconnectTimer = null;

function setStatus(text) {
  if (status) {
    status.textContent = text;
  }
}

function connect() {
  if (socket && (
    socket.readyState === WebSocket.OPEN ||
    socket.readyState === WebSocket.CONNECTING
  )) {
    return;
  }

  setStatus("Connecting...");

  const protocol = location.protocol === "https:" ? "wss:" : "ws:";
  const wsUrl = `${protocol}//${location.host}/ws`;

  socket = new WebSocket(wsUrl);

  socket.addEventListener("open", () => {
    console.log("Connected to global server!");
    setStatus("Connected!");
  });

  socket.addEventListener("message", (event) => {
    try {
      const data = JSON.parse(event.data);

      if (data.type === "score") {
        score.textContent = Number(data.total).toLocaleString();
      }
    } catch (error) {
      console.error("Invalid server message:", error);
    }
  });

  socket.addEventListener("close", () => {
    console.log("Disconnected.");
    setStatus("Disconnected. Reconnecting...");

    clearTimeout(reconnectTimer);

    reconnectTimer = setTimeout(() => {
      connect();
    }, 2000);
  });

  socket.addEventListener("error", (error) => {
    console.error("WebSocket error:", error);
    setStatus("Connection error.");
  });
}

button.addEventListener("click", () => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    return;
  }

  socket.send("button_clicked");
});

connect();
