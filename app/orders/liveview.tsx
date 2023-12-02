"use client";

import { useEffect } from "react";
import { Order } from "../orders/[orderId]/page";
import { useRouter } from "next/navigation";

const TOPIC = "CUSTOMER_ORDERS";

export function LiveCustomerOrdersView({
  orders,
  user,
}: {
  orders: Order[];
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
          topic: TOPIC,
        })
      );
    });

    socket.addEventListener("message", (e) => {
      console.log("message", e);
      const { topic } = JSON.parse(e.data);

      if (topic === TOPIC) {
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
  );
}
