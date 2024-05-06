import type { Type } from "@the-minimal/protocol";
import type { Procedure } from "../types.js";

export type ProtocolContract<
	$Type extends Procedure.Type,
	$Input extends Type.Any,
	$Output extends Type.Any,
> = {
	type: $Type;
	path: string;
	headers?: Procedure.Headers;
	input: $Input;
	output: $Output;
};
