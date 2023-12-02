import "@ampt/nextjs/entrypoint";

import { ws } from "@ampt/sdk";
import {
  onDisconnect as onDisconnectBarista,
  onMessage as onMessageBarista,
} from "./app/barista/events";
import {
  onDisconnect as onDisconnectCOrders,
  onMessage as onMessageCOrders,
} from "./app/orders/events";
import {
  onDisconnect as onDisconnectOrder,
  onMessage as onMessageOrder,
} from "./app/orders/[orderId]/events";

ws.on("connected", (conn) => {
  // console.log("entry connected");
});

ws.on("disconnected", (conn) => {
  // console.log("entry disconnected");
  onDisconnectBarista(conn);
  onDisconnectCOrders(conn);
  onDisconnectOrder(conn);
});

ws.on("message", (conn, message) => {
  // console.log("entry message", message);
  onMessageBarista(conn, message);
  onMessageCOrders(conn, message);
  onMessageOrder(conn, message);
});
