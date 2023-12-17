import { data } from "@ampt/data";
import { v4 as uuid } from "uuid";

export type Coffee = {
  id: number;
  name: string;
};

export type Order = {
  id: string;
  userId: string;
  coffee: Coffee;
  status: "pending" | "confirmed" | "prepared" | "picked up";
};

export type Code = {
  code: number;
  uses: number;
};

export async function progressOrder(orderId: string) {
  const order = await data.get<Order>(`orders:${orderId}`);

  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  const status = order.status;

  if (status === "pending") {
    order.status = "confirmed";
  }

  if (status === "confirmed") {
    order.status = "prepared";
  }

  if (status === "prepared") {
    order.status = "picked up";
  }

  if (status === "picked up") {
    order.status = "pending";
  }

  await data.set(`orders:${order.id}`, order);
}

export async function placeOrder({
  code,
  userId,
  coffee,
}: {
  code: number;
  userId: string;
  coffee: Coffee;
}) {
  const currentCode = await data.get<Code>("currentCode");

  if (!currentCode) {
    throw new Error("No code set");
  }

  if (code !== currentCode.code) {
    throw new Error("Invalid code");
  }

  if (currentCode.uses >= 4) {
    throw new Error("Code already used! Please wait for a new one");
  }

  const res = await data.add<Code>("currentCode", "uses", 1);
  console.log(`consumeCode`, { res });

  const id = uuid();
  const orderKey = `orders:${id}`;

  const order = await data.set<Order>(orderKey, {
    id,
    userId,
    coffee,
    status: "pending",
  });

  console.log(`placeOrder`, { order });

  return order as Order;
}

export async function refreshCode() {
  const randomCode = Math.floor(Math.random() * 10000);
  await data.set<Code>("currentCode", { code: randomCode, uses: 0 });
}
