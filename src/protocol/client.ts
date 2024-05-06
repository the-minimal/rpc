import { client } from "../client.js";
import type { Protocol } from "../types.js";

export const protocolClient = client<Protocol.Binary>(
	"application/octet-stream",
	"arrayBuffer",
);
