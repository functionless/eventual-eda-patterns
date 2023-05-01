import { App, Stack, CfnOutput } from "aws-cdk-lib";
import { Service } from "@eventual/aws-cdk";

const app = new App();
const stack = new Stack(app, "eventual-eda-patterns")

import type * as eventualedapatterns from "@eventual-eda-patterns/service"

const service = new Service<typeof eventualedapatterns>(stack, "Service", {
  name: "eventual-eda-patterns",
  entry: require.resolve("@eventual-eda-patterns/service")
});
