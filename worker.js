import { DurableObject } from "cloudflare:workers";

export class GlobalCounter extends DurableObject {
  async fetch(request) {
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("WebSocket endpoint", { status: 200 });
    }

    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];

    this.ctx.acceptWebSocket(server);

    const total =
      (await this.ctx.storage.get("totalClicks")) ?? 0;

    server.send(
      JSON.stringify({
        type: "score",
        total
      })
    );

    return new Response(null, {
      status: 101,
      webSocket: client
    });
  }

  async webSocketMessage(ws, message) {
    if (message !== "button_clicked") {
      return;
    }

    let total =
      (await this.ctx.storage.get("totalClicks")) ?? 0;

    total += 1;

    await this.ctx.storage.put("totalClicks", total);

    const update = JSON.stringify({
      type: "score",
      total
    });

    for (const socket of this.ctx.getWebSockets()) {
      try {
        socket.send(update);
      } catch {}
    }
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/ws") {
      const id = env.GLOBAL_COUNTER.idFromName("global");
      const counter = env.GLOBAL_COUNTER.get(id);

      return counter.fetch(request);
    }

    return env.ASSETS.fetch(request);
  }
};
