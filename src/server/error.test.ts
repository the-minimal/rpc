import { expect, it } from "bun:test";
import { error } from "./error";

it("should throw custom error", () => {
	const code = 500;
	const message = "Somethign went wrong";
	const fn = () => {
		try {
			error(code, message);
		} catch (e) {
			return e;
		}
	};

  expect(fn()).toEqual({ message, code });
});
