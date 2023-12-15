"use client";

import { useEffect, useState } from "react";
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
  const [authenticated, setAuthenticated] = useState(false);

  const { lastMessage, sendJsonMessage, readyState } =
    useWebSocket<ServerMessage>(url, {
      onOpen: () => console.log("opened"),
      onMessage: (message) => console.log("message", message),
      onClose: () => console.log("closed"),
      onError: (error) => console.log("error", error),
      onReconnectStop: () => console.log("reconnect stop"),
      shouldReconnect: () => true,
    });

  useEffect(() => {
    if (!lastMessage) return;

    const message = JSON.parse(lastMessage.data);

    if (message === "refresh") {
      router.refresh();
    }
  }, [lastMessage, router]);

  useEffect(() => {
    if (!readyState) return;
    if (authenticated) return;

    if (readyState === 1) {
      console.log("sending token", token);
      sendJsonMessage<ClientMessage>({ token });
      setAuthenticated(true);
    }
  }, [token, readyState, authenticated, sendJsonMessage]);

  return <>{children}</>;
}
