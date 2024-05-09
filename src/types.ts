import type { AnyType, Infer } from "@the-minimal/protocol";

export enum Method {
	Post,
	Get,
}

export type Procedure<
	$Method extends Method,
	$Input extends AnyType,
	$Output extends AnyType,
> = {
	contract: Contract<$Method, $Input, $Output>;
	handler: OuterHandler;
};

export type AnyProcedure = Procedure<any, any, any>;

export type InnerHandler<$Input extends AnyType, $Output extends AnyType> = (
	value: Infer<$Input>,
) => Promise<Infer<$Output>>;

export type OuterHandler = (value: ArrayBuffer) => Promise<ArrayBuffer>;

export type Headers = Record<string, string>;

export type Path<$Value extends string> = `/${$Value}`;

export type AnyPath = Path<string>;

export type Contract<
	$Method extends Method,
	$Input extends AnyType,
	$Output extends AnyType,
> = {
	method?: $Method;
	headers?: Headers;
	path: AnyPath;
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
