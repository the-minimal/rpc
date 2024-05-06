import type { Contract, Procedure, Protocol } from "./types.js";

export const procedure = (
	contract: Contract<Procedure.Type, Protocol, unknown, unknown, unknown>,
	handler: Procedure.InnerHandler<unknown, unknown>,
) => ({
	contract,
	handler: async (value: unknown) => {
		const decoded = contract.input.decode(value);
		const result = await handler(decoded);
		const encoded = contract.output.encode(result);

		return encoded;
	},
});
