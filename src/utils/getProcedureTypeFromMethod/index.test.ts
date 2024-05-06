import { it } from "@fast-check/vitest";
import { Type } from "@types";
import { describe, expect } from "vitest";
import { getProcedureTypeFromMethod } from "./index.js";

describe("getProcedureTypeFromMethod", () => {
	it("should return Query if === GET", () => {
		expect(getProcedureTypeFromMethod("GET")).toBe(Type.Query);
	});

	it("should return Mutation if !== GET", () => {
		expect(getProcedureTypeFromMethod("POST")).toBe(Type.Mutation);
	});
});
