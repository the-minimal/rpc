import type { Contract, Procedure, Protocol } from "@types";

export const procedure = (
	contract: Contract<Procedure.Type, Protocol, unknown, unknown, unknown>,
	handler: Procedure.InnerHandler<unknown, unknown>,
) => ({
	contract,
	handler: async (value: unknown) =>
		contract.output.encode(await handler(contract.input.decode(value))),
});
