import { it } from "@fast-check/vitest";
import { userLoginProcedure, userRegisterProcedure } from "@tests";
import { Type } from "@types";
import { describe, expect } from "vitest";
import { findProcedure } from "./index.js";

describe("findProcedure", () => {
	const procedures = [userRegisterProcedure, userLoginProcedure];

	it("should return procedure if procedure is found", () => {
		expect(findProcedure(Type.Mutation, "/user/register", procedures)).toBe(
			userRegisterProcedure,
		);
		expect(findProcedure(Type.Mutation, "/user/login", procedures)).toBe(
			userLoginProcedure,
		);
	});

	it("should return undefined if procedure not found", () => {
		expect(findProcedure(Type.Query, "/user/register", procedures)).toBe(
			undefined,
		);
		expect(findProcedure(Type.Mutation, "/user/nope", procedures)).toBe(
			undefined,
		);
	});
});
