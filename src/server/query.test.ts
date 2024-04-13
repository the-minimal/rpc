import { it, expect } from "bun:test";
import { query } from "./query";

it("should create query procedure", () => {
	const input = () => {};
	const handler = () => {};
	const procedure = query(input, handler as any);

	expect(procedure.type).toBe("query");
	expect(procedure.input).toBe(input);
	expect(procedure.handler).toBe(handler as any);
});
