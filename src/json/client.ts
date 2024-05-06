import type { Protocol } from "@types";
import { client } from "@utils";

export const jsonClient = client<Protocol.Json>("application/json", "json");
