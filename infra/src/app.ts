import { App, Stack, CfnOutput } from "aws-cdk-lib";
import { Service } from "@eventual/aws-cdk";

const app = new App();
const stack = new Stack(app, "eventual-eda-patterns");

import type * as service from "@eventual-eda-patterns/service";

new Service<typeof service>(stack, "Service", {
  name: "eventual-eda-patterns",
  entry: require.resolve("@eventual-eda-patterns/service"),
  subscriptions: {
    // e.g. configure memory for individual subscription lambda function
    processOrderPayment: {
      memorySize: 512,
    },
  },
  tasks: {
    // e.g. configure memory for individual task lambda function
    processPayment: {
      memorySize: 512,
    },
  },
});
