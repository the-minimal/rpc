import { procedure } from "../procedure";
import type { Contract, Procedure, Protocol } from "../types";

export const jsonProcedure = procedure as <
	$Type extends Procedure.Type,
	$Input,
	$Output,
>(
	contract: Contract<$Type, Protocol.Json, $Input, $Output>,
	handler: Procedure.InnerHandler<$Input, $Output>,
) => Procedure.New<$Type, Protocol.Json, $Input, $Output>;
