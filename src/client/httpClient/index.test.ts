import { DEFAULT_ERROR, PROCEDURE_NOT_FOUND_ERROR } from "@constants";
import { it } from "@fast-check/vitest";
import { userRegisterContract } from "@tests";
import { encode, init } from "@the-minimal/protocol";
import { beforeEach, describe, expect, vi } from "vitest";
import { httpClient } from "./index.js";

describe("client", () => {
	beforeEach(() => {
		init();
	});

	it("should return 200 Response", async () => {
		const baseUrl = "https://example.com";
		const url = `${baseUrl}/user/register`;

		const input = {
			email: "yamiteru@icloud.com",
			password: "Test123456",
		};

		const output = {
			id: "1234567890",
		};

		const encodedInput = encode(userRegisterContract.input, input);

		global.fetch = vi.fn().mockReturnValue({
			ok: true,
			status: 200,
			arrayBuffer: async () => encode(userRegisterContract.output, output),
		});

		const userRegister = httpClient(baseUrl, userRegisterContract);

		const data = await userRegister(input);

		expect(fetch).toHaveBeenCalledTimes(1);

		expect(fetch).toHaveBeenCalledWith(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/octet-stream",
				"Content-Length": `${encodedInput.byteLength}`,
			},
			body: encodedInput,
		});

		expect(data).toEqual({
			code: 200,
			data: output,
			error: null,
		});
	});

	it("should return custom error", async () => {
		const customUserRegisterContract = {
			...userRegisterContract,
			path: "/user/nope",
		};

		const baseUrl = "https://example.com";
		const url = `${baseUrl}/user/nope`;

		const input = {
			email: "yamiteru@icloud.com",
			password: "Test123456",
		};

		const encodedInput = encode(customUserRegisterContract.input, input);

		global.fetch = vi.fn().mockReturnValue({
			ok: false,
			status: 404,
			text: async () => PROCEDURE_NOT_FOUND_ERROR,
		});

		const userRegister = httpClient(baseUrl, customUserRegisterContract as any);

		const data = await userRegister(input);

		expect(fetch).toHaveBeenCalledTimes(1);

		expect(fetch).toHaveBeenCalledWith(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/octet-stream",
				"Content-Length": `${encodedInput.byteLength}`,
			},
			body: encodedInput,
		});

		expect(data).toEqual({
			code: 404,
			data: null,
			error: PROCEDURE_NOT_FOUND_ERROR,
		});
	});

	it("should return default error", async () => {
		const baseUrl = "https://example.com";
		const url = `${baseUrl}/user/register`;

		const input = {
			email: "yamiteru@icloud.com",
			password: "Test123456",
		};

		const encodedInput = encode(userRegisterContract.input, input);

		global.fetch = vi.fn().mockReturnValue({
			ok: false,
			status: 500,
			text: async () => "",
		});

		const userRegister = httpClient(baseUrl, userRegisterContract);

		const data = await userRegister(input);

		expect(fetch).toHaveBeenCalledTimes(1);

		expect(fetch).toHaveBeenCalledWith(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/octet-stream",
				"Content-Length": `${encodedInput.byteLength}`,
			},
			body: encodedInput,
		});

		expect(data).toEqual({
			code: 500,
			data: null,
			error: DEFAULT_ERROR,
		});
	});

	it("should locally fail assertion", async () => {
		const baseUrl = "https://example.com";

		const input = {
			email: "nope",
			password: "Test123456",
		};

		const output = {
			id: "1234567890",
		};

		global.fetch = vi.fn().mockReturnValue({
			ok: true,
			status: 200,
			arrayBuffer: async () => encode(userRegisterContract.output, output),
		});

		const userRegister = httpClient(baseUrl, userRegisterContract);

		const data = await userRegister(input);

		expect(fetch).toHaveBeenCalledTimes(0);

		expect(data).toEqual({
			code: 500,
			data: null,
			error: "Email",
		});
	});
});
