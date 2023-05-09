import { ExecutionStatus } from "@eventual/core";
import { TestEnvironment } from "@eventual/testing";
import {
  processOrder,
  processPayment,
} from "../../src/orchestration-vs-choreography/orchestration.js";

let env: TestEnvironment;

// if there is pollution between tests, call reset()
beforeAll(async () => {
  env = new TestEnvironment();
});

test("shipOrder should not be called if processPayment throws", async () => {
  // mock the processPayment API to throw an error
  env.mockTask(processPayment).fail(new Error("failed to process payment"));

  // start the processOrder workflow
  const execution = await env.startExecution({
    workflow: processOrder,
    input: "orderId",
  });

  // allow the simulator to advance time
  await env.tick();

  // get the status of the workflow
  const status = (await execution.getStatus()).status;

  // assert it failed
  expect(status).toEqual(ExecutionStatus.FAILED);
});
