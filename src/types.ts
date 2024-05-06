import type { AnyType, Infer } from "@the-minimal/protocol";

export enum Type {
	Mutation,
	Query,
}

export type Procedure<
	$Type extends Type,
	$Input extends AnyType,
	$Output extends AnyType,
> = {
	contract: Contract<$Type, $Input, $Output>;
	handler: OuterHandler;
};

export type AnyProcedure = Procedure<any, any, any>;

export type InnerHandler<$Input extends AnyType, $Output extends AnyType> = (
	value: Infer<$Input>,
) => Promise<Infer<$Output>>;

export type OuterHandler = (value: ArrayBuffer) => Promise<ArrayBuffer>;

export type Headers = Record<string, string>;

export type Contract<
	$Type extends Type,
	$Input extends AnyType,
	$Output extends AnyType,
> = {
	type: $Type;
	path: string;
	headers?: Headers;
	input: $Input;
	output: $Output;
};

export type Result<$Value> =
	| {
			code: number;
			data: $Value;
			error: null;
	  }
	| {
			code: number;
			data: null;
			error: string;
	  };
