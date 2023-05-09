import { task, workflow } from "@eventual/core";

export const processOrder = workflow(
  "processOrder",
  async (orderId: string) => {
    const paymentId = await processPayment(orderId);

    const shippingId = await shipOrder(orderId);

    await updateOrderStatus({
      orderId,
      status: "Shipped",
    });

    return {
      orderId,
      paymentId,
      shippingId,
    };
  }
);

export const processPayment = task(
  "processPayment",
  async (orderId: string) => {
    // (integrate with your payment API, e.g. Stripe)
    console.log("processing order", orderId);
    return "payment-id";
  }
);

export const shipOrder = task("shipOrder", async (orderId: string) => {
  // integrate with the shipping API (etc.)
  console.log("shipping order", orderId);
  return "tracking-id";
});

export const updateOrderStatus = task(
  "updateOrderStatus",
  async (input: { orderId: string; status: string }) => {
    // update the order database (e.g. DynamoDB)
    console.log("updating order", input);
  }
);
