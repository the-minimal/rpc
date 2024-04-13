import { it, expect } from "bun:test";
import { mutation } from "./mutation";

it("should create query procedure", () => {
	const input = () => {};
	const handler = () => {};
	const procedure = mutation(input, handler as any);

	expect(procedure.type).toBe("mutation");
	expect(procedure.input).toBe(input);
	expect(procedure.handler).toBe(handler as any);
});
