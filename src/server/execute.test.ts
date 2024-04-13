import { describe, it, expect } from "bun:test";
import { query } from "./query";
import { mutation } from "./mutation";
import { execute } from "./execute";

const headers = {
	hello: "world"
};
const data = { 
	age: "26", 
	name: "yamiteru" 
};

function userInput(data: unknown): asserts data is { age: string, name: string } {}

const routes = {
	test: {
		one: query(userInput, async (data) => ({ data: { age: data.age, name: data.name }, headers })),
		two: mutation(userInput, async (data) => ({ data: { age: data.age, name: data.name }, headers })),
	}
};

it("should throw error when namespace isn't provided", async () => {
	expect(() => execute(routes, new Request("http://localhost", { method: "GET" }))).toThrow();
});

it("should throw error when namespace doesn't exist", async () => {
	expect(() => execute(routes, new Request("http://localhost/nope", { method: "GET" }))).toThrow();
});

it("should throw error when procedure isn't provided", async () => {
	expect(() => execute(routes, new Request("http://localhost/test", { method: "GET" }))).toThrow();
});

it("should throw error when procedure doesn't exist", async () => {
	expect(() => execute(routes, new Request("http://localhost/test/nope", { method: "GET" }))).toThrow();
});

it("should execute query procedure", async () => {
	const req = new Request("http://localhost/test/one?age=26&name=yamiteru", { method: "GET" });
	const output = await execute(routes, req);

	expect(output).toHaveProperty("headers");
	expect(output).toHaveProperty("data");
	expect(output).toEqual({ data, headers });
});

it("should execute mutation procedure", async () => {
	const req = new Request("http://localhost/test/two", { method: "POST", body: JSON.stringify(data), headers: { "content-type": "application/json" } });
	const output = await execute(routes, req);		

	expect(output).toHaveProperty("headers");
	expect(output).toHaveProperty("data");
	expect(output).toEqual({ data, headers });
});

