import { describe, it, expect } from "bun:test";
import { getSearch } from "./utils";

describe("getSearch", () => {
	it("should convert object to string", () => {
		expect(getSearch({ a: 1, b: 2, })).toBe("a=1&b=2");
	});

	it("should convert null to empty string", () => {
		expect(getSearch(null)).toBe("");
	});
});

