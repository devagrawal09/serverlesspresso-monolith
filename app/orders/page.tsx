import { data } from "@ampt/data";
import Link from "next/link";
import { Order } from "./[orderId]/page";
import { LiveCustomerOrdersView } from "./liveview";

export default async function OrdersPage() {
  const userId = "anonymous";
  const orders = await data.get<Order>("orders:*");
  const user = { name: "Dev Agrawal", email: "dev@clerk.dev" };
  // console.log(`OrdersPage`, { orders });

  if (!orders.items.length) {
    return (
      <p>
        There are no orders.{" "}
        <Link
          href="/"
          className="
          text-amber-800
          font-semibold
          hover:underline
          hover:text-amber-600
        "
        >
          Place an order
        </Link>
      </p>
    );
  }

  return (
    <>
      <LiveCustomerOrdersView
        orders={orders.items.map(({ value }) => value)}
        user={user}
      />
      <Link
        href="/"
        className="
          text-amber-800
          font-semibold
          hover:underline
          hover:text-amber-600
        "
      >
        Place an order
      </Link>
    </>
  );
}
