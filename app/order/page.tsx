import { data } from "@ampt/data";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { setTimeout } from "timers/promises";
import Link from "next/link";
import { v4 as uuid } from "uuid";

import { emitTo } from "../lib/subscribe/socket";

import type { Code } from "../tv/page";
import type { Order } from "../orders/[orderId]/page";

const DELAYS = Number(process.env.DELAYS || 0);

const coffees = [
  { id: 1, name: "Espresso" },
  { id: 2, name: "Cappuccino" },
];

export default function OrderPage({
  searchParams,
}: {
  searchParams: { coffee: string };
}) {
  const coffee = coffees.find(
    (coffee) => coffee.id === Number(searchParams.coffee)
  );

  if (!coffee) {
    redirect("/");
  }

  return (
    <>
      <Suspense fallback={<p className="mb-4">Loading Order Form...</p>}>
        <OrderForm coffee={coffee} />
      </Suspense>
      <Link href="/" className="p-2 bg-red-400 mt-4">
        Back
      </Link>
    </>
  );
}

async function OrderForm({
  coffee,
}: {
  coffee: {
    id: number;
    name: string;
  };
}) {
  await setTimeout(DELAYS);

  async function placeOrder(formData: FormData) {
    "use server";
    await setTimeout(DELAYS);

    const userId = formData.get("userId")?.toString() || "anonymous";
    const code = Number(formData.get("code")?.toString() || 0);

    if (!coffee || !userId) {
      throw new Error("Missing name or email");
    }

    const currentCode = await data.get<Code>("currentCode");

    if (!currentCode) {
      throw new Error("No code set");
    }

    if (code !== currentCode.code) {
      throw new Error("Invalid code");
    }

    if (currentCode.uses >= 4) {
      throw new Error("Code already used! Please wait for a new one");
    }

    const res = await data.add<Code>("currentCode", "uses", 1);
    console.log(`consumeCode`, { res });
    emitTo("currentCode");

    const id = uuid();
    const orderKey = `orders:${id}`;

    const order = await data.set<Order>(orderKey, {
      id,
      userId,
      coffee,
      status: "pending",
    });
    console.log(`placeOrder`, { orderId: id, orderKey, order });

    redirect(`/orders/${id}`);
  }

  return (
    <form className="flex flex-col gap-4 mb-4" action={placeOrder}>
      <h1 className="text-xl">
        Order:{" "}
        <span className="text-amber-800 font-semibold">{coffee.name}</span>
      </h1>
      <input
        type="number"
        name="code"
        placeholder="Code"
        className="p-2 border border-gray-300"
        required
      />
      <button type="submit" className="p-2 bg-blue-300">
        Order
      </button>
    </form>
  );
}
