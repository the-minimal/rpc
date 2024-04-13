import { Namespaces, Nullable } from "../types";
import { InferInput, InferKey, InferMutations, InferOutput, InferQueries } from "./types";
import { getSearch } from "./utils";

export const createHttpClient = <
	$Namespaces extends Namespaces,
	$Queries = InferQueries<$Namespaces>,
	$Mutations = InferMutations<$Namespaces>,
>(base: string) => {
	return {
		query: <
			$NamespaceKey extends keyof $Queries,
			$ProcedureKey extends keyof $Queries[$NamespaceKey],
			$Procedure = $Queries[$NamespaceKey][$ProcedureKey]
		>(
			key: InferKey<$NamespaceKey, $ProcedureKey>,
			input: InferInput<$Procedure>,
			signal?: Nullable<AbortSignal>
		) => {
			return fetch(`${base}/${key}${getSearch(input)}`, {
				signal,
				method: "GET"
			}) as Promise<InferOutput<$Procedure>>;
		},
		mutate: <
			$NamespaceKey extends keyof $Mutations,
			$ProcedureKey extends keyof $Mutations[$NamespaceKey],
			$Procedure = $Mutations[$NamespaceKey][$ProcedureKey]
		>(
			key: InferKey<$NamespaceKey, $ProcedureKey>,
			input: InferInput<$Procedure>,
			signal?: Nullable<AbortSignal>
		) => {
			return fetch(`${base}/${key}`, {
				signal,
				method: "POST",
				body: JSON.stringify(input)
			}) as Promise<InferOutput<$Procedure>>;
		},
	};
};
