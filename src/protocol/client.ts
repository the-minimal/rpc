import { client } from "../client";
import type { Protocol } from "../types";

export const protocolClient = client<Protocol.Binary>(
	"application/octet-stream",
	"arrayBuffer",
);
