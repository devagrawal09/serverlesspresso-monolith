import { data } from "@ampt/data";
import Link from "next/link";
import { Order } from "./[orderId]/page";

export default async function OrdersPage() {
  const userId = "anonymous";
  const orders = await data.get<Order>("orders:*");
  const user = { name: "Dev Agrawal", email: "dev@clerk.dev" };
  console.log(`OrdersPage`, { orders });

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
      <ul>
        {orders.items.map(({ value: order }) => (
          <li
            className="flex gap-4 m-2 p-3 border justify-between"
            key={order.id}
          >
            <h2>
              <span className="text-amber-800 font-semibold">
                {order.coffee.name}
              </span>
            </h2>
            <p>
              <span className="font-semibold">Name:</span> {user.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-semibold">{order.status}</span>
            </p>
          </li>
        ))}
      </ul>
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
