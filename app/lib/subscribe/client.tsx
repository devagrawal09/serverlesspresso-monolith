"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useWebSocket from "react-use-websocket";

import type { ServerMessage, ClientMessage } from "./socket";

export function ClientSubscription({
  url,
  token,
  children,
}: {
  children?: React.ReactNode;
  url: string;
  token: string;
}) {
  const router = useRouter();

  const { lastMessage, sendJsonMessage, readyState } =
    useWebSocket<ServerMessage>(url);

  useEffect(() => {
    switch (readyState) {
      case -1:
        console.log("idle");
        break;
      case 0:
        console.log("connecting");
        break;
      case 1:
        console.log("connected");
        break;
      case 2:
        console.log("disconnecting");
        break;
      case 3:
        console.log("disconnected");
        break;
    }
  }, [readyState]);

  useEffect(() => {
    if (!lastMessage) return;

    const message = JSON.parse(lastMessage.data);

    if (message === "refresh") {
      router.refresh();
    }
  }, [lastMessage, router]);

  useEffect(() => {
    if (!readyState) return;

    if (readyState === 1) {
      console.log("sending token", token);
      sendJsonMessage<ClientMessage>({ token });
    }
  }, [token, readyState, sendJsonMessage]);

  return <>{children}</>;
}
