import { data } from "@ampt/data";
import type { Code, Coffee, Order } from "@/app/domain";

export const getOrder = (orderId: string) =>
  data.get<Order>(`orders:${orderId}`);

export const getOrders = () =>
  data
    .get<Order>("orders:*")
    .then((data) => data.items.map(({ value }) => value));

export const setOrder = (order: Order) => data.set(`orders:${order.id}`, order);

export const getCurrentCode = () => data.get<Code>("currentCode");

export const incrementCurrentCode = () =>
  data.add<Code>("currentCode", "uses", 1);

export const setCurrentCode = ({ code, uses }: Code) =>
  data.set("currentCode", { code, uses });

export const getCoffee = (coffeeId: string) =>
  data.get<Coffee>(`coffee:${coffeeId}`);

export const getCoffees = () =>
  data
    .get<Coffee>("coffee:*")
    .then((data) => data.items.map(({ value }) => value));
