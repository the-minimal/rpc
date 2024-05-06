import { client } from "../client";
import type { Protocol } from "../types";

export const jsonClient = client<Protocol.Json>("application/json", "json");
