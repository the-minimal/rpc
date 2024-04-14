import { it, expect, spyOn } from "bun:test";
import { mutation, query } from "../server";
import { http } from "./http";
import { Procedures, Records } from "../types";

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
} satisfies Records<Procedures>;

const test = http<typeof routes.test>("http://localhost/test");
const querySpy = spyOn(test, "query");
const mutateSpy = spyOn(test, "mutate");

it("should call query procedure", () => {
	(querySpy as any)("one", data);

	expect(querySpy).toHaveBeenCalledTimes(1);
	expect(querySpy).toHaveBeenCalledWith("one", data);
});

it("should call mutate procedure", () => {
	(mutateSpy as any)("two", data);

	expect(mutateSpy).toHaveBeenCalledTimes(1);
	expect(mutateSpy).toHaveBeenCalledWith("two", data);
});
