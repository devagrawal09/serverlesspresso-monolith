import { data } from "@ampt/data";
import { redirect } from "next/navigation";
import { setTimeout } from "timers/promises";
import { Order } from "../orders/[orderId]/page";
import { v4 as uuid } from "uuid";
import Link from "next/link";

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

  async function placeOrder(formData: FormData) {
    "use server";

    const userId = formData.get("userId")?.toString() || "anonymous";

    if (!coffee || !userId) {
      throw new Error("Missing name or email");
    }

    await setTimeout(DELAYS);
    const id = uuid();
    const orderKey = `orders:${id}`;

    const order = await data.set<Order>(orderKey, {
      id,
      userId,
      coffee,
      status: "pending",
    });
    console.log(`placeOrder`, { orderId: id, orderKey, order });

    await setTimeout(DELAYS);
    redirect(`/orders/${id}`);
  }

  return (
    <>
      <form className="flex flex-col gap-4 mb-4" action={placeOrder}>
        <h1 className="text-xl">
          Order:{" "}
          <span className="text-amber-800 font-semibold">{coffee.name}</span>
        </h1>
        <button type="submit" className="p-2 bg-blue-300">
          Order
        </button>
      </form>
      <Link href="/" className="p-2 bg-red-400 mt-4">
        Back
      </Link>
    </>
  );
}
