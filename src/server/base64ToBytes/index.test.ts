import { describe, expect, it } from "vitest";
import { base64ToBytes } from "./index.js";

describe("base64ToBytes", () => {
	it("should return bytes based on base64", async () => {
		const bytes = await base64ToBytes("AQID");

		expect(bytes).toEqual(new Uint8Array([1, 2, 3]));
	});
});
