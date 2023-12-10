import { data } from "@ampt/data";
import { task } from "@ampt/sdk";
import type { Code } from "./page";
import { emitTo } from "../lib/subscribe/socket";

const refreshCodeTask = task("refresh code", async () => {
  console.log("refresh code");
  const randomCode = Math.floor(Math.random() * 10000);
  await data.set<Code>("currentCode", { code: randomCode, uses: 0 });
  await emitTo("currentCode");
});

refreshCodeTask.every("5 minutes");
