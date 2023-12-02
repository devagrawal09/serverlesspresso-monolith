import { data } from "@ampt/data";
import { SocketConnection, ws } from "@ampt/sdk";

export async function onMessage(conn: SocketConnection, message: any) {
  const { event, topic }: { event: string; topic: string } = message;

  if (event === "subscribe" && topic.startsWith("orderId:")) {
    const orderId = topic.split(":")[1];
    const subscriptionKey = `subscription:${orderId}:${conn.connectionId}`;
    await data.set<string>(subscriptionKey, conn.connectionId, {
      label1: `connectionId:${conn.connectionId}`,
    });
    console.log(`subscribed to order ${orderId}`, { subscriptionKey });
  }
}

export async function onDisconnect(conn: SocketConnection) {
  // console.log("disconnected");
  const subscriptions = await data.getByLabel(
    "label1",
    `connectionId:${conn.connectionId}`
  );
  await Promise.all(
    subscriptions.items.map(async ({ key }) => {
      await data.remove(key);
    })
  );
  // console.log("unsubscribed from orders", { subscriptionKey });
}

data.on("updated:orders:*", async ({ item: { value: order } }) => {
  // console.log("created:orders:*", order);
  const subscriptions = await data.get<string>(`subscription:${order.id}:*`);

  const jobs = subscriptions.items.map(async ({ value: connectionId }) => {
    try {
      await ws.send(connectionId, {
        event: "updated",
        topic: `orderId:${order.id}`,
        data: order,
      });
    } catch (e) {
      console.log("error sending to connection", { connectionId, e });
      await data.remove(`subscription:orders:${connectionId}`);
    }
  });

  await Promise.all(jobs);
});
