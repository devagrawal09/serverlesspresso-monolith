import { data } from "@ampt/data";
import { Order } from "../orders/[orderId]/page";
import { Subscribe } from "../lib/subscribe/server";

export type Code = {
  code: number;
  uses: number;
};

async function getCurrentCode() {
  // const randomCode = Math.floor(Math.random() * 10000);
  // await data.set<Code>("currentCode", { code: 1234, uses: 0 });
  const currentCode = await data.get<Code>("currentCode");
  return currentCode;
}

export default async function TvComponent() {
  const orders = await data.get<Order>(`orders:*`);
  const currentCode = await getCurrentCode();

  const { inQueue, readyForPickup } = orders.items.reduce<{
    inQueue: Order[];
    readyForPickup: Order[];
  }>(
    (acc, { value: order }) => {
      if (order.status === "confirmed") {
        acc.inQueue.push(order);
      } else if (order.status === "prepared") {
        acc.readyForPickup.push(order);
      }
      return acc;
    },
    { inQueue: [], readyForPickup: [] }
  );

  const max = Math.max(inQueue.length, readyForPickup.length);
  const arrayOfMax = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <div>
      <div className="text-right">
        <Subscribe to="orders" />
        <Subscribe to="currentCode" />
        {currentCode ? (
          <h2>
            {currentCode.uses >= 4 ? (
              <span className="text-2xl font-bold">
                Code expired
                <br />
                wait for a new one
              </span>
            ) : (
              <>
                <span className="text-6xl font-bold">{currentCode.code}</span>
                <br />
                {4 - currentCode.uses} uses left
              </>
            )}
          </h2>
        ) : null}
      </div>
      <table className="table-auto text-4xl">
        <thead className="mb-2">
          <tr>
            <th className="p-6" scope="col">
              In Queue
            </th>
            <th className="p-6" scope="col">
              Ready for Pickup
            </th>
          </tr>
        </thead>
        <tbody>
          {arrayOfMax.map((_, i) => (
            <tr key={i}>
              <td className="text-right pr-8">
                {inQueue[i]?.id.slice(
                  inQueue[i].id.length - 4,
                  inQueue[i].id.length
                )}
              </td>
              <td className="text-right pr-8">
                {readyForPickup[i]?.id.slice(
                  readyForPickup[i].id.length - 4,
                  readyForPickup[i].id.length
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
