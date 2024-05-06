import { client } from "../client.js";
import type { Protocol } from "../types.js";

export const jsonClient = client<Protocol.Json>("application/json", "json");
