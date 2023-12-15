import { data } from "@ampt/data";
import { ws } from "@ampt/sdk";

export type ClientMessage = { token: string };
export type ServerMessage = "refresh";

function sendMessage(connectionId: string, message: ServerMessage) {
  return ws.send(connectionId, message);
}

export async function emitTo(to: string) {
  const subscriptions = await data.get<string>(`subscription:${to}:*`);

  const jobs = subscriptions.items.map(async ({ value: connectionId }) => {
    try {
      await sendMessage(connectionId, "refresh");
    } catch (e) {
      console.log("error sending to connection", { connectionId, e });
      await data.remove(`subscription:${to}:${connectionId}`);
    }
  });

  await Promise.all(jobs);
}

ws.on("connected", (conn) => {
  console.log("socket connected", JSON.stringify(conn, null, 2));
});

ws.on("disconnected", async (conn) => {
  console.log("socket disconnected", JSON.stringify(conn, null, 2));
  const subscriptions = await data.getByLabel(
    "label1",
    `connections:${conn.connectionId}`
  );

  await Promise.all(subscriptions.items.map(({ key }) => data.remove(key)));
});

ws.on("message", async (conn, message: ClientMessage) => {
  console.log("socket message", message);
  const { token } = message;
  const topic = token;

  const subscriptionKey = `subscription:${topic}:${conn.connectionId}`;

  await data.set<string>(subscriptionKey, conn.connectionId, {
    label1: `connections:${conn.connectionId}`,
  });
});
