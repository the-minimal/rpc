import { InferQueries, InferMutations, Namespaces, Nullable, Procedure } from "./types";

type InferKey<$NamespaceKey, $ProcedureKey> = `${string & $NamespaceKey}/${string & $ProcedureKey}`;

type InferInput<$Procedure> = $Procedure extends Procedure ? Parameters<$Procedure>[0]: never;

type InferOutput<$Procedure> = $Procedure extends Procedure ? ReturnType<$Procedure>: never;

const getSearch = (input: Nullable<Record<string, any> | any[]>) => {
	if(input) {
		const params = new URLSearchParams(input);

		params.sort();

		return params.toString();
	} else {
		return "";
	}
};

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
		) => {
			return fetch(`${base}/${key}${getSearch(input)}`, {
				method: "GET"
			}) as InferOutput<$Procedure>;
		},
		mutate: <
			$NamespaceKey extends keyof $Mutations,
			$ProcedureKey extends keyof $Mutations[$NamespaceKey],
			$Procedure = $Mutations[$NamespaceKey][$ProcedureKey]
		>(
			key: InferKey<$NamespaceKey, $ProcedureKey>,
			input: InferInput<$Procedure>,
		) => {
			return fetch(`${base}/${key}`, {
				method: "POST",
				body: JSON.stringify(input),
			}) as InferOutput<$Procedure>;
		},
	};
};
