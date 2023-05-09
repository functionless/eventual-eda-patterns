import { z } from "zod";
import { event, subscription } from "@eventual/core";

export const OrderCreated = event(
  "OrderCreated",
  z.object({
    orderId: z.string(),
  })
);

export const PaymentProcessed = event(
  "PaymentProcessed",
  z.object({
    orderId: z.string(),
    paymentId: z.string(),
  })
);

export const OrderShipped = event(
  "OrderShipped",
  z.object({
    orderId: z.string(),
    shipmentId: z.string(),
  })
);

export const processOrderPayment = subscription(
  "processOrderPayment",
  {
    events: [OrderCreated],
  },
  async (event) => {
    // process the payment using an API (e.g. stripe)
    const paymentId = await chargeCard(event.orderId);

    // emit an event that the payment was processed
    await PaymentProcessed.emit({
      orderId: event.orderId,
      paymentId,
    });
  }
);

async function chargeCard(orderId: string) {
  // charge, e.g. call stripe
  console.log("processing payment for order", orderId);
  return "payment-id";
}

export const shipOrderAfterPayment = subscription(
  "shipOrderAfterPayment",
  {
    events: [PaymentProcessed],
  },
  async (event) => {
    // call the shipOrder API
    const shipmentId = await shipOrder(event.orderId);

    // publish an event recording that the order has been shipped
    await OrderShipped.emit({
      orderId: event.orderId,
      shipmentId,
    });
  }
);

async function shipOrder(orderId: string) {
  // integrate with the shipping API (etc.)
  console.log("shipping order", orderId);
  return "shipment-id";
}

export const updateOrderStatusSubscription = subscription(
  "updateOrderStatus",
  {
    events: [OrderShipped],
  },
  async (event) => {
    await updateOrder(event.orderId, { status: "Shipped" });
  }
);

async function updateOrder(orderId: string, input: { status: string }) {
  // update the order database (e.g. DynamoDB)
  console.log("updating order", orderId, input);
}
