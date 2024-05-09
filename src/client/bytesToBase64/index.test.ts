import { describe, expect, it } from "vitest";
import { bytesToBase64 } from "./index.js";

describe("bytesToBase64", () => {
	it("should return a base64 string base on bytes", async () => {
		const base64 = await bytesToBase64(new Uint8Array([1, 2, 3]));

		expect(base64).toBe("AQID");
	});
});
