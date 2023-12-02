import { data } from "@ampt/data";
import { SocketConnection, ws } from "@ampt/sdk";

const TOPIC = "CUSTOMER_ORDERS";

export async function onMessage(conn: SocketConnection, message: any) {
  const { event, topic } = message;

  if (event === "subscribe" && topic === TOPIC) {
    const subscriptionKey = `subscription:${TOPIC}:${conn.connectionId}`;
    await data.set<string>(subscriptionKey, conn.connectionId);
    // console.log("subscribed to orders", { subscriptionKey });
  }

  if (event === "unsubscribe" && topic === TOPIC) {
    const subscriptionKey = `subscription:${TOPIC}:${conn.connectionId}`;
    await data.remove(subscriptionKey);
    // console.log("unsubscribed from orders", { subscriptionKey });
  }
}

export async function onDisconnect(conn: SocketConnection) {
  // console.log("disconnected");
  const subscriptionKey = `subscription:${TOPIC}:${conn.connectionId}`;
  await data.remove(subscriptionKey);
  // console.log("unsubscribed from orders", { subscriptionKey });
}

data.on("created:orders:*", async ({ item: { value: order } }) => {
  // console.log("created:orders:*", order);
  const subscriptions = await data.get<string>(`subscription:${TOPIC}:*`);

  const jobs = subscriptions.items.map(async ({ value: connectionId }) => {
    try {
      await ws.send(connectionId, {
        event: "created",
        topic: TOPIC,
        data: order,
      });
    } catch (e) {
      console.log("error sending to connection", { connectionId, e });
      await data.remove(`subscription:${TOPIC}:${connectionId}`);
    }
  });

  await Promise.all(jobs);
});

data.on("updated:orders:*", async ({ item: { value: order } }) => {
  // console.log("created:orders:*", order);
  const subscriptions = await data.get<string>(`subscription:${TOPIC}:*`);

  const jobs = subscriptions.items.map(async ({ value: connectionId }) => {
    try {
      await ws.send(connectionId, {
        event: "updated",
        topic: TOPIC,
        data: order,
      });
    } catch (e) {
      console.log("error sending to connection", { connectionId, e });
      await data.remove(`subscription:${TOPIC}:${connectionId}`);
    }
  });

  await Promise.all(jobs);
});
