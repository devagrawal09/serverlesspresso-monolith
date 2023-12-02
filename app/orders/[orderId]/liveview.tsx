"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Order } from "./page";

export function LiveOrderView({
  order,
  user,
}: {
  order: Order;
  user: { name: string; email: string };
}) {
  const router = useRouter();

  useEffect(() => {
    console.log("connecting");
    const socket = new WebSocket("wss://innovative-binary-hbxlu.ampt.app");

    socket.addEventListener("open", () => {
      console.log("connected");

      socket.send(
        JSON.stringify({
          event: "subscribe",
          topic: `orderId:${order.id}`,
        })
      );
    });

    socket.addEventListener("message", (e) => {
      console.log("message", e);
      const { topic } = JSON.parse(e.data);

      if (topic === `orderId:${order.id}`) {
        router.refresh();
      }
    });

    socket.addEventListener("close", () => {
      console.log("disconnected");
    });

    socket.addEventListener("error", (error) => {
      console.error("error", error);
    });

    return () => socket.close();
  });

  return (
    <div className="flex flex-col gap-4">
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
    </div>
  );
}
