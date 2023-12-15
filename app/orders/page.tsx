import { Suspense } from "react";
import { data } from "@ampt/data";
import Link from "next/link";
import { setTimeout } from "timers/promises";

import type { Order } from "./[orderId]/page";

import { Subscribe } from "../lib/subscribe/server";

const DELAYS = Number(process.env.DELAYS || 0);

export default function OrdersPage() {
  console.log(`OrdersPage`);

  return (
    <div className="flex flex-col gap-4">
      <Subscribe to="orders" />

      <h1 className="text-xl">Hello Customer!</h1>
      <Suspense fallback={<p className="mb-4">Loading Orders...</p>}>
        <OrdersComponent />
      </Suspense>
    </div>
  );
}

async function OrdersComponent() {
  await setTimeout(DELAYS);

  const userId = "anonymous";
  const orders = await data.get<Order>("orders:*");
  const user = { name: "Dev Agrawal", email: "dev@clerk.dev" };
  console.log(orders.items[0]);
  if (!orders.items.length) {
    return (
      <p>
        There are no orders.{" "}
        <Link
          href="/"
          className="
          text-amber-800
          font-semibold
          hover:underline
          hover:text-amber-600
        "
        >
          Place an order
        </Link>
      </p>
    );
  }

  return (
    <>
      <ul>
        {orders.items.map(({ value: order }) => (
          <li
            className="flex gap-4 m-2 p-3 border justify-between"
            key={order.id}
          >
            <h2>
              <span className="text-amber-800 font-semibold">
                {order.coffee.name}
              </span>
            </h2>
            <p>
              <span className="font-semibold">Name:</span> {user.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-semibold">{order.status}</span>
            </p>
          </li>
        ))}
      </ul>
      <Link
        href="/"
        className="
          text-amber-800
          font-semibold
          hover:underline
          hover:text-amber-600
        "
      >
        Place an order
      </Link>
    </>
  );
}
