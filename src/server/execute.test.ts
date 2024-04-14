import { it, expect } from "bun:test";
import { query } from "./query";
import { mutation } from "./mutation";
import { execute } from "./execute";
import { Procedures } from "../types";

const headers = {
	hello: "world"
};

const data = { 
	age: "26", 
	name: "yamiteru" 
};

function userInput(data: unknown): asserts data is { age: string, name: string } {}

const procedures = {
		one: query(userInput, async (data) => ({ data: { age: data.age, name: data.name }, headers })),
		two: mutation(userInput, async (data) => ({ data: { age: data.age, name: data.name }, headers })),
} satisfies Procedures;

it("should throw error when procedure isn't provided", async () => {
	const url = "http://localhost";

	expect(() => execute(procedures, "", new URL(url), new Request(url, { method: "GET" }))).toThrow();
});

it("should throw error when procedure doesn't exist", async () => {
	const url = "http://localhost/nope";

	expect(() => execute(procedures, "nope", new URL(url), new Request(url, { method: "GET" }))).toThrow();
});

it("should execute query procedure", async () => {
	const url = "http://localhost/one?age=26&name=yamiteru";
	const req = new Request(url, { method: "GET" });
	const output = await execute(procedures, "one", new URL(url), req);

	expect(output).toHaveProperty("headers");
	expect(output).toHaveProperty("data");
	expect(output).toEqual({ data, headers });
});

it("should execute mutation procedure", async () => {
	const url = "http://localhost/two";
	const req = new Request(url, { method: "POST", body: JSON.stringify(data), headers: { "content-type": "application/json" } });
	const output = await execute(procedures, "two", new URL(url), req);		

	expect(output).toHaveProperty("headers");
	expect(output).toHaveProperty("data");
	expect(output).toEqual({ data, headers });
});

