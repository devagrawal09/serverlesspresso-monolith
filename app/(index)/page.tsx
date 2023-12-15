import { Suspense } from "react";
import Link from "next/link";
import { setTimeout } from "timers/promises";

const DELAYS = Number(process.env.DELAYS || 0);

export default function Home() {
  return (
    <>
      <Suspense fallback={<p>Loading Catalog...</p>}>
        <Catalog />
      </Suspense>
      <p className="text-center mt-10">
        <Link href="/orders" className="hover:underline">
          Orders View
        </Link>
        {" | "}
        <Link href="/barista" className="hover:underline">
          Barista View
        </Link>
        {" | "}
        <Link href="/tv" className="hover:underline">
          TV View
        </Link>
      </p>
    </>
  );
}

async function Catalog() {
  await setTimeout(DELAYS);

  const coffees = [
    { id: 1, name: "Espresso" },
    { id: 2, name: "Cappuccino" },
  ];

  return (
    <ul>
      {coffees.map((coffee) => (
        <li
          className="flex gap-4 m-2 p-3 border justify-between"
          key={coffee.id}
        >
          <h2>{coffee.name}</h2>
          <Link href={`/order?coffee=${coffee.id}`} className="p-2 bg-blue-300">
            Order
          </Link>
        </li>
      ))}
    </ul>
  );
}
