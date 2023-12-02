import Link from "next/link";
import { setTimeout } from "timers/promises";

export async function Catalog() {
  await setTimeout(1000);

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
