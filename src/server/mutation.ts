import { Handler, Input, Json, Maybe, Nullable, Procedure, Records } from "../types";

export const mutation = <
	$Input extends Nullable<Records> = null,
	$Output extends Maybe<Json> = void,
>(
	input: Nullable<Input<$Input>>,
	handler: Handler<NoInfer<$Input>, $Output>,
): Procedure<"mutation", NoInfer<$Input>, NoInfer<$Output>> => ({
	type: "mutation",
	input,
	handler,
});
