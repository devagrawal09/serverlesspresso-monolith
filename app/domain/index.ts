import { v4 as uuid } from "uuid";
import {
  getCurrentCode,
  incrementCurrentCode,
  setCurrentCode,
  setOrder,
} from "@/app/db";

export type GetOrder = (orderId: string) => Promise<Order | undefined>;
export type SetOrder = (order: Order) => Promise<any>;

export type Coffee = {
  id: string;
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

export const progressOrder =
  (getOrder: GetOrder, setOrder: SetOrder) => async (orderId: string) => {
    const order = await getOrder(orderId);

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

    await setOrder(order);
  };

export const placeOrder = async ({
  code,
  userId,
  coffee,
}: {
  code: number;
  userId: string;
  coffee: Coffee;
}) => {
  const currentCode = await getCurrentCode();

  if (!currentCode) {
    throw new Error("No code set");
  }

  if (code !== currentCode.code) {
    throw new Error("Invalid code");
  }

  if (currentCode.uses >= 4) {
    throw new Error("Code already used! Please wait for a new one");
  }

  const res = await incrementCurrentCode();
  console.log(`consumeCode`, { res });

  const order = await setOrder({
    id: uuid(),
    userId,
    coffee,
    status: "pending",
  });

  console.log(`placeOrder`, { order });

  return order as Order;
};

export const refreshCode = async () => {
  const randomCode = Math.floor(Math.random() * 10000);
  await setCurrentCode({ code: randomCode, uses: 0 });
};
