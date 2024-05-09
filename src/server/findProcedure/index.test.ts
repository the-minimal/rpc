import { it } from "@fast-check/vitest";
import { userLoginProcedure, userRegisterProcedure } from "@tests";
import { Method } from "@types";
import { describe, expect } from "vitest";
import { findProcedure } from "./index.js";

describe("findProcedure", () => {
	const procedures = [userRegisterProcedure, userLoginProcedure];

	it("should return procedure if procedure is found", () => {
		expect(findProcedure(Method.Post, "/user/register", procedures)).toBe(
			userRegisterProcedure,
		);
		expect(findProcedure(Method.Post, "/user/login", procedures)).toBe(
			userLoginProcedure,
		);
	});

	it("should return undefined if procedure not found", () => {
		expect(findProcedure(Method.Get, "/user/register", procedures)).toBe(
			undefined,
		);
		expect(findProcedure(Method.Post, "/user/nope", procedures)).toBe(
			undefined,
		);
	});
});
