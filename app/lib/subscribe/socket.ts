import { data } from "@ampt/data";
import { SocketConnection, ws } from "@ampt/sdk";

export async function onMessage(conn: SocketConnection, message: any) {
  const { token } = message;
  const topic = token;

  const subscriptionKey = `subscription:${topic}:${conn.connectionId}`;

  await data.set<string>(subscriptionKey, conn.connectionId, {
    label1: `connections:${conn.connectionId}`,
  });
}

export async function onDisconnect(conn: SocketConnection) {
  const subscriptions = await data.getByLabel(
    "label1",
    `connections:${conn.connectionId}`
  );

  await Promise.all(subscriptions.items.map(({ key }) => data.remove(key)));
}

export async function emitTo(to: string) {
  const subscriptions = await data.get<string>(`subscription:${to}:*`);

  const jobs = subscriptions.items.map(async ({ value: connectionId }) => {
    try {
      await ws.send(connectionId, "refresh");
    } catch (e) {
      console.log("error sending to connection", { connectionId, e });
      await data.remove(`subscription:${to}:${connectionId}`);
    }
  });

  await Promise.all(jobs);
}
