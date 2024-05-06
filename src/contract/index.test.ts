import { it } from "@fast-check/vitest";
import { userRegisterContract } from "@tests";
import { describe, expect } from "vitest";
import { contract } from "./index.js";

describe("contract", () => {
	it("should return contract", () => {
		expect(contract(userRegisterContract)).toEqual(userRegisterContract);
	});
});
