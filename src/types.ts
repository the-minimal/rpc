export type Nullable<$Type> = $Type | null;

export type Namespaces = Record<string, Procedures>;

export type Procedures = Record<string, Procedure>;

export type Procedure<
	$Input = any, 
	$Output = any 
> = {
	input: (data: unknown) => $Input;
	handler: (data: $Input, req: Request) => Promise<$Output>;
	// TODO: what if ttl is dynamic?
	props: {
		ttl: string | number;
		protocol: Protocol 
	}
};

export type FilterQuery<$ProcedureKey extends string> = $ProcedureKey extends `query/${infer $Rest}`
	? $Rest
	: never

export type InferQuery<
	$Namespaces extends Namespaces,
	$NamespaceKey extends keyof $Namespaces
> = {
		[$ProcedureKey in keyof $Namespaces[$NamespaceKey] as FilterQuery<string & $ProcedureKey>]:
			$Namespaces[$NamespaceKey][$ProcedureKey];
	};

export type InferQueries<$Namespaces extends Namespaces> = {
	[$NamespaceKey in keyof $Namespaces]: InferQuery<$Namespaces, $NamespaceKey>;
};

export type FilterMutate<$ProcedureKey extends string> = $ProcedureKey extends `mutate/${infer $Rest}`
	? $Rest
	: never

export type InferMutation<
	$Namespaces extends Namespaces,
	$NamespaceKey extends keyof $Namespaces
> = {
		[$ProcedureKey in keyof $Namespaces[$NamespaceKey] as FilterMutate<string & $ProcedureKey>]:
			$Namespaces[$NamespaceKey][$ProcedureKey];
	};

export type InferMutations<$Namespaces extends Namespaces> = {
	[$NamespaceKey in keyof $Namespaces]: InferMutation<$Namespaces, $NamespaceKey>;
};

export type Protocol<
	$Decoded = any,
	$Encoded = any
> = {
	type: string,
	data: (req: Request) => Promise<$Encoded>,
	encode: (value: $Decoded) => $Encoded,
	decode: (value: $Encoded) => $Decoded
};
