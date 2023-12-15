import { data } from "@ampt/data";
import { Suspense } from "react";
import { setTimeout } from "timers/promises";

import { Subscribe } from "../lib/subscribe/server";
import { emitTo } from "../lib/subscribe/socket";

import type { Order } from "../orders/[orderId]/page";

const DELAYS = Number(process.env.DELAYS || 0);

export default function BaristaPage() {
  console.log(`BaristaPage`);

  return (
    <div className="flex flex-col gap-4">
      <Subscribe to="orders" />

      <h1 className="text-xl">Hello Barista!</h1>
      <Suspense fallback={<p className="mb-4">Loading Orders...</p>}>
        <BaristaView />
      </Suspense>
    </div>
  );
}

async function BaristaView() {
  await setTimeout(DELAYS);

  const orders = await data.get<Order>("orders:*");

  return (
    <ul>
      {orders.items.map(({ value: o }) => (
        <li className="flex gap-4 m-2 p-3 border justify-between" key={o.id}>
          <h2>
            <span className="text-amber-800 font-semibold">
              {o.coffee.name}
            </span>
          </h2>
          <p>
            <span className="font-semibold">{o.status}</span>
          </p>
          <form
            action={async function progressOrder() {
              "use server";
              await setTimeout(DELAYS);

              const order = await data.get<Order>(`orders:${o.id}`);
              const status = order?.status;

              if (!order) {
                throw new Error(`Order not found: ${o.id}`);
              }

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

              emitTo("orders");
              emitTo(`orders:${order.id}`);
            }}
          >
            <button
              type="submit"
              className={`px-2 py-1 ${
                o.status === "pending"
                  ? "bg-blue-300"
                  : o.status === "confirmed"
                  ? "bg-green-300"
                  : o.status === "prepared"
                  ? "bg-yellow-300"
                  : "bg-red-300"
              }`}
            >
              {o.status === "pending"
                ? "Confirm"
                : o.status === "confirmed"
                ? "Prepare"
                : o.status === "prepared"
                ? "Pick up"
                : "Reset"}
            </button>
          </form>
        </li>
      ))}
    </ul>
  );
}
