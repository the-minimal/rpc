import { Handler, Input, Json, Maybe, Nullable, Procedure } from "../types";

export const query = <
	$Input extends Nullable<Json> = null,
	$Output extends Maybe<Json> = void,
>(
	input: Nullable<Input<$Input>>,
	handler: Handler<NoInfer<$Input>, $Output>,
): Procedure<"query", NoInfer<$Input>, NoInfer<$Output>> => ({
	type: "query",
	input,
	handler,
});
