import { data } from "@ampt/data";
import { Order } from "../orders/[orderId]/page";
import { TvLive } from "./liveview";

export default async function TvComponent() {
  const orders = await data.get<Order>(`orders:*`);

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
        <TvLive />
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
