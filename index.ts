import "@ampt/nextjs/entrypoint";

import { ws } from "@ampt/sdk";
import { onDisconnect, onMessage } from "./app/lib/subscribe/socket";
import "./app/barista/events";
import "./app/orders/[orderId]/events";

ws.on("connected", (conn) => {
  // console.log("entry connected");
});

ws.on("disconnected", (conn) => {
  // console.log("entry disconnected");
  onDisconnect(conn);
});

ws.on("message", (conn, message) => {
  // console.log("entry message", message);
  onMessage(conn, message);
});
