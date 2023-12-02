import { data } from "@ampt/data";
import { SocketConnection, ws } from "@ampt/sdk";

export async function onMessage(conn: SocketConnection, message: any) {
  const { event, topic } = message;

  if (event === "subscribe" && topic === "orders") {
    const subscriptionKey = `subscription:orders:${conn.connectionId}`;
    await data.set<string>(subscriptionKey, conn.connectionId);
    // console.log("subscribed to orders", { subscriptionKey });
  }

  if (event === "unsubscribe" && topic === "orders") {
    const subscriptionKey = `subscription:orders:${conn.connectionId}`;
    await data.remove(subscriptionKey);
    // console.log("unsubscribed from orders", { subscriptionKey });
  }
}

export async function onDisconnect(conn: SocketConnection) {
  // console.log("disconnected");
  const subscriptionKey = `subscription:orders:${conn.connectionId}`;
  await data.remove(subscriptionKey);
  // console.log("unsubscribed from orders", { subscriptionKey });
}

data.on("created:orders:*", async ({ item: { value: order } }) => {
  // console.log("created:orders:*", order);
  const subscriptions = await data.get<string>("subscription:orders:*");

  const jobs = subscriptions.items.map(async ({ value: connectionId }) => {
    try {
      await ws.send(connectionId, {
        event: "created",
        topic: "orders",
        data: order,
      });
    } catch (e) {
      console.log("error sending to connection", { connectionId, e });
      await data.remove(`subscription:orders:${connectionId}`);
    }
  });

  await Promise.all(jobs);
});
