import { fc, it } from "@fast-check/vitest";
import {
	userRegisterContract,
	userRegisterContractNoAssert,
	userRegisterProcedure,
} from "@tests";
import { decode, encode, init } from "@the-minimal/protocol";
import { beforeEach, describe, expect } from "vitest";

describe("procedure", () => {
	beforeEach(() => {
		init();
	});

	it("should have contract and handler", () => {
		expect(userRegisterProcedure.contract).toEqual(userRegisterContract);
		expect(userRegisterProcedure.handler).toBeTypeOf("function");
	});

	it.prop({
		email: fc.string({ minLength: 5, maxLength: 50 }),
		password: fc.string({ minLength: 8, maxLength: 16 }),
	})("should return encoded data", async (value) => {
		const encoded = encode(userRegisterContract.input, value);

		const data = await userRegisterProcedure.handler(encoded);

		const decoded = decode(userRegisterContract.output, data);

		expect(decoded).toEqual({
			id: "1234567890",
		});
	});

	it.prop({
		email: fc.string({ minLength: 60, maxLength: 120 }),
		password: fc.string({ minLength: 0, maxLength: 6 }),
	})("should throw if assert is wrong", async (value) => {
		const encoded = encode(userRegisterContractNoAssert.input, value);

		await expect(() =>
			userRegisterProcedure.handler(encoded),
		).rejects.toThrow();
	});
});
