import { DurableObject } from "cloudflare:workers";

export class GlobalCounter extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.ctx = ctx;
  }

  async fetch(request) {
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Global Button Game is online!");
    }

    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];

    this.ctx.acceptWebSocket(server);

    const total =
      (await this.ctx.storage.get("totalClicks")) ?? 0;

    server.send(JSON.stringify({
      type: "score",
      total
    }));

    return new Response(null, {
      status: 101,
      webSocket: client
    });
  }

  async webSocketMessage(ws, message) {
    if (message !== "button_clicked") return;

    let total =
      (await this.ctx.storage.get("totalClicks")) ?? 0;

    total++;

    await this.ctx.storage.put("totalClicks", total);

    const messageOut = JSON.stringify({
      type: "score",
      total
    });

    for (const socket of this.ctx.getWebSockets()) {
      try {
        socket.send(messageOut);
      } catch {}
    }
  }
}

export default {
  async fetch(request, env) {
    const id = env.GLOBAL_COUNTER.idFromName("global");
    const counter = env.GLOBAL_COUNTER.get(id);

    return counter.fetch(request);
  }
};
