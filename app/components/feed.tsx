import Image from "next/image";
import { params } from "@ampt/sdk";

import "server-only";

import { setTimeout } from "timers/promises";

async function getData() {
  await setTimeout(1000);
  return {
    items: [
      {
        key: "1",
        from: "The Ampt Team",
        to: params("ENV_NAME"),
        subject: "Welcome to Ampt!",
      },
    ],
  };
}

export function FeedSkeleton() {
  return (
    <div className="m-4 p-4 border rounded-md mx-auto">
      <div className="flex animate-pulse flex-row items-center h-full justify-center space-x-5">
        <div className="w-8 h-8 bg-gray-300 rounded-full "></div>
        <div className="flex flex-col space-y-3">
          <div className="w-48 bg-gray-300 h-6 rounded-md "></div>
          <div className="w-48 bg-gray-300 h-6 rounded-md "></div>
          <div className="w-96 bg-gray-300 h-6 rounded-md "></div>
        </div>
      </div>
    </div>
  );
}

export async function Feed() {
  const data = await getData();

  return data.items.map((item) => (
    <div key={item.key} className="m-4 p-4 border rounded-md mx-auto">
      <div className="flex flex-row items-center h-full justify-center space-x-5">
        <div className="rounded-full w-8 h-8">
          <Image src="/favicon-32.png" alt="Ampt Logo" width={32} height={32} />
        </div>
        <div className="flex flex-col space-y-3">
          <div className="w-48 h-6 rounded-md ">From: {item.from}</div>
          <div className="w-48 h-6 rounded-md ">To: {item.to}</div>
          <div className="w-96 h-6 rounded-md ">Subject: {item.subject}</div>
        </div>
      </div>
    </div>
  ));
}
