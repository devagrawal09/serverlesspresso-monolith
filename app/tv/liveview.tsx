"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function TvLive() {
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

  return <span>Live</span>;
}
