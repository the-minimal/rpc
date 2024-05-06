import type { Contract, Procedure, Protocol } from "@types";
import { procedure } from "@utils";

export const jsonProcedure = procedure as <
	$Type extends Procedure.Type,
	$Input,
	$Output,
>(
	contract: Contract<$Type, Protocol.Json, $Input, $Output>,
	handler: Procedure.InnerHandler<$Input, $Output>,
) => Procedure.New<$Type, Protocol.Json, $Input, $Output>;
