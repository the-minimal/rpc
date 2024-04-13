import { it, expect, spyOn } from "bun:test";
import { mutation, query } from "../server";
import { createHttpClient } from "./createHttpClient";

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

const client = createHttpClient<typeof routes>("http://localhost");
const querySpy = spyOn(client, "query");
const mutateSpy = spyOn(client, "mutate");

it("should call query procedure", () => {
	(querySpy as any)("test/one", data);

	expect(querySpy).toHaveBeenCalledTimes(1);
	expect(querySpy).toHaveBeenCalledWith("test/one", data);
});

it("should call mutate procedure", () => {
	(mutateSpy as any)("test/two", data);

	expect(mutateSpy).toHaveBeenCalledTimes(1);
	expect(mutateSpy).toHaveBeenCalledWith("test/two", data);
});
