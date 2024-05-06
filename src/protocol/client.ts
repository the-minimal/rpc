import type { Protocol } from "@types";
import { client } from "@utils";

export const protocolClient = client<Protocol.Binary>(
	"application/octet-stream",
	"arrayBuffer",
);
