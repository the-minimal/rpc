import { PROCEDURE_MAP, PROCEDURE_NOT_FOUND_ERROR } from "@constants";
import { fc, it } from "@fast-check/vitest";
import {
	userRegisterContract,
	userRegisterContractNoAssert,
	userRegisterProcedure,
} from "@tests";
import { decode, encode, init } from "@the-minimal/protocol";
import { beforeEach, describe, expect } from "vitest";
import { universalArrayRouter, universalMapRouter } from "./index.js";

describe("router", () => {
	describe("universal", () => {
		describe("universalMapRouter", () => {
			const callProcedure = universalMapRouter([userRegisterProcedure]);

			beforeEach(() => {
				init();
			});

			it.prop({
				email: fc.string({ minLength: 5, maxLength: 50 }),
				password: fc.string({ minLength: 8, maxLength: 16 }),
			})("should return 200 Response", async (value) => {
				const encoded = encode(userRegisterContract.input, value);

				const response = await callProcedure(
					new Request("https://example.com/user/register", {
						method: "POST",
						body: encoded,
						headers: {
							"Content-Type": "application/octet-stream",
							"Content-Length": `${encoded.byteLength}`,
						},
					}),
				);

				expect(PROCEDURE_MAP.size).toBe(1);

				expect(response.ok).toBe(true);
				expect(response.status).toBe(200);

				const decoded = decode(
					userRegisterContract.output,
					await response.arrayBuffer(),
				);

				expect(decoded).toEqual({
					id: "1234567890",
				});
			});

			it.prop({
				email: fc.string({ minLength: 5, maxLength: 50 }),
				password: fc.string({ minLength: 8, maxLength: 16 }),
			})("should return 404 Response", async (value) => {
				const encoded = encode(userRegisterContract.input, value);

				const response = await callProcedure(
					new Request("https://example.com/user/nope", {
						method: "POST",
						body: encoded,
						headers: {
							"Content-Type": "application/octet-stream",
							"Content-Length": `${encoded.byteLength}`,
						},
					}),
				);

				expect(PROCEDURE_MAP.size).toBe(1);

				expect(response.ok).toBe(false);
				expect(response.status).toBe(404);
				expect(await response.text()).toBe(PROCEDURE_NOT_FOUND_ERROR);
			});

			it.prop({
				email: fc.string({ minLength: 60, maxLength: 120 }),
				password: fc.string({ minLength: 0, maxLength: 6 }),
			})("should return 500 Response", async (value) => {
				const encoded = encode(userRegisterContractNoAssert.input, value);

				const response = await callProcedure(
					new Request("https://example.com/user/register", {
						method: "POST",
						body: encoded,
						headers: {
							"Content-Type": "application/octet-stream",
							"Content-Length": `${encoded.byteLength}`,
						},
					}),
				);

				expect(PROCEDURE_MAP.size).toBe(1);

				expect(response.ok).toBe(false);
				expect(response.status).toBe(500);
				expect(await response.text()).toBe("Email");
			});
		});

		describe("universalArrayRouter", () => {
			const callProcedure = universalArrayRouter([userRegisterProcedure]);

			beforeEach(() => {
				init();
				PROCEDURE_MAP.clear();
			});

			it.prop({
				email: fc.string({ minLength: 5, maxLength: 50 }),
				password: fc.string({ minLength: 8, maxLength: 16 }),
			})("should return 200 Response", async (value) => {
				const encoded = encode(userRegisterContract.input, value);

				const response = await callProcedure(
					new Request("https://example.com/user/register", {
						method: "POST",
						body: encoded,
						headers: {
							"Content-Type": "application/octet-stream",
							"Content-Length": `${encoded.byteLength}`,
						},
					}),
				);

				expect(PROCEDURE_MAP.size).toBe(0);

				expect(response.ok).toBe(true);
				expect(response.status).toBe(200);

				const decoded = decode(
					userRegisterContract.output,
					await response.arrayBuffer(),
				);

				expect(decoded).toEqual({
					id: "1234567890",
				});
			});

			it.prop({
				email: fc.string({ minLength: 5, maxLength: 50 }),
				password: fc.string({ minLength: 8, maxLength: 16 }),
			})("should return 404 Response", async (value) => {
				const encoded = encode(userRegisterContract.input, value);

				const response = await callProcedure(
					new Request("https://example.com/user/nope", {
						method: "POST",
						body: encoded,
						headers: {
							"Content-Type": "application/octet-stream",
							"Content-Length": `${encoded.byteLength}`,
						},
					}),
				);

				expect(PROCEDURE_MAP.size).toBe(0);

				expect(response.ok).toBe(false);
				expect(response.status).toBe(404);
				expect(await response.text()).toBe(PROCEDURE_NOT_FOUND_ERROR);
			});

			it.prop({
				email: fc.string({ minLength: 60, maxLength: 120 }),
				password: fc.string({ minLength: 0, maxLength: 6 }),
			})("should return 500 Response", async (value) => {
				const encoded = encode(userRegisterContractNoAssert.input, value);

				const response = await callProcedure(
					new Request("https://example.com/user/register", {
						method: "POST",
						body: encoded,
						headers: {
							"Content-Type": "application/octet-stream",
							"Content-Length": `${encoded.byteLength}`,
						},
					}),
				);

				expect(PROCEDURE_MAP.size).toBe(0);

				expect(response.ok).toBe(false);
				expect(response.status).toBe(500);
				expect(await response.text()).toBe("Email");
			});
		});
	});
});
