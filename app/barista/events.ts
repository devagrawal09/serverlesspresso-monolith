import { data } from "@ampt/data";
import { emitTo } from "../lib/subscribe/socket";

data.on("*:orders:*", () => emitTo("orders"));
