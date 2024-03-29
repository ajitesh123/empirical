import { Dataset, DatasetSample } from "@empiricalrun/types";
import { red, green } from "picocolors";
import { promises as fs } from "fs";

async function parseDataset(
  path: string,
  contents: string,
): Promise<Dataset | undefined> {
  if (path.endsWith("json")) {
    // This assumes the json is a well-formed Empirical dataset
    const data = await fs.readFile(path);
    return JSON.parse(data.toString());
  } else if (path.endsWith("jsonl")) {
    // This assumes the jsonl has 1 set of inputs per line
    // and builds up the Empirical dataset format
    const data = await fs.readFile(path);
    const lines = data.toString().split("\n");
    let samples: DatasetSample[] = [];
    for (let [index, line] of lines.entries()) {
      if (line.length === 0) {
        continue;
      }
      try {
        const inputs = JSON.parse(line);
        samples.push({ id: index.toString(), inputs: inputs });
      } catch (error) {
        console.log(
          `${red("[Error]")} Failed to parse line in ${path}: ${line}`,
        );
      }
    }
    return { id: path, samples: samples };
  } else if (path.endsWith("csv")) {
    throw new Error("csv files are not supported.");
  }
}

async function fetchContents(path: string): Promise<string> {
  if (path.startsWith("http")) {
    const response = await fetch(path);
    return await response.text();
  } else {
    const data = await fs.readFile(path);
    return data.toString();
  }
}

async function addSampleIds(dataset: Dataset) {
  if (dataset.samples) {
    dataset.samples.forEach((sample, index) => {
      if (!sample.id) sample.id = (index + 1).toString();
    });
  }
}

export async function loadDataset(dsConfig: any): Promise<Dataset | undefined> {
  let dataset = { ...dsConfig };
  if (dsConfig.path && !dsConfig.samples) {
    try {
      const contents = await fetchContents(dsConfig.path);
      const parsed = await parseDataset(dsConfig.path, contents);
      if (parsed) {
        dataset.samples = parsed.samples;
        console.log(
          `${green("[Success]")} Dataset fetched from ${dsConfig.path}`,
        );
      }
    } catch (error) {
      console.log(
        `${red("[Error]")} Failed to fetch dataset at ${dsConfig.path}\nError: ${error}`,
      );
      return;
    }
  }
  await addSampleIds(dataset);
  return dataset;
}
