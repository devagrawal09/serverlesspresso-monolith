import { task } from "@ampt/sdk";

import { emitTo } from "@/app/lib/subscribe/socket";
import { refreshCode } from "@/app/domain";

const refreshCodeTask = task("refresh code", async () => {
  console.log("refresh code");
  await refreshCode();
  await emitTo("currentCode");
});

refreshCodeTask.every("5 minutes");
