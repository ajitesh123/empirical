import { expect, test } from "vitest";
import { checkLlmCriteria } from "./criteria";

test("llm-criteria works with sql semantics", async () => {
  const [scoreResult] = await checkLlmCriteria({
    sample: {
      id: "1",
      inputs: {},
      expected: "SELECT * FROM users",
    },
    output: {
      value: "SELECT * FROM users",
    },
    config: {
      type: "llm-criteria",
      criteria: "The output must be a valid SQL SELECT statement.",
    },
  });
  expect(scoreResult?.score).toBe(1);
  expect(scoreResult?.message).toContain("valid SQL SELECT statement");
  expect(scoreResult?.name).toBe("llm-criteria");
});

test("llm-criteria handles invalid config", async () => {
  const [scoreResult] = await checkLlmCriteria({
    sample: {
      id: "1",
      inputs: {},
    },
    output: {
      value: "some output",
    },
    config: {
      type: "invalid-type",
    },
  });
  expect(scoreResult?.score).toBe(0);
  expect(scoreResult?.message).toContain("invalid scoring function detected");
  expect(scoreResult?.name).toBe("llm-criteria");
});

test("llm-criteria handles LLM errors", async () => {
  const [scoreResult] = await checkLlmCriteria({
    sample: {
      id: "1",
      inputs: {},
    },
    output: {
      value: "some output",
    },
    config: {
      type: "llm-criteria",
      criteria: "{{invalid_placeholder}}",
    },
  });
  expect(scoreResult?.score).toBe(0);
  expect(scoreResult?.message).toContain("Failed to call LLM");
  expect(scoreResult?.name).toBe("llm-criteria");
});