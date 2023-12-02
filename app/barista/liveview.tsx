"use client";

import { useEffect, useState } from "react";
import { Order } from "../orders/[orderId]/page";

export function LiveOrdersView(props: {
  initialOrders: Order[];
  progressOrder: (orderId: string) => Promise<void>;
}) {
  const [orders, setOrders] = useState(props.initialOrders);

  useEffect(() => {
    setOrders(props.initialOrders);
  }, [props.initialOrders]);

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
      const { event, topic, data } = JSON.parse(e.data);

      if (event === "created" && topic === "orders") {
        setOrders((orders) => [...orders, data]);
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
            <span className="font-semibold">{order.status}</span>
          </p>

          <p>
            <button
              className="px-2 py-1 bg-blue-300"
              onClick={() => props.progressOrder(order.id)}
            >
              {order.status === "pending" ? "Confirm" : "Confirmed"}
            </button>
          </p>
        </li>
      ))}
    </ul>
  );
}
