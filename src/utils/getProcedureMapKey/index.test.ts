import { it } from "@fast-check/vitest";
import { describe, expect } from "vitest";
import { getProcedureMapKey } from "./index.js";

describe("getProcedureMapKey", () => {
	it("should return Query key", () => {
		expect(getProcedureMapKey("GET", "/test")).toBe("1:/test");
	});

	it("should return Mutation key", () => {
		expect(getProcedureMapKey("POST", "/test")).toBe("0:/test");
	});
});
