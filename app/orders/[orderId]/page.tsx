import { data } from "@ampt/data";
import { redirect } from "next/navigation";
import { LiveOrderView } from "./liveview";

export type Order = {
  id: string;
  userId: string;
  coffee: {
    id: number;
    name: string;
  };
  status: "pending" | "confirmed";
};

export default async function OrderPage({
  params: { orderId },
}: {
  params: { orderId: string };
}) {
  const order = await data.get<Order>(`orders:${orderId}`);
  const user = { name: "Dev Agrawal", email: "dev@clerk.dev" };
  if (!order) {
    redirect("/");
  }

  return <LiveOrderView order={order} user={user} />;
}
