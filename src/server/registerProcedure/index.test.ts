import { PROCEDURE_MAP } from "@constants";
import { it } from "@fast-check/vitest";
import {
	userLoginContract,
	userLoginProcedure,
	userRegisterContract,
	userRegisterProcedure,
} from "@tests";
import { describe, expect } from "vitest";
import { registerProcedure } from "./index.js";

describe("registerProcedure", () => {
	it("should register procedure", () => {
		const procedures = [userRegisterProcedure, userLoginProcedure];

		registerProcedure(procedures);

		expect(PROCEDURE_MAP.size).toBe(2);
		expect(PROCEDURE_MAP.get(`POST:${userRegisterContract.path}`)).toBe(
			userRegisterProcedure,
		);
		expect(PROCEDURE_MAP.get(`POST:${userLoginContract.path}`)).toBe(
			userLoginProcedure,
		);
	});
});
