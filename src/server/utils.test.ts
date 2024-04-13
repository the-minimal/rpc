import { expect, it } from "bun:test";
import { searchToProxy } from "./utils";

it("should proxy URL search queries", () => {
	const age = "26";
	const name = "yamiteru";
	const search = `?age=${age}&name=${name}`;	
	const proxy = searchToProxy(search);

	expect(proxy.age).toBe(age);
	expect(proxy.name).toBe(name);
});
