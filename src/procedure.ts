import { type AnyType, decode, encode } from "@the-minimal/protocol";
import type { Contract, InnerHandler, Type } from "@types";

export const procedure = <
	$Type extends Type,
	$Input extends AnyType,
	$Output extends AnyType,
>(
	contract: Contract<$Type, $Input, $Output>,
	handler: InnerHandler<$Input, $Output>,
) => ({
	contract,
	handler: async (value: ArrayBuffer) =>
		encode(contract.output, await handler(decode(contract.input, value))),
});
