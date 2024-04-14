import { Nullable, Procedures } from "../types";
import { InferInput, InferMutations, InferOutput, InferQueries } from "./types";
import { getSearch } from "./utils";

export const http = <
	$Procedures extends Procedures,
	$Queries = InferQueries<$Procedures>,
	$Mutations = InferMutations<$Procedures>,
>(base: string) => {
	return {
		query: <
			$ProcedureName extends keyof $Queries,
			$Procedure = $Queries[$ProcedureName]
		>(
			key: $ProcedureName & string,
			input: InferInput<$Procedure>,
			signal?: Nullable<AbortSignal>
		) => {
			return fetch(`${base}/${key}${getSearch(input)}`, {
				signal,
				method: "GET"
			}) as Promise<InferOutput<$Procedure>>;
		},
		mutate: <
			$ProcedureName extends keyof $Mutations,
			$Procedure = $Mutations[$ProcedureName]
		>(
			key: $ProcedureName & string,
			input: InferInput<$Procedure>,
			signal?: Nullable<AbortSignal>
		) => {
			return fetch(`${base}/${key}`, {
				signal,
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify(input)
			}) as Promise<InferOutput<$Procedure>>;
		},
	};
};
