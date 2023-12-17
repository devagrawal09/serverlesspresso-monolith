import { expect, test } from "vitest";
import { Order, progressOrder } from ".";

test("progressOrder", () => {
  const id = "1";
  let order: Order;
  const getOrder = async (id: string) => order;
  const setOrder = async (updated: Order) => (order = updated);

  test("should update order status to in-progress", async () => {
    setOrder({
      id,
      userId: "1",
      coffee: { id: "1", name: "latte" },
      status: "pending",
    });

    await progressOrder(getOrder, setOrder)(id);

    expect(order.status).toBe<Order["status"]>("confirmed");
  });

  test("should update order status to ready", async () => {
    setOrder({
      id,
      userId: "1",
      coffee: { id: "1", name: "latte" },
      status: "confirmed",
    });

    await progressOrder(getOrder, setOrder)(id);

    expect(order.status).toBe<Order["status"]>("prepared");
  });

  test("should update order status to picked up", async () => {
    setOrder({
      id,
      userId: "1",
      coffee: { id: "1", name: "latte" },
      status: "prepared",
    });

    await progressOrder(getOrder, setOrder)(id);

    expect(order.status).toBe<Order["status"]>("picked up");
  });

  test("should reset order status to pending", async () => {
    setOrder({
      id,
      userId: "1",
      coffee: { id: "1", name: "latte" },
      status: "picked up",
    });

    await progressOrder(getOrder, setOrder)(id);

    expect(order.status).toBe<Order["status"]>("pending");
  });
});
