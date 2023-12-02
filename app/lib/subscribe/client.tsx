"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function ClientSubscription(props: {
  children?: React.ReactNode;
  url: string;
  token: string;
}) {
  const router = useRouter();
  const socketRef = useRef<WebSocket>();
  const connectedPromiseRef = useRef<Promise<void>>();

  useEffect(() => {
    console.log("connecting");
    const socket = new WebSocket(props.url);
    socketRef.current = socket;

    connectedPromiseRef.current = new Promise((resolve) => {
      socket.addEventListener("open", () => {
        console.log("connected");
        resolve();
      });
    });

    socket.addEventListener("message", (e) => {
      console.log("message", e);
      const message = e.data;

      if (message === "refresh") {
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
  }, [props.url, router]);

  useEffect(() => {
    if (!socketRef.current) return;

    connectedPromiseRef.current?.then(() => {
      console.log("sending token", props.token);
      socketRef.current?.send(JSON.stringify({ token: props.token }));
    });
  }, [props.token]);

  return <>{props.children}</>;
}
