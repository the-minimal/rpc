import { type Infer, type Type, decode, encode } from "@the-minimal/protocol";
import { type Contract, type Procedure, Protocol } from "@types";
import type { ProtocolContract } from "./types.js";

export const protocolContract = <
	const $Type extends Procedure.Type,
	const $Input extends Type.Any,
	const $Output extends Type.Any,
>(
	contract: ProtocolContract<$Type, $Input, $Output>,
): Contract<$Type, Protocol.Binary, Infer<$Input>, Infer<$Output>> => ({
	type: contract.type,
	protocol: Protocol.Binary,
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
