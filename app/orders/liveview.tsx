"use client";

import { useEffect, useState } from "react";
import { Order } from "../orders/[orderId]/page";

export function LiveCustomerOrdersView(props: {
  initialOrders: Order[];
  user: { name: string; email: string };
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
          topic: "CUSTOMER_ORDERS",
        })
      );
    });

    socket.addEventListener("message", (e) => {
      console.log("message", e);
      const { event, topic, data } = JSON.parse(e.data);

      if (event === "created" && topic === "CUSTOMER_ORDERS") {
        setOrders((orders) => [...orders, data]);
      }

      if (event === "updated" && topic === "CUSTOMER_ORDERS") {
        setOrders((orders) =>
          orders.map((order) => (order.id === data.id ? data : order))
        );
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
            <span className="font-semibold">Name:</span> {props.user.name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {props.user.email}
          </p>
          <p>
            <span className="font-semibold">{order.status}</span>
          </p>
        </li>
      ))}
    </ul>
  );
}
