export namespace Procedure {
	export enum Type {
		Query,
		Mutation,
	}
	
	export type New<$Type extends Type, $Input, $Output, $Raw> = {
		contract: Contract<$Type, $Input, $Output, $Raw>;
		handler: OuterHandler;
	};

	export type Any = New<Type, unknown, unknown, unknown>;

	export type InnerHandler<$Input, $Output> = (value: $Input) => Promise<$Output>;
	export type OuterHandler = (request: Request) => Promise<Response>;

	export type Headers = Record<string, string>;
}

export type Contract<
	$Type extends Procedure.Type, 
	$Input, 
	$Output, 
	$Raw
> = {
	type: $Type;
	path: string;
	headers: Procedure.Headers;
	input: {
		encode: (value: $Input) => $Raw;
		decode: (value: $Raw) => $Input;
	};
	output: {
		encode: (value: $Output) => $Raw;
		decode: (value: $Raw) => $Output;
	};
};


