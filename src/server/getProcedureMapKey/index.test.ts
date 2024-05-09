import { it } from "@fast-check/vitest";
import { Method } from "@types";
import { describe, expect } from "vitest";
import { getProcedureMapKey } from "./index.js";

describe("getProcedureMapKey", () => {
	it("should return Query key", () => {
		expect(getProcedureMapKey(Method.Get, "/test")).toBe("1:/test");
	});

	it("should return Mutation key", () => {
		expect(getProcedureMapKey(Method.Post, "/test")).toBe("0:/test");
	});
});
