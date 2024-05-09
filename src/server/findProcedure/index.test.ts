import { it } from "@fast-check/vitest";
import { userLoginProcedure, userRegisterProcedure } from "@tests";
import { describe, expect } from "vitest";
import { findProcedure } from "./index.js";

describe("findProcedure", () => {
	const procedures = [userRegisterProcedure, userLoginProcedure];

	it("should return procedure if procedure is found", () => {
		expect(findProcedure("POST", "/user/register", procedures)).toBe(
			userRegisterProcedure,
		);
		expect(findProcedure("POST", "/user/login", procedures)).toBe(
			userLoginProcedure,
		);
	});

	it("should return undefined if procedure not found", () => {
		expect(findProcedure("GET", "/user/register", procedures)).toBe(undefined);
		expect(findProcedure("POST", "/user/nope", procedures)).toBe(undefined);
	});
});
