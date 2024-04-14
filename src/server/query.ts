import { Handler, Input, Json, Maybe, Nullable, Procedure, Records } from "../types";

export const query = <
	$Input extends Nullable<Records> = null,
	$Output extends Maybe<Json> = void,
>(
	input: Nullable<Input<$Input>>,
	handler: Handler<NoInfer<$Input>, $Output>,
): Procedure<"query", NoInfer<$Input>, NoInfer<$Output>> => ({
	type: "query",
	input,
	handler,
});
