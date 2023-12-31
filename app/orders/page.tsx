import { Suspense } from "react";
import Link from "next/link";
import { setTimeout } from "timers/promises";

import { Subscribe } from "@/app/lib/subscribe/server";
import { getOrders } from "@/app/db";

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
  const orders = await getOrders();
  const user = { name: "Dev Agrawal", email: "dev@clerk.dev" };

  if (!orders.length) {
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
        {orders.map((order) => (
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
