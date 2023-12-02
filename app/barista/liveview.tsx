"use client";

import { useEffect, useState } from "react";
import { Order } from "../orders/[orderId]/page";
import { useRouter } from "next/navigation";

export function LiveOrdersView(props: {
  orders: Order[];
  progressOrder: (orderId: string) => Promise<void>;
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
          topic: "orders",
        })
      );
    });

    socket.addEventListener("message", (e) => {
      console.log("message", e);
      const { topic } = JSON.parse(e.data);

      if (topic === "orders") {
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
  }, []);

  return (
    <ul>
      {props.orders.map((order) => (
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
            <span className="font-semibold">{order.status}</span>
          </p>
          <p>
            <button
              className={`px-2 py-1 ${
                order.status === "pending"
                  ? "bg-blue-300"
                  : order.status === "confirmed"
                  ? "bg-green-300"
                  : order.status === "prepared"
                  ? "bg-yellow-300"
                  : "bg-red-300"
              }`}
              onClick={() => props.progressOrder(order.id)}
            >
              {order.status === "pending"
                ? "Confirm"
                : order.status === "confirmed"
                ? "Prepare"
                : order.status === "prepared"
                ? "Pick up"
                : "Reset"}
            </button>
          </p>
        </li>
      ))}
    </ul>
  );
}
