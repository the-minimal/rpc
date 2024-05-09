import type { AnyType } from "@the-minimal/protocol";
import { decode, encode } from "@the-minimal/protocol";
import type { Contract, InnerHandler, Method } from "@types";

export const procedure = <
	$Method extends Method,
	$Input extends AnyType,
	$Output extends AnyType,
>(
	contract: Contract<$Method, $Input, $Output>,
	handler: InnerHandler<$Input, $Output>,
) => ({
	contract,
	handler: async (value: ArrayBuffer) =>
		encode(contract.output, await handler(decode(contract.input, value))),
});
