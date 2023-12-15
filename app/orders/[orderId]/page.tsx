import { data } from "@ampt/data";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { setTimeout } from "timers/promises";

import { Subscribe } from "@/app/lib/subscribe/server";

const DELAYS = Number(process.env.DELAYS || 0);

export type Order = {
  id: string;
  userId: string;
  coffee: {
    id: number;
    name: string;
  };
  status: "pending" | "confirmed" | "prepared" | "picked up";
};

export default async function OrderPage({
  params: { orderId },
}: {
  params: { orderId: string };
}) {
  return (
    <div className="flex flex-col gap-4">
      <Subscribe to={`orders:${orderId}`} />
      <Suspense>
        <OrderComponent orderId={orderId} />
      </Suspense>
    </div>
  );
}

async function OrderComponent({ orderId }: { orderId: string }) {
  await setTimeout(DELAYS);

  const order = await data.get<Order>(`orders:${orderId}`);
  const user = { name: "Dev Agrawal", email: "dev@clerk.dev" };

  if (!order) {
    redirect("/");
  }

  return (
    <>
      <h1 className="text-xl">
        Order:{" "}
        <span className="text-amber-800 font-semibold">
          {order.coffee.name}
        </span>
      </h1>
      <p>
        <span className="font-semibold">Name:</span> {user.name}
      </p>
      <p>
        <span className="font-semibold">Email:</span> {user.email}
      </p>
      <p>
        <span className="font-semibold">
          <span className="text-amber-800 font-semibold">{order.status}</span>
        </span>
      </p>
      <p className="mt-4">
        <Link href="/orders">All Orders</Link>
      </p>
    </>
  );
}
