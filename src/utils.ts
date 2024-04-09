import { Protocol } from "./types";

export const protocolJson = {
	type: "application/json",
	data: (req) => req.text(),
	encode: JSON.stringify,
	decode: JSON.parse
} satisfies Protocol;
