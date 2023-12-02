import { emitTo } from "@/app/lib/subscribe/socket";
import { data } from "@ampt/data";
import { Order } from "./page";

data.on("updated:orders:*", async ({ item: { value } }) => {
  const order: Order = value;
  console.log("order updated", order);
  emitTo(`orders:${order.id}`);
});
