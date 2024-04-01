import { expect, test } from "vitest";
import { checkLlmFaithfulness } from "./faithfulness";

test("llm-faithfulness works", async () => {
  const [scoreResult] = await checkLlmFaithfulness({
    sample: {
      id: "1",
      inputs: {},
    },
    output: {
      value: "SELECT country ,  count(*) FROM singer GROUP BY country",
    },
    config: {
      type: "llm-faithfulness",
      context:
        "Hi, I'm Arjun. 👋\nI'm building empirical.run.\n\nI love building products for developers. As software “eats the world”, I believe developers have an opportunity to create immense value—and empowering them to do more drives me to work everyday. I've been lucky to do this as a day job for many years.\n\nI've built some side-projects too, like Covid Maps (featured on TechCrunch, YourStory and CityNews), Rubberduck, VS Code Chat, and the Startup Green Room podcast.\n\nIf there's a way I can help, feel free to reach out. I'm available at arjun@attam.in, or on Twitter DM.",
      claims: ["Arjun is building empirical.run.", "Arjun is building Twitter"],
    },
  });
  expect(scoreResult?.score).toBe(1);
  expect(scoreResult?.name).toBe("llm-criteria");
});
