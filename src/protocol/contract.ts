import type { Infer, Type } from "@the-minimal/protocol";
import { decode, encode } from "@the-minimal/protocol";
import type { Contract, Procedure } from "../types";
import type { ProtocolContract } from "./types";

export const protocolContract = <
	const $Type extends Procedure.Type,
	const $Input extends Type.Any,
	const $Output extends Type.Any,
>(
	contract: ProtocolContract<$Type, $Input, $Output>,
): Contract<$Type, Infer<$Input>, Infer<$Output>, ArrayBuffer> => ({
	type: contract.type,
	path: contract.path,
	headers: contract.headers ?? {},
	input: {
		encode: (value) => encode(contract.input, value),
		decode: (value) => decode(contract.input, value),
	},
	output: {
		encode: (value) => encode(contract.output, value),
		decode: (value) => decode(contract.output, value),
	},
});
