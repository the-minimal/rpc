import type { Assertion } from "@the-minimal/types";
import type { Procedure } from "@types";

export type JsonContract<$Type extends Procedure.Type, $Input, $Output> = {
	type: $Type;
	path: string;
	headers?: Procedure.Headers;
	input: Assertion<$Input>;
	output: Assertion<$Output>;
};
