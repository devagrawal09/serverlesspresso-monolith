import { data } from "@ampt/data";
import { SocketConnection, ws } from "@ampt/sdk";

const TOPIC = "CUSTOMER_ORDERS";

export async function onMessage(conn: SocketConnection, message: any) {
  const { event, topic } = message;

  if (event === "subscribe" && topic === TOPIC) {
    const subscriptionKey = `subscription:${TOPIC}:${conn.connectionId}`;
    await data.set<string>(subscriptionKey, conn.connectionId);
  }
}

export async function onDisconnect(conn: SocketConnection) {
  const subscriptionKey = `subscription:${TOPIC}:${conn.connectionId}`;
  await data.remove(subscriptionKey);
}

data.on("created:orders:*", async ({ item: { value: order } }) => {
  const subscriptions = await data.get<string>(`subscription:${TOPIC}:*`);

  const jobs = subscriptions.items.map(async ({ value: connectionId }) => {
    try {
      await ws.send(connectionId, { topic: TOPIC });
    } catch (e) {
      await data.remove(`subscription:${TOPIC}:${connectionId}`);
    }
  });

  await Promise.all(jobs);
});

data.on("updated:orders:*", async ({ item: { value: order } }) => {
  const subscriptions = await data.get<string>(`subscription:${TOPIC}:*`);

  const jobs = subscriptions.items.map(async ({ value: connectionId }) => {
    try {
      await ws.send(connectionId, { topic: TOPIC });
    } catch (e) {
      await data.remove(`subscription:${TOPIC}:${connectionId}`);
    }
  });

  await Promise.all(jobs);
});
