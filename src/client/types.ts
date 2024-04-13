import { Procedure, Output, Namespaces } from "../types";

export type InferKey<$NamespaceKey, $ProcedureKey> = `${string & $NamespaceKey}/${string & $ProcedureKey}`;

export type InferInput<$Procedure> = $Procedure extends Procedure 
	? Parameters<$Procedure["handler"]>[0]
	: never;

export type InferOutput<$Procedure> = $Procedure extends Procedure 
	? ReturnType<$Procedure["handler"]> extends Promise<infer $Value>
		? $Value extends Output<infer $Output>
			? $Output
			: never
		: never
	: never;

type InferQuery<
	$Namespaces extends Namespaces,
	$NamespaceKey extends keyof $Namespaces
> = {
		[$ProcedureKey in keyof $Namespaces[$NamespaceKey] as $Namespaces[$NamespaceKey][$ProcedureKey] extends Procedure<"query"> ? $ProcedureKey: never]:
			$Namespaces[$NamespaceKey][$ProcedureKey];
	};

export type InferQueries<$Namespaces extends Namespaces> = {
	[$NamespaceKey in keyof $Namespaces]: InferQuery<$Namespaces, $NamespaceKey>;
};

type InferMutation<
	$Namespaces extends Namespaces,
	$NamespaceKey extends keyof $Namespaces
> = {
		[$ProcedureKey in keyof $Namespaces[$NamespaceKey] as $Namespaces[$NamespaceKey][$ProcedureKey] extends Procedure<"mutation"> ? $ProcedureKey: never]:
			$Namespaces[$NamespaceKey][$ProcedureKey];
	};

export type InferMutations<$Namespaces extends Namespaces> = {
	[$NamespaceKey in keyof $Namespaces]: InferMutation<$Namespaces, $NamespaceKey>;
};
