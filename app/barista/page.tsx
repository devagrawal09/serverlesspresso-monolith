import { data } from "@ampt/data";
import { LiveOrdersView } from "./liveview";
import { Order } from "../orders/[orderId]/page";
import { revalidatePath } from "next/cache";

export default async function BaristaPage() {
  const orders = await data.get<Order>("orders:*");
  console.log(`BaristaPage`);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl">Hello Barista!</h1>
      <LiveOrdersView
        initialOrders={orders.items.map(({ value }) => value)}
        progressOrder={progressOrder}
      />
    </div>
  );
}

async function progressOrder(orderId: string) {
  "use server";
  const order = await data.get<Order>(`orders:${orderId}`);
  const status = order?.status;

  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  if (status === "pending") {
    order.status = "confirmed";
  }

  if (status === "confirmed") {
    order.status = "pending";
  }
  await data.set(`orders:${orderId}`, order);

  revalidatePath(`/barista`);
}
