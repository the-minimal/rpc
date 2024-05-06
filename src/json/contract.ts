import { type Contract, type Procedure, Protocol } from "../types";
import type { JsonContract } from "./types";

export const jsonContract = <
	const $Type extends Procedure.Type,
	const $Input,
	const $Output,
>(
	contract: JsonContract<$Type, $Input, $Output>,
): Contract<$Type, Protocol.Json, $Input, $Output> => ({
	type: contract.type,
	protocol: Protocol.Json,
	path: contract.path,
	headers: contract.headers ?? {},
	input: {
		encode: (value) => {
			contract.input(value);
			return JSON.stringify(value);
		},
		decode: (value) => {
			const result = JSON.parse(value);
			contract.input(result);
			return result;
		},
	},
	output: {
		encode: (value) => {
			contract.output(value);
			return JSON.stringify(value);
		},
		decode: (value) => {
			const result = JSON.parse(value);
			contract.output(result);
			return result;
		},
	},
});
